import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Phone, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NearPayLogo } from '../../components/NearPayLogo';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { auth } from '../../lib/firebase';
import { registerCustomer, signInCustomer, createCustomerDoc } from '../../services/authService';
import { CUSTOMER_PHONE_OTP_ENABLED } from '../../config/features';
import { useT } from '../../contexts/LanguageContext';

type Step = 'signin' | 'signup';

export default function CustomerAuthPage() {
  const [_, setLocation] = useLocation();
  const t = useT();

  // If the flag is flipped back on, send users to the OTP page instead
  useEffect(() => {
    if (CUSTOMER_PHONE_OTP_ENABLED) {
      setLocation('/customer/otp');
    }
  }, []);

  const [step, setStep]             = useState<Step>('signin');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign-in fields
  const [siEmail, setSiEmail]       = useState('');
  const [siPassword, setSiPassword] = useState('');

  // Sign-up fields
  const [suName, setSuName]         = useState('');
  const [suEmail, setSuEmail]       = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm]   = useState('');

  const redirectTo = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return decodeURIComponent(params.get('redirect') ?? '') || '/customer/nearby';
    } catch {
      return '/customer/nearby';
    }
  })();

  const goToStep = (s: Step) => { setError(''); setStep(s); };

  // ── Sign In ─────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!siEmail || !siPassword) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await signInCustomer(siEmail, siPassword);
      const pending = sessionStorage.getItem('np_pending_return');
      if (pending) sessionStorage.removeItem('np_pending_return');
      setLocation(pending || redirectTo);
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up ─────────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!suName || !suEmail || !suPassword || !suConfirm) { setError('Please fill in all fields.'); return; }
    if (suPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (suPassword !== suConfirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const user = await registerCustomer(suEmail, suPassword, suName);
      await createCustomerDoc(user.uid, '', 'en', suEmail, suName);
      const pending = sessionStorage.getItem('np_pending_return');
      if (pending) sessionStorage.removeItem('np_pending_return');
      setLocation(pending || redirectTo);
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "h-12 rounded-2xl bg-secondary/40 border border-border focus-visible:border-teal focus-visible:ring-1 text-sm font-medium transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-5 relative overflow-hidden">
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

        {/* ── Step Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex bg-secondary/60 p-1.5 rounded-2xl mb-6 border border-border/50 relative">
          <motion.div
            className="absolute inset-y-1.5 bg-card shadow-sm rounded-xl border border-border/60"
            layoutId="customerAuthTab" initial={false}
            animate={{ left: step === 'signin' ? '6px' : '50%', width: 'calc(50% - 6px)' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
          />
          <button onClick={() => goToStep('signin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold relative z-10 transition-colors ${step === 'signin' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            Sign In
          </button>
          <button onClick={() => goToStep('signup')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold relative z-10 transition-colors ${step === 'signup' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* ── Sign In ── */}
          {step === 'signin' && (
            <motion.div key="signin" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60 space-y-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">Welcome back</h2>
                  <p className="text-sm text-muted-foreground font-medium">Sign in to your customer account.</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <FieldWrap icon={<Mail size={17} />}>
                    <Input type="email" placeholder="Email address" className={`ps-11 ${inputCls}`}
                      value={siEmail} onChange={(e) => setSiEmail(e.target.value)} autoComplete="email" />
                  </FieldWrap>

                  <div className="relative">
                    <FieldWrap icon={<Lock size={17} />}>
                      <Input type={showPassword ? 'text' : 'password'} placeholder="Password" className={`ps-11 pe-11 ${inputCls}`}
                        value={siPassword} onChange={(e) => setSiPassword(e.target.value)} autoComplete="current-password" />
                    </FieldWrap>
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 end-0 flex items-center pe-4 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {error && <ErrorBox msg={error} />}

                  <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-bold" disabled={loading || !siEmail || !siPassword}>
                    {loading ? <LoadingDots /> : <>Sign In <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground pt-1 font-medium">
                  Don't have an account?{' '}
                  <button onClick={() => goToStep('signup')} className="font-bold hover:underline" style={{ color: '#20D6C7' }}>
                    Sign Up
                  </button>
                </p>

                {/* Phone OTP — Coming Soon */}
                <PhoneComingSoonBanner />
              </div>
            </motion.div>
          )}

          {/* ── Sign Up ── */}
          {step === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60 space-y-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">Create account</h2>
                  <p className="text-sm text-muted-foreground font-medium">Join NearPay as a customer.</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <FieldWrap icon={<User size={17} />}>
                    <Input type="text" placeholder="Full name" className={`ps-11 ${inputCls}`}
                      value={suName} onChange={(e) => setSuName(e.target.value)} autoComplete="name" />
                  </FieldWrap>

                  <FieldWrap icon={<Mail size={17} />}>
                    <Input type="email" placeholder="Email address" className={`ps-11 ${inputCls}`}
                      value={suEmail} onChange={(e) => setSuEmail(e.target.value)} autoComplete="email" />
                  </FieldWrap>

                  <div className="relative">
                    <FieldWrap icon={<Lock size={17} />}>
                      <Input type={showPassword ? 'text' : 'password'} placeholder="Password (min 8 characters)" className={`ps-11 pe-11 ${inputCls}`}
                        value={suPassword} onChange={(e) => setSuPassword(e.target.value)} autoComplete="new-password" />
                    </FieldWrap>
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 end-0 flex items-center pe-4 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  <FieldWrap icon={<Lock size={17} />}>
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Confirm password" className={`ps-11 ${inputCls}`}
                      value={suConfirm} onChange={(e) => setSuConfirm(e.target.value)} autoComplete="new-password" />
                  </FieldWrap>

                  {error && <ErrorBox msg={error} />}

                  <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-bold" disabled={loading || !suName || !suEmail || !suPassword || !suConfirm}>
                    {loading ? <LoadingDots /> : <>Create Account <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground pt-1 font-medium">
                  Already have an account?{' '}
                  <button onClick={() => goToStep('signin')} className="font-bold hover:underline" style={{ color: '#20D6C7' }}>
                    Sign In
                  </button>
                </p>

                {/* Phone OTP — Coming Soon */}
                <PhoneComingSoonBanner />
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground/60 font-medium mt-6">Secured by NearPay</p>
      </div>
    </div>
  );
}

// ── Phone OTP Coming Soon Banner ─────────────────────────────────────────────
// All OTP code is preserved in OTPPage.tsx. Re-enable by setting
// CUSTOMER_PHONE_OTP_ENABLED = true in src/config/features.ts.
function PhoneComingSoonBanner() {
  return (
    <div className="mt-2 rounded-2xl border border-border/50 bg-secondary/30 p-4 flex items-start gap-3 opacity-60 select-none">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
           style={{ background: 'rgba(32,214,199,0.10)' }}>
        <Phone size={17} style={{ color: '#20D6C7' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-foreground">Phone OTP</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide text-white"
                style={{ background: 'linear-gradient(90deg, #20D6C7, #19B8D3)' }}>
            Coming Soon
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium leading-snug">
          Phone verification will be available in the next release.
        </p>
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────
function FieldWrap({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground">{icon}</div>
      {children}
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

// Maps Firebase auth error codes to user-readable messages.
function mapAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/invalid-credential':      'Invalid email or password.',
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/weak-password':           'Password must be at least 8 characters.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/too-many-requests':       'Too many attempts. Please wait and try again.',
    'auth/network-request-failed':  'Network error. Check your connection.',
    'auth/user-disabled':           'This account has been disabled.',
  };
  if (map[code]) return map[code];
  const msg = (err as { message?: string })?.message ?? '';
  return msg || 'Something went wrong. Please try again.';
}
