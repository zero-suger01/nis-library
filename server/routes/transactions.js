const express = require('express');
const router  = express.Router();
const db      = require('../db');

const FULL_SELECT = `
  SELECT t.*,
         b.author, b.shelf, b.aisle, b.reward_percentage, b.is_gift,
         c.name AS contributor_name
  FROM   transactions t
  JOIN   books b ON t.book_id = b.id
  LEFT   JOIN contributors c ON b.contributor_id = c.id
`;

router.get('/', (_req, res) => {
  const rows = db.prepare(`${FULL_SELECT} ORDER BY t.created_at DESC`).all();
  res.json(rows);
});

// Active rentals sorted by return_date — must be before /:id
router.get('/active-rentals', (_req, res) => {
  const rows = db.prepare(`
    ${FULL_SELECT}
    WHERE t.type = 'rent' AND t.status = 'confirmed'
    ORDER BY t.return_date ASC
  `).all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const {
    book_id, book_title, type, price, rental_days,
    renter_name, renter_phone1, renter_phone2, renter_address,
  } = req.body;

  if (!book_id || !book_title || !type || !price) {
    return res.status(400).json({ error: 'book_id, book_title, type and price are required' });
  }

  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(book_id);

  const returnDate = (type === 'rent' && rental_days)
    ? new Date(Date.now() + Number(rental_days) * 86400000).toISOString().split('T')[0]
    : null;

  const charityAmount = book?.is_gift ? price : 0;

  const result = db.prepare(`
    INSERT INTO transactions
      (book_id, book_title, type, price, rental_days, contributor_id,
       renter_name, renter_phone1, renter_phone2, renter_address, return_date, charity_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    book_id, book_title, type, price,
    rental_days || null,
    book?.contributor_id || null,
    renter_name    || null,
    renter_phone1  || null,
    renter_phone2  || null,
    renter_address || null,
    returnDate,
    charityAmount
  );

  const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
  req.io.emit('new_transaction', transaction);
  res.json(transaction);
});

router.patch('/:id/status', (req, res) => {
  const { status, book_status } = req.body;

  const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

  // Reward calculation on confirm (skip for charity/gift books)
  if (status === 'confirmed' && transaction.status !== 'confirmed') {
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(transaction.book_id);
    if (book && !book.is_gift && book.contributor_id && book.reward_percentage > 0) {
      const rewardAmount = Math.round(transaction.price * book.reward_percentage);
      db.prepare('UPDATE transactions SET reward_amount = ? WHERE id = ?').run(rewardAmount, transaction.id);
      db.prepare('UPDATE contributors SET total_earnings_owed = total_earnings_owed + ? WHERE id = ?')
        .run(rewardAmount, book.contributor_id);
      req.io.emit('contributor_updated',
        db.prepare('SELECT * FROM contributors WHERE id = ?').get(book.contributor_id));
    }
  }

  db.prepare('UPDATE transactions SET status = ? WHERE id = ?').run(status, transaction.id);

  if (book_status) {
    db.prepare('UPDATE books SET status = ? WHERE id = ?').run(book_status, transaction.book_id);
    const book = db.prepare(`
      SELECT b.*, c.name AS contributor_name
      FROM   books b LEFT JOIN contributors c ON b.contributor_id = c.id
      WHERE  b.id = ?
    `).get(transaction.book_id);
    if (book) req.io.emit('book_updated', book);
  }

  const updated = db.prepare(`${FULL_SELECT} WHERE t.id = ?`).get(transaction.id);
  req.io.emit('transaction_updated', updated);
  res.json(updated);
});

router.delete('/', (req, res) => {
  const { ids, type } = req.body;
  if (Array.isArray(ids) && ids.length > 0) {
    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`DELETE FROM transactions WHERE id IN (${placeholders})`).run(...ids);
  } else if (type === 'buy' || type === 'rent') {
    db.prepare('DELETE FROM transactions WHERE type = ?').run(type);
  } else {
    db.prepare('DELETE FROM transactions').run();
  }
  req.io.emit('transactions_cleared', { type: type || 'all' });
  res.json({ success: true });
});

module.exports = router;
