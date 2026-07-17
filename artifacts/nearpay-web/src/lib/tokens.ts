/**
 * Secure random token generation.
 * Uses the Web Crypto API — available in all modern browsers.
 */

/** Generate a 32-byte hex string (256-bit entropy) suitable for approval/payment tokens */
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Build a public approval URL for a debt */
export function buildApprovalUrl(approvalToken: string): string {
  const base = window.location.origin + import.meta.env.BASE_URL?.replace(/\/$/, '');
  return `${base}/debt/approve/${approvalToken}`;
}

/**
 * Generate a unique reference number in the format NP-YYYY-XXXXXX.
 * Uses Math.random for sequence; a server-side counter can replace this later.
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const seq  = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `NP-${year}-${seq}`;
}

/** Build a public payment URL for a debt */
export function buildPaymentUrl(paymentToken: string): string {
  const base = window.location.origin + import.meta.env.BASE_URL?.replace(/\/$/, '');
  return `${base}/debt/pay/${paymentToken}`;
}
