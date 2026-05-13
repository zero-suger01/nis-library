const express = require('express');
const router  = express.Router();
const db      = require('../db');

const BASE_QUERY = `
  SELECT b.*, c.name AS contributor_name
  FROM   books b
  LEFT   JOIN contributors c ON b.contributor_id = c.id
`;

router.get('/', (req, res) => {
  const { search } = req.query;
  const books = search
    ? db.prepare(`${BASE_QUERY} WHERE b.title LIKE ? OR b.author LIKE ? ORDER BY b.title`)
        .all(`%${search}%`, `%${search}%`)
    : db.prepare(`${BASE_QUERY} ORDER BY b.title`).all();
  res.json(books);
});

router.get('/:id', (req, res) => {
  const book = db.prepare(`${BASE_QUERY} WHERE b.id = ?`).get(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

router.post('/', (req, res) => {
  const { title, author, shelf, aisle, price, pages, category, contributor_id, reward_percentage,
          cover_image, images, language, paper_type, book_size, is_gift, cover_type, script, condition } = req.body;
  if (!title || !author || !shelf || !aisle || !price || !pages) {
    return res.status(400).json({ error: 'title, author, shelf, aisle, price and pages are required' });
  }
  const result = db.prepare(`
    INSERT INTO books (title, author, shelf, aisle, price, pages, category, contributor_id, reward_percentage,
                       cover_image, images, language, paper_type, book_size, is_gift, cover_type, script, condition)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title, author, shelf, aisle,
    Number(price), Number(pages),
    category || 'General',
    contributor_id || null,
    reward_percentage ? Number(reward_percentage) : 0,
    cover_image || null,
    JSON.stringify(Array.isArray(images) ? images : []),
    language || "O'zbek",
    paper_type || "oq qog'oz",
    book_size || '',
    is_gift ? 1 : 0,
    cover_type || 'yumshoq',
    script || 'lotin',
    condition != null ? Number(condition) : 100
  );

  const book = db.prepare(`${BASE_QUERY} WHERE b.id = ?`).get(result.lastInsertRowid);
  req.io.emit('book_added', book);
  res.json(book);
});

router.patch('/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Book not found' });

  const {
    title, author, shelf, aisle, price, pages,
    category, status, contributor_id, reward_percentage,
    cover_image, images, language, paper_type, book_size, is_gift, cover_type, script, condition,
  } = req.body;

  db.prepare(`
    UPDATE books SET
      title             = COALESCE(?, title),
      author            = COALESCE(?, author),
      shelf             = COALESCE(?, shelf),
      aisle             = COALESCE(?, aisle),
      price             = COALESCE(?, price),
      pages             = COALESCE(?, pages),
      category          = COALESCE(?, category),
      status            = COALESCE(?, status),
      contributor_id    = ?,
      reward_percentage = COALESCE(?, reward_percentage),
      cover_image       = ?,
      images            = ?,
      language          = COALESCE(?, language),
      paper_type        = COALESCE(?, paper_type),
      book_size         = ?,
      is_gift           = COALESCE(?, is_gift),
      cover_type        = COALESCE(?, cover_type),
      script            = ?,
      condition         = COALESCE(?, condition)
    WHERE id = ?
  `).run(
    title, author, shelf, aisle,
    price != null ? Number(price) : null,
    pages != null ? Number(pages) : null,
    category, status,
    contributor_id !== undefined ? (contributor_id || null) : current.contributor_id,
    reward_percentage != null ? Number(reward_percentage) : null,
    cover_image !== undefined ? (cover_image || null) : current.cover_image,
    images !== undefined ? JSON.stringify(Array.isArray(images) ? images : []) : current.images,
    language || null,
    paper_type || null,
    book_size !== undefined ? book_size : current.book_size,
    is_gift !== undefined ? (is_gift ? 1 : 0) : null,
    cover_type || null,
    script !== undefined ? script : current.script,
    condition != null ? Number(condition) : null,
    req.params.id
  );

  const book = db.prepare(`${BASE_QUERY} WHERE b.id = ?`).get(req.params.id);
  req.io.emit('book_updated', book);
  res.json(book);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
  req.io.emit('book_deleted', { id: Number(req.params.id) });
  res.json({ success: true });
});

module.exports = router;
