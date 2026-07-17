/**
 * Normalize a Saudi mobile number to E.164: +9665XXXXXXXX
 *
 * Handles all common input formats:
 *   05XXXXXXXX      → +96605... wait, no: 05 maps to +9665
 *   5XXXXXXXX       → +9665XXXXXXXX
 *   9665XXXXXXXX    → +9665XXXXXXXX
 *   +9665XXXXXXXX   → +9665XXXXXXXX  (already normalized)
 *   05 XXX XXXX     → strip spaces first
 *   +966 5XX XXX XXXX → strip spaces first
 */
export function normalizeSaudiPhone(v: string): string {
  // Strip whitespace, dashes, parentheses, dots
  const s = v.replace(/[\s\-().]/g, '');
  if (s.startsWith('+966')) {
    // Already has country code — strip leading 0 after it (shouldn't happen, but guard)
    const rest = s.slice(4).replace(/^0/, '');
    return '+966' + rest;
  }
  if (s.startsWith('966')) {
    // No +, but has country code
    const rest = s.slice(3).replace(/^0/, '');
    return '+966' + rest;
  }
  if (s.startsWith('05')) {
    return '+966' + s.slice(1); // 05XXXXXXXX → +9665XXXXXXXX
  }
  if (s.startsWith('5')) {
    return '+966' + s; // 5XXXXXXXX → +9665XXXXXXXX
  }
  return s; // Return as-is for unknown format
}

/**
 * Validate that a Saudi mobile number, after normalisation, matches E.164 +9665XXXXXXXX.
 * Accepts any input format that normalizeSaudiPhone can convert.
 */
export function isValidSaudiPhone(v: string): boolean {
  const normalized = normalizeSaudiPhone(v);
  return /^\+9665\d{8}$/.test(normalized);
}
