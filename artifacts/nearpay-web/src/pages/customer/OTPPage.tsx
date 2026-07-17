/**
 * CustomerOTPPage — Firebase Phone Authentication for customers.
 *
 * TODO: Before this works in production:
 *   1. Go to Firebase Console → Authentication → Sign-in method → Enable "Phone"
 *   2. Add your domain to Firebase Auth → Settings → Authorized domains
 *   3. For production, configure App Check to prevent OTP abuse
 *
 * The page is reachable at /customer/otp?redirect=<encoded-path>
 * After a successful OTP verification it redirects back to the original path.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NearPayLogo } from '../../components/NearPayLogo';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { auth } from '../../lib/firebase';
import { sendPhoneOTP, verifyPhoneOTP, createCustomerDoc } from '../../services/authService';
import { isValidSaudiPhone, normalizeSaudiPhone } from '../../utils/phone';
import { useT } from '../../contexts/LanguageContext';

type Step = 'phone' | 'otp' | 'success';

export default function CustomerOTPPage() {
  const [_, setLocation] = useLocation();
  const t = useT();

  const [step, setStep]               = useState<Step>('phone');
  const [phone, setPhone]             = useState('');
  const [otp, setOtp]                 = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef    = useRef<RecaptchaVerifier | null>(null);

  // Read redirect param from query string
  const redirectTo = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return decodeURIComponent(params.get('redirect') ?? '') || '/customer/nearby';
    } catch {
      return '/customer/nearby';
    }
  })();

  // If already authenticated, skip straight to redirect
  useEffect(() => {
    if (auth.currentUser) {
      setLocation(redirectTo);
    }
  }, []);

  // Initialize invisible reCAPTCHA on mount
  useEffect(() => {
    if (recaptchaRef.current) return;
    try {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          recaptchaRef.current?.clear();
          recaptchaRef.current = null;
        },
      });
    } catch (e) {
      // Phone auth not yet enabled — will show an error when user submits
    }
    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };
  }, []);

  // Resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCooldown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidSaudiPhone(phone)) { setError(t('invalid_saudi_phone')); return; }

    setLoading(true);
    try {
      if (!recaptchaRef.current) {
        // Re-initialize if it was cleared
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
        });
      }
      const normalized = normalizeSaudiPhone(phone);
      confirmationRef.current = await sendPhoneOTP(normalized, recaptchaRef.current);
      setStep('otp');
      setResendCooldown(60);
    } catch (err: unknown) {
      setError(mapOTPError(err));
      // Reset reCAPTCHA so it can be reused
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError(t('otp_too_short')); return; }

    setLoading(true);
    try {
      const user = await verifyPhoneOTP(confirmationRef.current!, otp);
      await createCustomerDoc(user.uid, normalizeSaudiPhone(phone));
      setStep('success');
      setTimeout(() => setLocation(redirectTo), 1200);
    } catch (err: unknown) {
      setError(mapOTPError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtp('');
    setError('');
    setStep('phone');
    // Reset reCAPTCHA
    recaptchaRef.current?.clear();
    recaptchaRef.current = null;
  };

  const inputCls = "h-12 rounded-2xl bg-secondary/40 border border-border focus-visible:border-teal focus-visible:ring-1 text-sm font-medium transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-5 relative overflow-hidden">
      {/* Invisible reCAPTCHA anchor */}
      <div id="recaptcha-container" />

      <div className="absolute top-5 end-5 z-20"><LanguageSwitcher /></div>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
             style={{ background: 'radial-gradient(circle, #2ED8C3, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10"
             style={{ background: 'radial-gradient(circle, #0B2341, transparent)' }} />
      </div>

      <div className="w-full max-w-[380px] z-10">
        <div className="flex justify-center mb-8">
          <NearPayLogo size={40} />
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Enter phone ── */}
          {step === 'phone' && (
            <motion.div key="phone" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                     style={{ background: 'rgba(46,216,195,0.12)' }}>
                  <Phone size={22} style={{ color: '#2ED8C3' }} />
                </div>
                <h2 className="text-xl font-bold tracking-tight mb-1">{t('otp_title')}</h2>
                <p className="text-sm text-muted-foreground font-medium mb-6">{t('otp_subtitle')}</p>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground">
                      <Phone size={17} />
                    </div>
                    <Input
                      type="tel"
                      placeholder={t('saudi_phone_placeholder')}
                      className={`ps-11 ${inputCls}`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      dir="ltr"
                    />
                  </div>
                  {error && <ErrorBox msg={error} />}
                  <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-bold" disabled={loading}>
                    {loading ? <LoadingDots /> : <>{t('otp_send_btn')} <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Enter OTP ── */}
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60">
                <button onClick={handleResend} className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-5">
                  <ChevronLeft size={15} className="rtl-flip" /> {t('otp_change_number')}
                </button>

                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                     style={{ background: 'rgba(46,216,195,0.12)' }}>
                  <ShieldCheck size={22} style={{ color: '#2ED8C3' }} />
                </div>
                <h2 className="text-xl font-bold tracking-tight mb-1">{t('otp_enter_title')}</h2>
                <p className="text-sm text-muted-foreground font-medium mb-1">{t('otp_sent_to')}</p>
                <p className="text-sm font-bold text-foreground mb-6 dir-ltr">{normalizeSaudiPhone(phone)}</p>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={t('otp_placeholder')}
                    className={`text-center tracking-[0.5em] text-lg font-bold ${inputCls}`}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    autoComplete="one-time-code"
                    dir="ltr"
                  />
                  {error && <ErrorBox msg={error} />}
                  <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-bold" disabled={loading || otp.length < 6}>
                    {loading ? <LoadingDots /> : t('otp_verify_btn')}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
                  {resendCooldown > 0
                    ? <>{t('otp_resend_in')} <span className="font-bold text-foreground">{resendCooldown}s</span></>
                    : <button onClick={handleResend} className="font-bold hover:underline" style={{ color: '#2ED8C3' }}>{t('otp_resend')}</button>
                  }
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Success ── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60 text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                     style={{ background: 'rgba(46,216,195,0.12)' }}>
                  <ShieldCheck size={30} style={{ color: '#2ED8C3' }} />
                </div>
                <p className="text-lg font-bold">{t('otp_verified')}</p>
                <p className="text-sm text-muted-foreground font-medium">{t('otp_redirecting')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground/60 font-medium mt-6">{t('secured_by')}</p>
      </div>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="p-3 bg-destructive/8 rounded-xl border border-destructive/15">
      <p className="text-sm font-semibold text-destructive text-center">{msg}</p>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex gap-1.5 items-center justify-center">
      {[0, 150, 300].map((delay) => (
        <div key={delay} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  );
}

function mapOTPError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-phone-number':          'Invalid phone number. Use format: 05XXXXXXXX',
    'auth/too-many-requests':             'Too many attempts. Please wait and try again.',
    'auth/invalid-verification-code':     'Incorrect code. Please check and try again.',
    'auth/code-expired':                  'Code expired. Request a new one.',
    'auth/missing-phone-number':          'Please enter your phone number.',
    'auth/quota-exceeded':                'SMS quota exceeded. Try again later.',
    'auth/operation-not-allowed':         'Phone sign-in is not enabled. Contact support.',
    'auth/network-request-failed':        'Network error. Check your connection.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}
