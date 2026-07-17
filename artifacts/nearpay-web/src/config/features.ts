/**
 * NearPay Feature Flags
 *
 * CUSTOMER_PHONE_OTP_ENABLED
 *   Set to `true` to re-enable Firebase Phone (SMS OTP) authentication for
 *   customers. All OTP code is fully preserved in OTPPage.tsx and
 *   authService.ts — only this flag and the routing entry-point need to
 *   change. When `false` the app uses email + password for customers instead.
 */
export const CUSTOMER_PHONE_OTP_ENABLED = false;
