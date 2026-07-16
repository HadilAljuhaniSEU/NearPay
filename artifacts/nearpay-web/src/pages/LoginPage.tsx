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

type Step = 'form' | 'forgot' | 'signup';

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const { signIn, register, actionLoading, error: hookError } = useAuth();

  const [role, setRole] = useState<'merchant' | 'customer'>('merchant');
  const [step, setStep] = useState<Step>('form');

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Sign up form
  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupShowPw, setSignupShowPw] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const displayError = error ?? hookError;

  const handleMerchantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    try {
      await signIn(email, password, rememberMe);
    } catch {
      // handled inside useAuth
    }
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
      setForgotError('Could not send reset email. Check the address and try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!signupBusinessName || !signupPhone || !signupEmail || !signupPassword) {
      setSignupError('Please fill in all fields.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }
    try {
      await register(signupEmail, signupPassword, signupBusinessName, signupPhone);
    } catch {
      // handled inside useAuth hook
    }
  };

  const goToStep = (s: Step) => {
    setError(null);
    setForgotError(null);
    setSignupError(null);
    setStep(s);
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden text-foreground">
      {/* ── Left Side: Brand Panel ── */}
      <div className="hidden lg:flex flex-1 relative bg-foreground overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/15 rounded-full blur-[140px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 max-w-lg">
          <NearPayLogo size={48} variant="white" className="mb-12" />
          <h1 className="text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
            Simplify your<br />
            <span className="text-teal">merchant tabs</span>
          </h1>
          <p className="text-lg text-white/55 mb-12 leading-relaxed">
            The smart way to manage customer credit, track collections, and grow your cash flow.
          </p>

          {/* Abstract payment-style illustration */}
          <div className="relative w-full h-[340px]">
            <svg width="100%" height="100%" viewBox="0 0 380 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background card */}
              <rect x="20" y="20" width="200" height="130" rx="20" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.08" />
              {/* Avatar circle */}
              <circle cx="68" cy="68" r="22" fill="white" fillOpacity="0.1" />
              {/* Text lines */}
              <rect x="100" y="56" width="90" height="9" rx="4.5" fill="white" fillOpacity="0.12" />
              <rect x="100" y="72" width="66" height="7" rx="3.5" fill="white" fillOpacity="0.07" />
              {/* Amount */}
              <rect x="40" y="114" width="110" height="11" rx="5.5" fill="white" fillOpacity="0.08" />

              {/* Foreground card (teal accent) */}
              <rect x="160" y="130" width="200" height="130" rx="20" fill="#143B63" fillOpacity="0.95" />
              <circle cx="208" cy="178" r="22" fill="#2ED8C3" fillOpacity="0.15" />
              <rect x="240" y="166" width="90" height="9" rx="4.5" fill="white" fillOpacity="0.3" />
              <rect x="240" y="182" width="66" height="7" rx="3.5" fill="#2ED8C3" fillOpacity="0.45" />
              <rect x="180" y="224" width="110" height="11" rx="5.5" fill="white" fillOpacity="0.18" />

              {/* Small stat chip */}
              <rect x="240" y="60" width="120" height="52" rx="14" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.1" />
              <rect x="256" y="76" width="48" height="8" rx="4" fill="white" fillOpacity="0.12" />
              <rect x="256" y="90" width="72" height="7" rx="3.5" fill="#2ED8C3" fillOpacity="0.55" />

              {/* Connection dots */}
              <circle cx="196" cy="130" r="5" fill="#2ED8C3" />
              <circle cx="196" cy="130" r="5" fill="#2ED8C3" fillOpacity="0.3">
                <animate attributeName="r" from="5" to="14" dur="2s" repeatCount="indefinite" />
                <animate attributeName="fillOpacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Right Side: Auth Forms ── */}
      <div className="flex-1 flex flex-col justify-center relative items-center lg:items-start p-6 lg:p-20 bg-card lg:bg-background lg:max-w-xl">
        <div className="absolute top-6 right-6 z-20">
          <LanguageSwitcher />
        </div>

        {/* Mobile subtle blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-primary/4 rounded-full blur-3xl lg:hidden pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-indigo-500/4 rounded-full blur-3xl lg:hidden pointer-events-none" />

        <div className="w-full max-w-[390px] mx-auto z-10">
          <AnimatePresence mode="wait">

            {/* ─── FORGOT PASSWORD ─── */}
            {step === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <button
                  onClick={() => goToStep('form')}
                  className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </button>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset password</h2>
                  <p className="text-muted-foreground mt-1.5 font-medium text-sm">
                    We'll send a reset link to your email
                  </p>
                </div>
                {forgotSent ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Mail className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-bold text-foreground text-base">Check your inbox</p>
                    <p className="text-sm text-muted-foreground font-medium">
                      A reset link was sent to <span className="font-bold text-foreground">{forgotEmail}</span>
                    </p>
                    <button
                      onClick={() => { goToStep('form'); setForgotSent(false); setForgotEmail(''); }}
                      className="text-primary text-sm font-bold hover:underline mt-4 block mx-auto"
                    >
                      Back to login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Mail size={18} /></div>
                      <Input
                        type="email"
                        placeholder="Email address"
                        className="pl-12 h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium transition-all"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                    {forgotError && <p className="text-sm text-destructive text-center font-medium">{forgotError}</p>}
                    <Button
                      type="submit"
                      className="w-full h-13 rounded-2xl text-sm font-bold mt-1"
                      disabled={!forgotEmail || forgotLoading}
                    >
                      {forgotLoading ? <LoadingDots /> : <>Send Reset Link <ArrowRight className="ml-2" size={18} /></>}
                    </Button>
                  </form>
                )}
              </motion.div>
            )}

            {/* ─── SIGN UP ─── */}
            {step === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <button
                  onClick={() => goToStep('form')}
                  className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </button>
                <div className="mb-7">
                  <div className="lg:hidden flex mb-5">
                    <NearPayLogo size={36} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Create account</h2>
                  <p className="text-muted-foreground mt-1.5 font-medium text-sm">
                    Set up your NearPay merchant account
                  </p>
                </div>
                <form onSubmit={handleSignup} className="space-y-3.5">
                  {/* Business Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Building2 size={18} /></div>
                    <Input
                      type="text"
                      placeholder="Business name"
                      className="pl-12 h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium"
                      value={signupBusinessName}
                      onChange={(e) => setSignupBusinessName(e.target.value)}
                      autoComplete="organization"
                    />
                  </div>
                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Phone size={18} /></div>
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      className="pl-12 h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Mail size={18} /></div>
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="pl-12 h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  {/* Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Lock size={18} /></div>
                    <Input
                      type={signupShowPw ? 'text' : 'password'}
                      placeholder="Password"
                      className="pl-12 pr-12 h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setSignupShowPw(v => !v)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors">
                      {signupShowPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Confirm Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Lock size={18} /></div>
                    <Input
                      type={signupShowPw ? 'text' : 'password'}
                      placeholder="Confirm password"
                      className="pl-12 h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium"
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>

                  {(signupError ?? hookError) && (
                    <div className="p-3 bg-destructive/8 rounded-xl border border-destructive/15">
                      <p className="text-sm font-semibold text-destructive text-center">{signupError ?? hookError}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-13 rounded-2xl text-sm font-bold mt-1"
                    disabled={!signupBusinessName || !signupEmail || !signupPassword || actionLoading}
                  >
                    {actionLoading ? <LoadingDots /> : <>Create Account <ArrowRight className="ml-2" size={18} /></>}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ─── MAIN FORM ─── */}
            {step === 'form' && (
              <motion.div
                key="main-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full"
              >
                <div className="mb-8">
                  <div className="lg:hidden flex mb-6">
                    <NearPayLogo size={40} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Welcome back
                  </h2>
                  <p className="text-muted-foreground mt-1.5 font-medium text-sm">
                    Log in to manage your tabs
                  </p>
                </div>

                {/* Role Selector */}
                <div className="flex bg-secondary/70 p-1.5 rounded-2xl mb-7 relative border border-border/60">
                  <motion.div
                    className="absolute inset-y-1.5 bg-card shadow-sm rounded-xl border border-border/60"
                    layoutId="roleTab"
                    initial={false}
                    animate={{ left: role === 'merchant' ? '6px' : '50%', width: 'calc(50% - 6px)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
                  />
                  <button
                    onClick={() => { setRole('merchant'); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold relative z-10 transition-colors ${role === 'merchant' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Store size={17} /> Merchant
                  </button>
                  <button
                    onClick={() => { setRole('customer'); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold relative z-10 transition-colors ${role === 'customer' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <User size={17} /> Customer
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {/* ── Merchant login ── */}
                  {role === 'merchant' && (
                    <motion.form
                      key="merchant-form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onSubmit={handleMerchantLogin}
                      className="space-y-3.5"
                    >
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Mail size={18} /></div>
                        <Input
                          type="email"
                          placeholder="Email address"
                          className="pl-12 h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium transition-all"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground"><Lock size={18} /></div>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="pl-12 pr-12 h-13 rounded-2xl bg-secondary/40 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium transition-all"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                        />
                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between px-0.5 pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none group">
                          <div
                            onClick={() => setRememberMe(v => !v)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary' : 'border-muted-foreground/40 group-hover:border-primary/50'}`}
                          >
                            {rememberMe && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                        </label>
                        <button type="button" onClick={() => goToStep('forgot')} className="text-sm font-bold text-primary hover:underline">
                          Forgot password?
                        </button>
                      </div>

                      {displayError && (
                        <div className="p-3 bg-destructive/8 rounded-xl border border-destructive/15">
                          <p className="text-sm font-semibold text-destructive text-center">{displayError}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-13 rounded-2xl text-sm font-bold mt-1"
                        disabled={!email || !password || actionLoading}
                      >
                        {actionLoading ? <LoadingDots /> : <>Sign In <ArrowRight className="ml-2" size={18} /></>}
                      </Button>

                      <p className="text-center text-sm text-muted-foreground pt-1">
                        Don't have an account?{' '}
                        <button type="button" onClick={() => goToStep('signup')} className="font-bold text-primary hover:underline">
                          Create account
                        </button>
                      </p>
                    </motion.form>
                  )}

                  {/* ── Customer: no account needed ── */}
                  {role === 'customer' && (
                    <motion.div
                      key="customer-form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-5"
                    >
                      <div className="bg-secondary/50 rounded-[22px] p-6 text-center space-y-3 border border-border/60">
                        <div className="w-12 h-12 bg-primary/8 rounded-full flex items-center justify-center mx-auto border border-primary/15">
                          <User size={22} className="text-primary" />
                        </div>
                        <p className="text-base font-bold text-foreground">No account needed</p>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                          Browse merchants, approve debts, and make payments — all via your shared link.
                        </p>
                      </div>
                      <Button
                        className="w-full h-13 rounded-2xl text-sm font-bold"
                        onClick={handleCustomerContinue}
                      >
                        Continue to app <ArrowRight className="ml-2" size={18} />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 text-center text-xs font-medium text-muted-foreground/70">
            By continuing, you agree to NearPay's{' '}
            <a href="#" className="hover:text-foreground transition-colors underline underline-offset-4">Terms</a>
            {' '}&amp;{' '}
            <a href="#" className="hover:text-foreground transition-colors underline underline-offset-4">Privacy</a>
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
