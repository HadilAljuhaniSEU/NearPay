/** Validate Saudi mobile: 05XXXXXXXX or +9665XXXXXXXX */
export function isValidSaudiPhone(v: string): boolean {
  return /^(\+9665|05)[0-9]{8}$/.test(v.trim());
}

/** Normalize to E.164 +966... */
export function normalizeSaudiPhone(v: string): string {
  const s = v.trim();
  if (s.startsWith('+966')) return s;
  if (s.startsWith('05')) return '+966' + s.slice(1);
  return s;
}
