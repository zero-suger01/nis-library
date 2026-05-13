/**
 * Auto-formats a UZ phone number to +998 XX XXX XX XX as the user types.
 * Accepts any raw input and returns the formatted string.
 */
export function formatUzPhone(raw) {
  // Keep only digits
  let digits = raw.replace(/\D/g, '');

  // Strip leading country code variations: 998, 8, 0
  if (digits.startsWith('998')) digits = digits.slice(3);
  else if (digits.startsWith('0'))  digits = digits.slice(1);

  // Cap at 9 local digits
  digits = digits.slice(0, 9);

  if (!digits) return '+998 ';

  // Build formatted string piece by piece
  let out = '+998 ';
  out += digits.slice(0, 2);
  if (digits.length > 2) out += ' ' + digits.slice(2, 5);
  if (digits.length > 5) out += ' ' + digits.slice(5, 7);
  if (digits.length > 7) out += ' ' + digits.slice(7, 9);

  return out;
}
