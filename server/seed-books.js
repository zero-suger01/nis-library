const db = require('./db');

// Insert or get contributor
let contributor = db.prepare('SELECT * FROM contributors WHERE name = ?').get('MAVLONBEK');
let contributorId;
if (!contributor) {
  const contribResult = db.prepare('INSERT INTO contributors (name, contact) VALUES (?, ?)').run('MAVLONBEK', '');
  contributorId = contribResult.lastInsertRowid;
  console.log('Contributor MAVLONBEK created with id:', contributorId);
} else {
  contributorId = contributor.id;
  console.log('Contributor MAVLONBEK already exists with id:', contributorId);
}

const books = [
  ["Lolazor", "Murod Muhammad Do'st", "Roman", 670, "qattiq", "lotin", "gazeta", "standard", "G7", "2", 0],
  ["TAXTLAR O'YINI", "Jorj R. R. Martin", "Badiiy", 922, "qattiq", "lotin", "oq qog'oz", "standard", "B9", "3", 0],
  ["Otalar va bolalar", "IVAN TURGENEV", "Roman", 238, "qattiq", "lotin", "oq qog'oz", "standard", "C5", "1", 34],
  ["JANNAT QIDIRGANLAR", "Shuhrat", "Badiiy", 445, "qattiq", "lotin", "gazeta", "standard", "R7", "4", 0],
  ["CHINOR", "ASQAD MUXTOR", "Roman", 430, "qattiq", "lotin", "gazeta", "standard", "H2", "2", 0],
  ["Yovvoyi yo'rg'a", "Ernest Seton-Tompson", "Badiiy", 541, "qattiq", "lotin", "oq qog'oz", "standard", "J3", "3", 65],
  ["SARBADORLAR", "MUHAMMAD ALI", "Roman", 653, "qattiq", "lotin", "oq qog'oz", "standard", "Y5", "2", 74],
  ["JANNATDAGI SOYALAR", "ERIX MARIYA", "Roman", 478, "qattiq", "lotin", "oq qog'oz", "standard", "T2", "1", 0],
  ["UCH O'GAYNI", "ERIX MARIYA", "Roman", 462, "qattiq", "lotin", "oq qog'oz", "standard", "E3", "4", 0],
  ["ISYON VA ITOAT", "ULUG'BEK HAMDAMOV", "Roman", 254, "qattiq", "lotin", "oq qog'oz", "standard", "B6", "2", 60],
  ["UMID UCHQUNI", "ERIX MARIYA", "Roman", 350, "qattiq", "lotin", "oq qog'oz", "standard", "T2", "1", 0],
  ["G'ARBIY FRONTDA O'ZGARISH YO'Q", "ERIX MARIYA", "Roman", 238, "qattiq", "lotin", "oq qog'oz", "standard", "M1", "1", 0],
  ["YOLG'IZLIKNING YUZ YILI", "Gabriel García Márquez", "Roman", 335, "qattiq", "lotin", "gazeta", "standard", "C7", "3", 38],
  ["TASBEH DARAXTI SOYASIDA", "HARPER LI", "Roman", 311, "qattiq", "lotin", "oq qog'oz", "standard", "G6", "4", 0],
  ["KAKKU UYASI UZRA PARVOZ", "KEN KIZI", "Roman", 349, "qattiq", "lotin", "gazeta", "standard", "K6", "1", 78],
  ["Uch Mushketyor", "Aleksandr Dyuma", "Roman", 779, "qattiq", "lotin", "gazeta", "standard", "K6", "4", 0],
  ["QAYTISH", "ERIX MARIYA", "Roman", 318, "qattiq", "lotin", "oq qog'oz", "standard", "E2", "2", 0],
  ["QORA YODGORLIK", "ERIX MARIYA", "Roman", 527, "qattiq", "lotin", "oq qog'oz", "standard", "E3", "3", 0],
  ["LISSABONDAGI TUN", "ERIX MARIYA", "Roman", 286, "qattiq", "lotin", "gazeta", "standard", "N9", "1", 0],
  ["Kasofat raqamlar", "ABDUQAYM YO'LDOSHEV", "Roman", 319, "qattiq", "lotin", "oq qog'oz", "standard", "G4", "4", 0],
  ["Qumdagi xotin", "KOBO ABE", "Badiiy", 206, "qattiq", "lotin", "gazeta", "standard", "M8", "2", 0],
  ["OY VA SARIQ CHAQA", "U.SOMERSET MOEM", "Roman", 251, "qattiq", "lotin", "gazeta", "standard", "O8", "1", 0],
  ["MENING DO'G'ISTONIM", "RASUL HAMZATOV", "Badiiy", 477, "qattiq", "lotin", "oq qog'oz", "standard", "O7", "3", 55],
  ["SAMARQANDGA YO'L OLGAN ESHELON", "G'OZAL YAXINA", "Roman", 495, "qattiq", "lotin", "oq qog'oz", "standard", "Z7", "2", 69],
];

const insert = db.prepare(`
  INSERT INTO books (title, author, category, pages, cover_type, script, paper_type, book_size, shelf, aisle, price, status, contributor_id, language)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?, 'O''zbek')
`);

for (const row of books) {
  insert.run(...row, contributorId);
}

console.log(`Inserted ${books.length} books.`);
