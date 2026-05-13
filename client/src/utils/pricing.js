export function calculateRentPrice(days, pages) {
  const base = (pages || 0) * 45;
  if (!days || days <= 15) return Math.round(base * 0.6);   // 15 kun = 40% chegirma
  if (days <= 30) return Math.round(base * 0.8);            // 30 kun = 20% chegirma
  return Math.round(base);                                  // 31-45 kun = to'liq narx
}

export function fmtUZS(amount) {
  return Number(amount).toLocaleString('en-US') + " so'm";
}
