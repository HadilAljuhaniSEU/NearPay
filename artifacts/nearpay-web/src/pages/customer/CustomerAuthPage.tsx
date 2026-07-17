import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Phone, ArrowRight, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NearPayLogo } from '../../components/NearPayLogo';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { auth } from '../../lib/firebase';
import {
  registerCustomer,
  signInCustomer,
  createCustomerDoc,
  fetchCustomerProfile,
  updateCustomerPhone,
} from '../../services/authService';
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { CUSTOMER_PHONE_OTP_ENABLED } from '../../config/features';
import { useT } from '../../contexts/LanguageContext';
import { isValidSaudiPhone, normalizeSaudiPhone } from '../../utils/phone';

type Step = 'signin' | 'signup' | 'forgot' | 'forgot-sent';

export default function CustomerAuthPage() {
  const [_, setLocation] = useLocation();
  const t = useT();

  // If OTP re-enabled, redirect there instead
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
  const [rememberMe, setRememberMe] = useState(false);

  // Sign-up fields
  const [suName, setSuName]         = useState('');
  const [suEmail, setSuEmail]       = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm]   = useState('');

  // Forgot password field
  const [fpEmail, setFpEmail]       = useState('');

  // Phone collection modal
  const [showPhoneModal, setShowPhoneModal]   = useState(false);
  const [modalPhone, setModalPhone]           = useState('');
  const [modalPhoneError, setModalPhoneError] = useState('');
  const [modalSaving, setModalSaving]         = useState(false);
  const [pendingUid, setPendingUid]           = useState('');
  const [pendingDest, setPendingDest]         = useState('');

  const redirectTo = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return decodeURIComponent(params.get('redirect') ?? '') || '/customer/home';
    } catch {
      return '/customer/home';
    }
  })();

  const goToStep = (s: Step) => { setError(''); setStep(s); };

  // After successful auth, check if phone is stored; if not, show modal
  const afterAuth = async (uid: string) => {
    const pending = sessionStorage.getItem('np_pending_return');
    if (pending) sessionStorage.removeItem('np_pending_return');
    const dest = pending || redirectTo;

    const profile = await fetchCustomerProfile(uid).catch(() => null);
    const hasPhone = !!(profile?.phone?.trim());

    if (!hasPhone) {
      // Show phone collection modal before redirecting
      setPendingUid(uid);
      setPendingDest(dest);
      setShowPhoneModal(true);
    } else {
      setLocation(dest);
    }
  };

  // ── Sign In ──────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!siEmail || !siPassword) { setError(t('fill_all_fields')); return; }
    setLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const user = await signInCustomer(siEmail, siPassword);
      await afterAuth(user.uid);
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up ──────────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!suName || !suEmail || !suPassword || !suConfirm) { setError(t('fill_all_fields')); return; }
    if (suPassword.length < 8) { setError(t('password_min_8')); return; }
    if (suPassword !== suConfirm) { setError(t('passwords_no_match')); return; }
    setLoading(true);
    try {
      const user = await registerCustomer(suEmail, suPassword, suName);
      await createCustomerDoc(user.uid, '', 'en', suEmail, suName);
      await afterAuth(user.uid);
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password ──────────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fpEmail) { setError(t('fill_all_fields')); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, fpEmail);
      setStep('forgot-sent');
    } catch {
      setError(t('reset_email_failed'));
    } finally {
      setLoading(false);
    }
  };

  // ── Phone modal save ─────────────────────────────────────────────────────────
  const handleModalSave = async () => {
    setModalPhoneError('');
    if (!isValidSaudiPhone(modalPhone)) {
      setModalPhoneError(t('invalid_saudi_phone'));
      return;
    }
    setModalSaving(true);
    try {
      const normalized = normalizeSaudiPhone(modalPhone);
      await updateCustomerPhone(pendingUid, normalized);
      setShowPhoneModal(false);
      setLocation(pendingDest);
    } catch {
      setModalPhoneError(t('load_failed'));
    } finally {
      setModalSaving(false);
    }
  };

  const handleModalSkip = () => {
    setShowPhoneModal(false);
    setLocation(pendingDest);
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

        {/* ── Step Tabs (only for signin/signup) ── */}
        {(step === 'signin' || step === 'signup') && (
          <div className="flex bg-secondary/60 p-1.5 rounded-2xl mb-6 border border-border/50 relative">
            <motion.div
              className="absolute inset-y-1.5 bg-card shadow-sm rounded-xl border border-border/60"
              layoutId="customerAuthTab" initial={false}
              animate={{ left: step === 'signin' ? '6px' : '50%', width: 'calc(50% - 6px)' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
            />
            <button onClick={() => goToStep('signin')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold relative z-10 transition-colors ${step === 'signin' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('sign_in')}
            </button>
            <button onClick={() => goToStep('signup')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold relative z-10 transition-colors ${step === 'signup' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('create_account_link')}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── Sign In ── */}
          {step === 'signin' && (
            <motion.div key="signin" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60 space-y-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">{t('customer_signin_title')}</h2>
                  <p className="text-sm text-muted-foreground font-medium">{t('customer_signin_subtitle')}</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <FieldWrap icon={<Mail size={17} />}>
                    <Input type="email" placeholder={t('email_address')} className={`ps-11 ${inputCls}`}
                      value={siEmail} onChange={(e) => setSiEmail(e.target.value)} autoComplete="email" />
                  </FieldWrap>

                  <div className="relative">
                    <FieldWrap icon={<Lock size={17} />}>
                      <Input type={showPassword ? 'text' : 'password'} placeholder={t('password')} className={`ps-11 pe-11 ${inputCls}`}
                        value={siPassword} onChange={(e) => setSiPassword(e.target.value)} autoComplete="current-password" />
                    </FieldWrap>
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 end-0 flex items-center pe-4 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {/* Remember Me + Forgot Password */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-border accent-teal cursor-pointer"
                      />
                      <span className="text-xs font-medium text-muted-foreground">{t('remember_me')}</span>
                    </label>
                    <button type="button" onClick={() => { setFpEmail(siEmail); goToStep('forgot'); }}
                      className="text-xs font-bold hover:underline" style={{ color: '#20D6C7' }}>
                      {t('forgot_password')}
                    </button>
                  </div>

                  {error && <ErrorBox msg={error} />}

                  <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-bold" disabled={loading || !siEmail || !siPassword}>
                    {loading ? <LoadingDots /> : <>{t('sign_in')} <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground pt-1 font-medium">
                  {t('dont_have_account')}{' '}
                  <button onClick={() => goToStep('signup')} className="font-bold hover:underline" style={{ color: '#20D6C7' }}>
                    {t('create_account_link')}
                  </button>
                </p>

                <PhoneComingSoonBanner t={t} />
              </div>
            </motion.div>
          )}

          {/* ── Sign Up ── */}
          {step === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60 space-y-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">{t('customer_signup_title')}</h2>
                  <p className="text-sm text-muted-foreground font-medium">{t('customer_signup_subtitle')}</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <FieldWrap icon={<User size={17} />}>
                    <Input type="text" placeholder={t('customer_name_label')} className={`ps-11 ${inputCls}`}
                      value={suName} onChange={(e) => setSuName(e.target.value)} autoComplete="name" />
                  </FieldWrap>

                  <FieldWrap icon={<Mail size={17} />}>
                    <Input type="email" placeholder={t('email_address')} className={`ps-11 ${inputCls}`}
                      value={suEmail} onChange={(e) => setSuEmail(e.target.value)} autoComplete="email" />
                  </FieldWrap>

                  <div className="relative">
                    <FieldWrap icon={<Lock size={17} />}>
                      <Input type={showPassword ? 'text' : 'password'} placeholder={t('customer_password_min')} className={`ps-11 pe-11 ${inputCls}`}
                        value={suPassword} onChange={(e) => setSuPassword(e.target.value)} autoComplete="new-password" />
                    </FieldWrap>
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 end-0 flex items-center pe-4 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  <FieldWrap icon={<Lock size={17} />}>
                    <Input type={showPassword ? 'text' : 'password'} placeholder={t('confirm_password')} className={`ps-11 ${inputCls}`}
                      value={suConfirm} onChange={(e) => setSuConfirm(e.target.value)} autoComplete="new-password" />
                  </FieldWrap>

                  {error && <ErrorBox msg={error} />}

                  <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-bold"
                    disabled={loading || !suName || !suEmail || !suPassword || !suConfirm}>
                    {loading ? <LoadingDots /> : <>{t('create_account_btn')} <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground pt-1 font-medium">
                  {t('customer_have_account')}{' '}
                  <button onClick={() => goToStep('signin')} className="font-bold hover:underline" style={{ color: '#20D6C7' }}>
                    {t('sign_in')}
                  </button>
                </p>

                <PhoneComingSoonBanner t={t} />
              </div>
            </motion.div>
          )}

          {/* ── Forgot Password ── */}
          {step === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60 space-y-4">
                <button onClick={() => goToStep('signin')}
                  className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={15} className="rtl-flip" /> {t('customer_back_signin')}
                </button>
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">{t('customer_forgot_title')}</h2>
                  <p className="text-sm text-muted-foreground font-medium">{t('customer_forgot_sub')}</p>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-3.5">
                  <FieldWrap icon={<Mail size={17} />}>
                    <Input type="email" placeholder={t('email_address')} className={`ps-11 ${inputCls}`}
                      value={fpEmail} onChange={(e) => setFpEmail(e.target.value)} autoComplete="email" autoFocus />
                  </FieldWrap>
                  {error && <ErrorBox msg={error} />}
                  <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-bold" disabled={loading || !fpEmail}>
                    {loading ? <LoadingDots /> : <>{t('customer_forgot_btn')} <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Forgot Sent ── */}
          {step === 'forgot-sent' && (
            <motion.div key="forgot-sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-card rounded-3xl p-7 shadow-sm border border-border/60 text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                     style={{ background: 'rgba(32,214,199,0.12)' }}>
                  <CheckCircle2 size={30} style={{ color: '#20D6C7' }} />
                </div>
                <div>
                  <p className="text-lg font-bold">{t('customer_forgot_sent_title')}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">{t('customer_forgot_sent_sub')}</p>
                </div>
                <button onClick={() => goToStep('signin')} className="text-sm font-bold hover:underline" style={{ color: '#20D6C7' }}>
                  {t('customer_back_signin')}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground/60 font-medium mt-6">{t('secured_by')}</p>
      </div>

      {/* ── Phone Collection Modal ── */}
      <AnimatePresence>
        {showPhoneModal && (
          <>
            <motion.div key="modal-bg" className="fixed inset-0 bg-black/60 z-[100]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div key="modal"
              className="fixed inset-x-5 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-[380px] bg-card rounded-t-[28px] md:rounded-[28px] z-[101] p-7 border border-border/60 shadow-2xl"
              initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}>

              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                     style={{ background: 'rgba(32,214,199,0.12)' }}>
                  <Phone size={22} style={{ color: '#20D6C7' }} />
                </div>
              </div>
              <h2 className="text-lg font-bold text-center mb-1">{t('phone_modal_title')}</h2>
              <p className="text-sm text-muted-foreground font-medium text-center mb-5">{t('phone_modal_sub')}</p>

              <div className="space-y-3">
                <FieldWrap icon={<Phone size={17} />}>
                  <Input
                    type="tel"
                    placeholder={t('saudi_phone_placeholder')}
                    className={`ps-11 ${inputCls}`}
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    dir="ltr"
                    autoFocus
                  />
                </FieldWrap>
                {modalPhoneError && <ErrorBox msg={modalPhoneError} />}
              </div>

              <div className="mt-5 space-y-2.5">
                <Button onClick={handleModalSave} disabled={modalSaving || !modalPhone}
                  className="w-full h-12 rounded-2xl text-sm font-bold">
                  {modalSaving ? <LoadingDots /> : t('phone_modal_save')}
                </Button>
                <button onClick={handleModalSkip}
                  className="w-full py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {t('phone_modal_skip')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Phone OTP Coming Soon Banner ─────────────────────────────────────────────
function PhoneComingSoonBanner({ t }: { t: (key: any) => string }) {
  return (
    <div className="mt-2 rounded-2xl border border-border/50 bg-secondary/30 p-4 flex items-start gap-3 opacity-60 select-none">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
           style={{ background: 'rgba(32,214,199,0.10)' }}>
        <Phone size={17} style={{ color: '#20D6C7' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-foreground">{t('phone_login_label')}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide text-white"
                style={{ background: 'linear-gradient(90deg, #20D6C7, #19B8D3)' }}>
            {t('coming_soon')}
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium leading-snug">
          {t('phone_login_sub')}
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
