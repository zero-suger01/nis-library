const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM contributors ORDER BY name').all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { name, contact, address, card_number, card_expiry, card_type } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const result = db.prepare(
    'INSERT INTO contributors (name, contact, address, card_number, card_expiry, card_type) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, contact || '', address || '', card_number || '', card_expiry || '', card_type || '');

  const contributor = db.prepare('SELECT * FROM contributors WHERE id = ?').get(result.lastInsertRowid);
  res.json(contributor);
});

router.patch('/:id', (req, res) => {
  const { name, contact, address, card_number, card_expiry, card_type } = req.body;
  db.prepare(`
    UPDATE contributors SET
      name        = COALESCE(?, name),
      contact     = COALESCE(?, contact),
      address     = COALESCE(?, address),
      card_number = COALESCE(?, card_number),
      card_expiry = COALESCE(?, card_expiry),
      card_type   = COALESCE(?, card_type)
    WHERE id = ?
  `).run(name, contact, address, card_number, card_expiry, card_type, req.params.id);

  const contributor = db.prepare('SELECT * FROM contributors WHERE id = ?').get(req.params.id);
  if (!contributor) return res.status(404).json({ error: 'Not found' });
  res.json(contributor);
});

// GET all transactions that generated rewards for this contributor
router.get('/:id/earnings', (req, res) => {
  const rows = db.prepare(`
    SELECT t.id, t.book_title, t.type, t.price, t.rental_days,
           t.reward_amount, t.status, t.created_at,
           b.reward_percentage
    FROM   transactions t
    JOIN   books b ON t.book_id = b.id
    WHERE  b.contributor_id = ? AND t.status = 'confirmed' AND t.reward_amount > 0
    ORDER  BY t.created_at DESC
  `).all(req.params.id);
  res.json(rows);
});

// Mark all owed earnings as paid
router.post('/:id/pay', (req, res) => {
  const contributor = db.prepare('SELECT * FROM contributors WHERE id = ?').get(req.params.id);
  if (!contributor) return res.status(404).json({ error: 'Not found' });
  if (contributor.total_earnings_owed === 0) {
    return res.status(400).json({ error: 'Nothing to pay out' });
  }

  db.prepare(`
    UPDATE contributors
    SET total_earnings_paid  = total_earnings_paid + total_earnings_owed,
        total_earnings_owed  = 0
    WHERE id = ?
  `).run(req.params.id);

  const updated = db.prepare('SELECT * FROM contributors WHERE id = ?').get(req.params.id);
  req.io.emit('contributor_updated', updated);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  db.prepare('UPDATE books SET contributor_id = NULL, reward_percentage = 0 WHERE contributor_id = ?')
    .run(req.params.id);
  db.prepare('DELETE FROM contributors WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
