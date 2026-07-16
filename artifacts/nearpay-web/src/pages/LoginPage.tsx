import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, User, ArrowRight, Mail, Lock, Eye, EyeOff, Phone, Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NearPayLogo } from '../components/NearPayLogo';
import { useAuth } from '../hooks/useAuth';
import { resetMerchantPassword } from '../services/authService';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useT } from '../contexts/LanguageContext';

type Step = 'form' | 'forgot' | 'signup';

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const { signIn, register, actionLoading, error: hookError } = useAuth();
  const t = useT();

  const [role, setRole] = useState<'merchant' | 'customer'>('merchant');
  const [step, setStep] = useState<Step>('form');

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const [forgotEmail, setForgotEmail]     = useState('');
  const [forgotSent, setForgotSent]       = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError]     = useState<string | null>(null);

  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [signupPhone, setSignupPhone]               = useState('');
  const [signupEmail, setSignupEmail]               = useState('');
  const [signupPassword, setSignupPassword]         = useState('');
  const [signupConfirm, setSignupConfirm]           = useState('');
  const [signupShowPw, setSignupShowPw]             = useState(false);
  const [signupError, setSignupError]               = useState<string | null>(null);

  const displayError = error ?? hookError;

  const handleMerchantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    try { await signIn(email, password, rememberMe); } catch {}
  };

  const handleCustomerContinue = () => {
    localStorage.setItem('nearpay_role', 'customer');
    setLocation('/customer/nearby');
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      await resetMerchantPassword(forgotEmail);
      setForgotSent(true);
    } catch {
      setForgotError(t('reset_email_failed'));
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!signupBusinessName || !signupPhone || !signupEmail || !signupPassword) {
      setSignupError(t('fill_all_fields'));
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError(t('passwords_no_match'));
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError(t('password_too_short'));
      return;
    }
    try { await register(signupEmail, signupPassword, signupBusinessName, signupPhone); } catch {}
  };

  const goToStep = (s: Step) => {
    setError(null);
    setForgotError(null);
    setSignupError(null);
    setStep(s);
  };

  const inputCls = "h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-teal focus-visible:ring-1 text-sm font-medium transition-all";

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden text-foreground">
      {/* ── Left Side: Brand Panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12"
           style={{ background: 'linear-gradient(160deg, #0B2341 0%, #0E2F53 100%)' }}>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[160px] translate-x-1/3 -translate-y-1/3"
               style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.15), transparent)' }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] -translate-x-1/3 translate-y-1/3"
               style={{ background: 'radial-gradient(circle, rgba(25,100,200,0.1), transparent)' }} />
        </div>

        <div className="relative z-10 max-w-lg">
          <NearPayLogo size={48} variant="white" className="mb-12" />
          <h1 className="text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
            {t('simplify_your')}<br />
            <span style={{ color: '#2ED8C3' }}>{t('merchant_tabs')}</span>
          </h1>
          <p className="text-lg mb-12 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {t('hero_subtitle')}
          </p>

          {/* Illustration */}
          <div className="relative w-full h-[320px]">
            <svg width="100%" height="100%" viewBox="0 0 380 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="200" height="120" rx="20" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.07" />
              <circle cx="68" cy="68" r="22" fill="white" fillOpacity="0.08" />
              <rect x="100" y="56" width="90" height="9" rx="4.5" fill="white" fillOpacity="0.1" />
              <rect x="100" y="72" width="66" height="7" rx="3.5" fill="white" fillOpacity="0.06" />
              <rect x="40" y="110" width="110" height="10" rx="5" fill="white" fillOpacity="0.07" />
              <rect x="160" y="120" width="200" height="130" rx="20" fill="#143B63" fillOpacity="0.95" />
              <circle cx="208" cy="168" r="22" fill="#2ED8C3" fillOpacity="0.12" />
              <rect x="240" y="156" width="90" height="9" rx="4.5" fill="white" fillOpacity="0.25" />
              <rect x="240" y="172" width="66" height="7" rx="3.5" fill="#2ED8C3" fillOpacity="0.4" />
              <rect x="180" y="214" width="110" height="10" rx="5" fill="white" fillOpacity="0.15" />
              <rect x="240" y="55" width="120" height="50" rx="14" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.08" />
              <rect x="256" y="71" width="48" height="8" rx="4" fill="white" fillOpacity="0.1" />
              <rect x="256" y="85" width="72" height="7" rx="3.5" fill="#2ED8C3" fillOpacity="0.45" />
              <circle cx="196" cy="120" r="5" fill="#2ED8C3" />
              <circle cx="196" cy="120" r="5" fill="#2ED8C3" fillOpacity="0.3">
                <animate attributeName="r" from="5" to="16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="fillOpacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Right Side: Auth Forms ── */}
      <div className="flex-1 flex flex-col justify-center relative items-center lg:items-start p-6 lg:p-20 bg-card lg:bg-background lg:max-w-xl">
        <div className="absolute top-5 end-5 z-20">
          <LanguageSwitcher />
        </div>

        <div className="absolute top-0 end-0 -me-20 -mt-20 w-64 h-64 rounded-full blur-3xl lg:hidden pointer-events-none"
             style={{ background: 'rgba(46,216,195,0.04)' }} />

        <div className="w-full max-w-[390px] mx-auto z-10">
          <AnimatePresence mode="wait">

            {/* ─── FORGOT PASSWORD ─── */}
            {step === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <button onClick={() => goToStep('form')} className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8">
                  <ArrowLeft size={15} className="rtl-flip" /> {t('back_to_login')}
                </button>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{t('reset_password')}</h2>
                  <p className="text-muted-foreground mt-1.5 font-medium text-sm">{t('reset_subtitle')}</p>
                </div>
                {forgotSent ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                         style={{ background: 'rgba(46,216,195,0.12)' }}>
                      <Mail className="w-7 h-7" style={{ color: '#2ED8C3' }} />
                    </div>
                    <p className="font-bold text-foreground text-base">{t('check_inbox')}</p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {t('reset_link_sent')} <span className="font-bold text-foreground">{forgotEmail}</span>
                    </p>
                    <button onClick={() => { goToStep('form'); setForgotSent(false); setForgotEmail(''); }}
                      className="text-sm font-bold hover:underline mt-4 block mx-auto" style={{ color: '#2ED8C3' }}>
                      {t('back_to_login')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Mail size={17} /></div>
                      <Input type="email" placeholder={t('email_address')} className={`pl-12 ${inputCls}`}
                        value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                    </div>
                    {forgotError && <p className="text-sm text-destructive text-center font-medium">{forgotError}</p>}
                    <Button type="submit" className="w-full h-13 rounded-2xl text-sm font-bold mt-1" disabled={!forgotEmail || forgotLoading}>
                      {forgotLoading ? <LoadingDots /> : <>{t('send_reset_link')} <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                    </Button>
                  </form>
                )}
              </motion.div>
            )}

            {/* ─── SIGN UP ─── */}
            {step === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <button onClick={() => goToStep('form')} className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8">
                  <ArrowLeft size={15} className="rtl-flip" /> {t('back_to_login')}
                </button>
                <div className="mb-7">
                  <div className="lg:hidden flex mb-5"><NearPayLogo size={34} /></div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{t('create_account')}</h2>
                  <p className="text-muted-foreground mt-1.5 font-medium text-sm">{t('create_account_subtitle')}</p>
                </div>
                <form onSubmit={handleSignup} className="space-y-3.5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Building2 size={17} /></div>
                    <Input type="text" placeholder={t('business_name')} className={`pl-12 ${inputCls}`}
                      value={signupBusinessName} onChange={(e) => setSignupBusinessName(e.target.value)} autoComplete="organization" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Phone size={17} /></div>
                    <Input type="tel" placeholder={t('phone_number')} className={`pl-12 ${inputCls}`}
                      value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} autoComplete="tel" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Mail size={17} /></div>
                    <Input type="email" placeholder={t('email_address')} className={`pl-12 ${inputCls}`}
                      value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} autoComplete="email" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Lock size={17} /></div>
                    <Input type={signupShowPw ? 'text' : 'password'} placeholder={t('password')} className={`pl-12 pr-12 ${inputCls}`}
                      value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} autoComplete="new-password" />
                    <button type="button" onClick={() => setSignupShowPw(v => !v)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors">
                      {signupShowPw ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Lock size={17} /></div>
                    <Input type={signupShowPw ? 'text' : 'password'} placeholder={t('confirm_password')} className={`pl-12 ${inputCls}`}
                      value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} autoComplete="new-password" />
                  </div>
                  {(signupError ?? hookError) && (
                    <div className="p-3 bg-destructive/8 rounded-xl border border-destructive/15">
                      <p className="text-sm font-semibold text-destructive text-center">{signupError ?? hookError}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full h-13 rounded-2xl text-sm font-bold mt-1"
                    disabled={!signupBusinessName || !signupEmail || !signupPassword || actionLoading}>
                    {actionLoading ? <LoadingDots /> : <>{t('create_account_btn')} <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ─── MAIN FORM ─── */}
            {step === 'form' && (
              <motion.div key="main-form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="w-full">
                <div className="mb-8">
                  <div className="lg:hidden flex mb-6"><NearPayLogo size={38} /></div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{t('welcome_back')}</h2>
                  <p className="text-muted-foreground mt-1.5 font-medium text-sm">{t('log_in_subtitle')}</p>
                </div>

                {/* Role Selector */}
                <div className="flex bg-secondary/60 p-1.5 rounded-2xl mb-7 relative border border-border/50">
                  <motion.div
                    className="absolute inset-y-1.5 bg-card shadow-sm rounded-xl border border-border/60"
                    layoutId="roleTab"
                    initial={false}
                    animate={{ left: role === 'merchant' ? '6px' : '50%', width: 'calc(50% - 6px)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                  <button onClick={() => { setRole('merchant'); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold relative z-10 transition-colors ${role === 'merchant' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Store size={16} /> {t('merchant')}
                  </button>
                  <button onClick={() => { setRole('customer'); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold relative z-10 transition-colors ${role === 'customer' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <User size={16} /> {t('customer')}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {/* ── Merchant login ── */}
                  {role === 'merchant' && (
                    <motion.form key="merchant-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      onSubmit={handleMerchantLogin} className="space-y-3.5">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Mail size={17} /></div>
                        <Input type="email" placeholder={t('email_address')} className={`pl-12 ${inputCls}`}
                          value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Lock size={17} /></div>
                        <Input type={showPassword ? 'text' : 'password'} placeholder={t('password')} className={`pl-12 pr-12 ${inputCls}`}
                          value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between px-0.5 pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none group">
                          <div onClick={() => setRememberMe(v => !v)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'border-teal' : 'border-muted-foreground/40 group-hover:border-teal/50'}`}
                            style={rememberMe ? { background: '#2ED8C3' } : {}}>
                            {rememberMe && (
                              <svg className="w-3 h-3 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{t('remember_me')}</span>
                        </label>
                        <button type="button" onClick={() => goToStep('forgot')} className="text-sm font-bold hover:underline" style={{ color: '#2ED8C3' }}>
                          {t('forgot_password')}
                        </button>
                      </div>

                      {displayError && (
                        <div className="p-3 bg-destructive/8 rounded-xl border border-destructive/15">
                          <p className="text-sm font-semibold text-destructive text-center">{displayError}</p>
                        </div>
                      )}

                      <Button type="submit" className="w-full h-13 rounded-2xl text-sm font-bold mt-1"
                        disabled={!email || !password || actionLoading}>
                        {actionLoading ? <LoadingDots /> : <>{t('sign_in')} <ArrowRight className="ms-2 rtl-flip" size={17} /></>}
                      </Button>

                      <p className="text-center text-sm text-muted-foreground pt-1">
                        {t('dont_have_account')}{' '}
                        <button type="button" onClick={() => goToStep('signup')} className="font-bold hover:underline" style={{ color: '#2ED8C3' }}>
                          {t('create_account_link')}
                        </button>
                      </p>
                    </motion.form>
                  )}

                  {/* ── Customer: no account needed ── */}
                  {role === 'customer' && (
                    <motion.div key="customer-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                      <div className="bg-secondary/40 rounded-[22px] p-6 text-center space-y-3 border border-border/50">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto border"
                             style={{ background: 'rgba(46,216,195,0.1)', borderColor: 'rgba(46,216,195,0.2)' }}>
                          <User size={21} style={{ color: '#2ED8C3' }} />
                        </div>
                        <p className="text-base font-bold text-foreground">{t('no_account_needed')}</p>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{t('customer_panel_desc')}</p>
                      </div>
                      <Button className="w-full h-13 rounded-2xl text-sm font-bold" onClick={handleCustomerContinue}>
                        {t('continue_to_app')} <ArrowRight className="ms-2 rtl-flip" size={17} />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 text-center text-xs font-medium text-muted-foreground/60">
            {t('by_continuing')}{' '}
            <a href="#" className="hover:text-foreground transition-colors underline underline-offset-4">{t('terms')}</a>
            {' '}&amp;{' '}
            <a href="#" className="hover:text-foreground transition-colors underline underline-offset-4">{t('privacy')}</a>
          </div>
        </div>
      </div>
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
