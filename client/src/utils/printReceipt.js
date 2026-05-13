export function printReceipt({ type, bookTitle, bookAuthor, price, rentalDays, pages }) {
  const date      = new Date().toLocaleString('uz-UZ');
  const typeLabel = type === 'buy' ? 'XARID CHEKI' : 'IJARA CHEKI';

  const rentRows = type === 'rent' ? `
    <tr><td>Ijara muddati</td><td>${rentalDays} kun</td></tr>
    <tr><td>Sahifalar soni</td><td>${pages} bet</td></tr>
  ` : '';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Chek</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 6mm 4mm; }
    h1   { font-size: 15px; text-align: center; margin-bottom: 2px; }
    .sub { text-align: center; font-size: 11px; color: #555; margin-bottom: 4px; }
    hr   { border: none; border-top: 1px dashed #000; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; }
    td   { padding: 2px 0; }
    td:last-child { text-align: right; }
    .total  { font-size: 14px; font-weight: bold; text-align: center; margin: 8px 0; }
    .footer { text-align: center; font-size: 11px; color: #555; }
  </style>
</head>
<body>
  <h1>NIS KUTUBXONASI</h1>
  <p class="sub">Namangan International School</p>
  <p class="sub">${date}</p>
  <hr/>
  <p style="text-align:center;font-weight:bold;margin-bottom:4px">${typeLabel}</p>
  <hr/>
  <table>
    <tr><td>Kitob</td><td>${bookTitle}</td></tr>
    <tr><td>Muallif</td><td>${bookAuthor || '—'}</td></tr>
    ${rentRows}
  </table>
  <hr/>
  <p class="total">JAMI: ${Number(price).toLocaleString()} so'm</p>
  <hr/>
  <p class="footer">Iltimos, bu chekni saqlang.</p>
  <p class="footer">NIS Kutubxonasidan foydalanganingiz uchun rahmat!</p>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0;';
  document.body.appendChild(iframe);
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 400);
}
