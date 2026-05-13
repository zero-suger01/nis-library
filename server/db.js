const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'library.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS contributors (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    name                 TEXT    NOT NULL,
    contact              TEXT    DEFAULT '',
    total_earnings_owed  INTEGER DEFAULT 0,
    total_earnings_paid  INTEGER DEFAULT 0,
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS books (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    title               TEXT    NOT NULL,
    author              TEXT    NOT NULL,
    shelf               TEXT    NOT NULL,
    aisle               TEXT    NOT NULL,
    price               INTEGER NOT NULL,
    pages               INTEGER NOT NULL,
    category            TEXT    DEFAULT 'General',
    status              TEXT    DEFAULT 'available',
    contributor_id      INTEGER,
    reward_percentage   REAL    DEFAULT 0,
    FOREIGN KEY (contributor_id) REFERENCES contributors(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id         INTEGER NOT NULL,
    book_title      TEXT    NOT NULL,
    type            TEXT    NOT NULL,
    price           INTEGER NOT NULL,
    rental_days     INTEGER,
    contributor_id  INTEGER,
    reward_amount   INTEGER DEFAULT 0,
    status          TEXT    DEFAULT 'pending',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id)        REFERENCES books(id),
    FOREIGN KEY (contributor_id) REFERENCES contributors(id)
  );
`);

// Non-destructive migrations — adds new columns to existing installs
const migrations = [
  `ALTER TABLE transactions ADD COLUMN renter_name    TEXT`,
  `ALTER TABLE transactions ADD COLUMN renter_phone1  TEXT`,
  `ALTER TABLE transactions ADD COLUMN renter_phone2  TEXT`,
  `ALTER TABLE transactions ADD COLUMN renter_address TEXT`,
  `ALTER TABLE transactions ADD COLUMN return_date    TEXT`,
  `ALTER TABLE books ADD COLUMN cover_image TEXT`,
  `ALTER TABLE books ADD COLUMN language    TEXT DEFAULT 'O''zbek'`,
  `ALTER TABLE books ADD COLUMN paper_type  TEXT DEFAULT 'oq qog''oz'`,
  `ALTER TABLE books ADD COLUMN book_size   TEXT DEFAULT ''`,
  `ALTER TABLE books ADD COLUMN is_gift     INTEGER DEFAULT 0`,
  `ALTER TABLE books ADD COLUMN images      TEXT DEFAULT '[]'`,
  `ALTER TABLE books ADD COLUMN cover_type  TEXT DEFAULT 'yumshoq'`,
  `ALTER TABLE books ADD COLUMN script      TEXT DEFAULT 'lotin'`,
  `ALTER TABLE books ADD COLUMN condition   INTEGER DEFAULT 100`,
  `ALTER TABLE transactions ADD COLUMN charity_amount INTEGER DEFAULT 0`,
];
for (const sql of migrations) { try { db.exec(sql); } catch (_) {} }

// Seed data removed — starting from scratch
// const bookCount = db.prepare('SELECT COUNT(*) as count FROM books').get();
// if (bookCount.count === 0) {
//   ...
// }

module.exports = db;
