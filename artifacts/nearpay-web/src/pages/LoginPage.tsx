import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, User, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NearPayLogo } from '../components/NearPayLogo';
import { useAuth } from '../hooks/useAuth';
import { resetMerchantPassword } from '../services/authService';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const { signIn, actionLoading } = useAuth();

  const [role, setRole] = useState<'merchant' | 'customer'>('merchant');
  const [step, setStep] = useState<'form' | 'forgot'>('form');

  // Merchant form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleMerchantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    try {
      await signIn(email, password, rememberMe);
    } catch {
      // error handled inside useAuth
    }
  };

  const handleCustomerContinue = () => {
    localStorage.setItem('nearpay_role', 'customer');
    setLocation('/customer/home');
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

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden text-foreground">
      {/* ── Left Side: Geometric Illustration ── */}
      <div className="hidden lg:flex flex-1 relative bg-foreground overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <NearPayLogo size={48} className="mb-12 [&_span]:text-background [&_.text-primary]:text-primary" />
          <h1 className="text-5xl font-bold tracking-tight text-background mb-6 leading-tight">
            Simplify your <br />
            <span className="text-primary">merchant tabs</span>
          </h1>
          <p className="text-lg text-background/60 mb-12">
            The smart way to manage customer debts, track collections, and boost your cash flow.
          </p>
          
          <div className="relative w-full h-[400px]">
            <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="50" width="160" height="200" rx="24" fill="#ffffff" fillOpacity="0.05" />
              <rect x="190" y="150" width="160" height="200" rx="24" fill="#16A34A" />
              <circle cx="130" cy="110" r="24" fill="#ffffff" fillOpacity="0.1" />
              <rect x="90" y="160" width="80" height="8" rx="4" fill="#ffffff" fillOpacity="0.1" />
              <rect x="90" y="180" width="60" height="8" rx="4" fill="#ffffff" fillOpacity="0.1" />
              <circle cx="270" cy="210" r="24" fill="#ffffff" fillOpacity="0.2" />
              <rect x="230" y="260" width="80" height="8" rx="4" fill="#ffffff" fillOpacity="0.2" />
              <rect x="230" y="280" width="60" height="8" rx="4" fill="#ffffff" fillOpacity="0.2" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Right Side: Auth Card ── */}
      <div className="flex-1 flex flex-col justify-center relative items-center lg:items-start p-6 lg:p-24 bg-card lg:bg-background lg:max-w-2xl">
        <div className="absolute top-6 right-6 z-20">
          <LanguageSwitcher />
        </div>
        
        {/* Mobile blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl lg:hidden pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl lg:hidden pointer-events-none" />

        <div className="w-full max-w-[390px] mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center lg:text-left"
          >
            <div className="lg:hidden flex justify-center mb-6">
              <NearPayLogo size={40} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {step === 'forgot' ? 'Reset Password' : 'Welcome back'}
            </h2>
            <p className="text-muted-foreground mt-2 font-medium">
              {step === 'forgot'
                ? "We'll send you a reset link"
                : 'Log in to manage your tabs'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ── Forgot Password ── */}
            {step === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                {forgotSent ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-bold text-foreground text-lg">Check your inbox</p>
                    <p className="text-sm text-muted-foreground font-medium">
                      A reset link was sent to <span className="font-bold text-foreground">{forgotEmail}</span>
                    </p>
                    <button
                      onClick={() => { setStep('form'); setForgotSent(false); setForgotEmail(''); }}
                      className="text-primary text-sm font-bold hover:underline mt-6 block mx-auto"
                    >
                      Back to login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                        <Mail size={20} />
                      </div>
                      <Input
                        type="email"
                        placeholder="Email address"
                        className="pl-12 h-14 rounded-2xl bg-secondary/50 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base font-medium transition-all"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                    {forgotError && (
                      <p className="text-sm text-destructive text-center font-medium">{forgotError}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl text-base font-bold shadow-soft hover-elevate"
                      disabled={!forgotEmail || forgotLoading}
                    >
                      {forgotLoading ? (
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <>Send Reset Link <ArrowRight className="ml-2" size={20} /></>
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="w-full text-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Back to login
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* ── Main login form ── */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                {/* Role Selector */}
                <div className="flex bg-secondary/80 p-1.5 rounded-2xl mb-8 relative border border-border">
                  <motion.div
                    className="absolute inset-y-1.5 bg-card shadow-sm rounded-xl"
                    layoutId="roleTab"
                    initial={false}
                    animate={{
                      left: role === 'merchant' ? '6px' : '50%',
                      width: 'calc(50% - 6px)',
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                  <button
                    onClick={() => { setRole('merchant'); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold relative z-10 transition-colors ${role === 'merchant' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Store size={18} />
                    Merchant
                  </button>
                  <button
                    onClick={() => { setRole('customer'); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold relative z-10 transition-colors ${role === 'customer' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <User size={18} />
                    Customer
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {/* ── Merchant: email + password ── */}
                  {role === 'merchant' && (
                    <motion.form
                      key="merchant-form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onSubmit={handleMerchantLogin}
                      className="space-y-5"
                    >
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                            <Mail size={20} />
                          </div>
                          <Input
                            type="email"
                            placeholder="Email address"
                            className="pl-12 h-14 rounded-2xl bg-secondary/50 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base font-medium transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                            <Lock size={20} />
                          </div>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="pl-12 pr-12 h-14 rounded-2xl bg-secondary/50 border border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base font-medium transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none group">
                          <div
                            onClick={() => setRememberMe((v) => !v)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary' : 'border-muted-foreground/50 group-hover:border-primary/50'}`}
                          >
                            {rememberMe && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setStep('forgot')}
                          className="text-sm font-bold text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {error && (
                        <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                          <p className="text-sm font-semibold text-destructive text-center">{error}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-14 rounded-2xl text-base font-bold shadow-soft hover-elevate mt-2"
                        disabled={!email || !password || actionLoading}
                      >
                        {actionLoading ? (
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <>Sign In <ArrowRight className="ml-2" size={20} /></>
                        )}
                      </Button>
                    </motion.form>
                  )}

                  {/* ── Customer: no account needed ── */}
                  {role === 'customer' && (
                    <motion.div
                      key="customer-form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-6"
                    >
                      <div className="bg-secondary/60 rounded-[24px] p-6 text-center space-y-3 border border-border">
                        <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <User size={24} className="text-primary" />
                        </div>
                        <p className="text-base font-bold text-foreground">No account needed</p>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                          Browse nearby merchants, approve debts, and make payments — all securely and instantly.
                        </p>
                      </div>
                      <Button
                        className="w-full h-14 rounded-2xl text-base font-bold shadow-soft hover-elevate"
                        onClick={handleCustomerContinue}
                      >
                        Continue to app <ArrowRight className="ml-2" size={20} />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full text-center mt-12 lg:mt-auto lg:text-left text-xs font-semibold text-muted-foreground">
          By continuing, you agree to NearPay's <a href="#" className="hover:text-foreground transition-colors underline decoration-border underline-offset-4">Terms</a> &amp; <a href="#" className="hover:text-foreground transition-colors underline decoration-border underline-offset-4">Privacy</a>
        </div>
      </div>
    </div>
  );
}