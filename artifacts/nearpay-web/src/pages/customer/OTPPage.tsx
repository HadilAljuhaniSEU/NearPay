import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NearPayLogo } from '../../components/NearPayLogo';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { auth } from '../../lib/firebase';
import { createCustomerDoc } from '../../services/authService';
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
  // Holds the current RecaptchaVerifier so we can clear it on retry/unmount
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

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

  // Clean up RecaptchaVerifier on unmount
  useEffect(() => {
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

  // ── Helper: create a fresh invisible RecaptchaVerifier ──────────────────────
  // Must be called right before signInWithPhoneNumber. Each RecaptchaVerifier
  // instance can only be used once — clear and recreate on every attempt.
  const createRecaptcha = (): RecaptchaVerifier => {
    // Always clear any previous instance first
    if (recaptchaRef.current) {
      try { recaptchaRef.current.clear(); } catch {}
      recaptchaRef.current = null;
    }
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {},
    });
    recaptchaRef.current = verifier;
    return verifier;
  };

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidSaudiPhone(phone)) { setError(t('invalid_saudi_phone')); return; }

    setLoading(true);
    try {
      const normalized = normalizeSaudiPhone(phone);
      const verifier   = createRecaptcha();
      // signInWithPhoneNumber is called directly here (not via a service wrapper)
      // so the RecaptchaVerifier instance is guaranteed to be tied to the same
      // auth object that is exported from lib/firebase.ts.
      confirmationRef.current = await signInWithPhoneNumber(auth, normalized, verifier);
      setStep('otp');
      setResendCooldown(60);
    } catch (err: unknown) {
      // Always clear reCAPTCHA on failure so the next attempt gets a fresh one
      try { recaptchaRef.current?.clear(); } catch {}
      recaptchaRef.current = null;
      setError(mapOTPError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError(t('otp_too_short')); return; }
    if (!confirmationRef.current) { setError('Session expired. Please request a new code.'); return; }

    setLoading(true);
    try {
      const credential = await confirmationRef.current.confirm(otp);
      const user = credential.user;
      // Upsert the Firestore customer auth doc (no-op if already exists)
      await createCustomerDoc(user.uid, normalizeSaudiPhone(phone));
      // Prefer sessionStorage pending redirect (set by DebtApprovalPage before login)
      const pendingReturn = sessionStorage.getItem('np_pending_return');
      if (pendingReturn) sessionStorage.removeItem('np_pending_return');
      const destination = pendingReturn || redirectTo;
      setStep('success');
      setTimeout(() => setLocation(destination), 1200);
    } catch (err: unknown) {
      setError(mapOTPError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── "Change number" — go back to step 1 and reset everything ───────────────
  const handleChangeNumber = () => {
    setOtp('');
    setError('');
    confirmationRef.current = null;
    try { recaptchaRef.current?.clear(); } catch {}
    recaptchaRef.current = null;
    setResendCooldown(0);
    setStep('phone');
  };

  const inputCls = "h-12 rounded-2xl bg-secondary/40 border border-border focus-visible:border-teal focus-visible:ring-1 text-sm font-medium transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-5 relative overflow-hidden">
      {/*
        Invisible reCAPTCHA anchor — must stay mounted for the entire lifetime
        of this page so RecaptchaVerifier can always find it in the DOM.
        Do NOT place it inside AnimatePresence or any conditional block.
      */}
      <div id="recaptcha-container" />

      <div className="absolute top-5 end-5 z-20"><LanguageSwitcher /></div>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
             style={{ background: 'radial-gradient(circle, #20D6C7, transparent)' }} />
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
                     style={{ background: 'rgba(32,214,199,0.12)' }}>
                  <Phone size={22} style={{ color: '#20D6C7' }} />
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
                <button onClick={handleChangeNumber} className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-5">
                  <ChevronLeft size={15} className="rtl-flip" /> {t('otp_change_number')}
                </button>

                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                     style={{ background: 'rgba(32,214,199,0.12)' }}>
                  <ShieldCheck size={22} style={{ color: '#20D6C7' }} />
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
                    autoFocus
                  />
                  {error && <ErrorBox msg={error} />}
                  <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-bold" disabled={loading || otp.length < 6}>
                    {loading ? <LoadingDots /> : t('otp_verify_btn')}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
                  {resendCooldown > 0
                    ? <>{t('otp_resend_in')} <span className="font-bold text-foreground">{resendCooldown}s</span></>
                    : <button onClick={handleChangeNumber} className="font-bold hover:underline" style={{ color: '#20D6C7' }}>{t('otp_resend')}</button>
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
                     style={{ background: 'rgba(32,214,199,0.12)' }}>
                  <ShieldCheck size={30} style={{ color: '#20D6C7' }} />
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

// Maps Firebase error codes to user-readable messages.
// For unmapped codes the raw Firebase message is shown so nothing is hidden.
function mapOTPError(err: unknown): string {
  const code    = (err as { code?: string })?.code ?? '';
  const message = (err as { message?: string })?.message ?? '';

  const map: Record<string, string> = {
    'auth/invalid-phone-number':       'Invalid phone number. Use format: 05XXXXXXXX',
    'auth/too-many-requests':          'Too many attempts. Please wait and try again.',
    'auth/invalid-verification-code':  'Incorrect code. Please check and try again.',
    'auth/code-expired':               'Code expired. Please request a new one.',
    'auth/missing-phone-number':       'Please enter your phone number.',
    'auth/quota-exceeded':             'SMS quota exceeded. Try again later.',
    'auth/network-request-failed':     'Network error. Check your connection.',
    'auth/captcha-check-failed':       'reCAPTCHA check failed. Please try again.',
    'auth/missing-app-credential':     'App credential missing. Check Firebase configuration.',
    'auth/web-storage-unsupported':    'Third-party cookies are blocked. Please allow them and retry.',
    'auth/internal-error':             'An internal error occurred. Please try again.',
  };

  if (map[code]) return map[code];
  // Show the real Firebase error so it is never silently swallowed
  if (code) return `${message || code}`;
  return 'Something went wrong. Please try again.';
}
