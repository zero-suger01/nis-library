const db = require('./db');

const contributor = db.prepare("SELECT id FROM contributors WHERE name LIKE '%MAVLONBEK%'").get();
const contributorId = contributor ? contributor.id : null;
if (!contributorId) {
  console.log('MAVLONBEK not found');
  process.exit(1);
}

const books = [
  ["YALDO KECHASI", "XAYRIDDIN SULTON", "RAMAN", 461, "O'ZBEK", "LOTIN", "GAZETA", "QATTIQ", "A1", "1-QATOR"],
  ["MA'SUMA", "ISAJON SULTON", "ROMAN", 223, "O'ZBEK", "LOTIN", "GAZETA", "QATTIQ", "A2", "2-QATOR"],
  ["QIZIL AJDARHO", "TOMAS HARRIS", "ROMAN", 495, "O'ZBEK", "LOTIN", "OQ QOG'OZ", "QATTIQ", "A3", "3-QATOR"],
  ["If qal'asining mahbusi", "ALEKSANDR DYUMA", "ROMAN", 764, "O'ZBEK", "LOTIN", "OQ QOG'OZ", "QATTIQ", "A4", "4-QATOR"],
  ["QO'ZICHOQLAR SUKUNATI", "TOMAS HARRIS", "ROMAN", 431, "O'ZBEK", "LOTIN", "GAZETA", "QATTIQ", "A5", "1-QATOR"],
  ["YULDUZLI TUNLAR", "PIRIMQUL QODIROV", "ROMAN", 539, "O'ZBEK", "LOTIN", "GAZETA", "QATTIQ", "B1", "2-QATOR"],
  ["O'zbegim", "Erkin Vohidov", "SHERIY TOPLAM", 399, "O'ZBEK", "LOTIN", "OQ QOG'OZ", "QATTIQ", "B2", "3-QATOR"],
  ["Dorian Greyning portreti", "Oskar Uayld", "ROMAN", 333, "O'ZBEK", "LOTIN", "GAZETA", "QATTIQ", "B3", "4-QATOR"],
  ["OLAMLAR SOHIBI", "ILYA TRAYANOV", "ROMAN", 429, "O'ZBEK", "LOTIN", "OQ QOG'OZ", "QATTIQ", "B4", "1-QATOR"],
  ["JARAYON", "FRANS KAFKA", "ROMAN", 316, "O'ZBEK", "LOTIN", "GAZETA", "QATTIQ", "B5", "2-QATOR"],
  ["ZAFAR DARVOZASI", "ERIX MARIYA", "ROMAN", 607, "O'ZBEK", "LOTIN", "OQ QOG'OZ", "QATTIQ", "C1", "3-QATOR"],
  ["JON", "ANDREY PLATONOV", "ROMAN", 189, "O'ZBEK", "LOTIN", "OQ QOG'OZ", "QATTIQ", "C2", "4-QATOR"],
];

const insert = db.prepare(`
  INSERT INTO books (title, author, category, pages, language, script, paper_type, cover_type, shelf, aisle, price, status, contributor_id, book_size, is_gift, reward_percentage, images)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'available', ?, 'standard', 0, 0, '[]')
`);

for (const row of books) {
  insert.run(...row, contributorId);
}

console.log(`Inserted ${books.length} books.`);
