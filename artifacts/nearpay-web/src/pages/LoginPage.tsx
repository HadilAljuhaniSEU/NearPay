import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, User, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBar } from '../components/StatusBar';
import { NearPayLogo } from '../components/NearPayLogo';
import { useAuth } from '../hooks/useAuth';
import { resetMerchantPassword } from '../services/authService';

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
    <div className="app-container flex flex-col bg-card">
      <StatusBar />

      <div className="flex-1 flex flex-col px-6 py-8 justify-between relative overflow-hidden">
        {/* Background decoration — unchanged */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <NearPayLogo className="mb-6 justify-center scale-125" />
            <h1 className="text-3xl font-bold text-center tracking-tight text-foreground">
              {step === 'forgot' ? 'Reset Password' : 'Welcome back'}
            </h1>
            <p className="text-center text-muted-foreground mt-2">
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
                  <div className="text-center py-8 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Mail className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground">Check your inbox</p>
                    <p className="text-sm text-muted-foreground">
                      A reset link was sent to <span className="font-medium">{forgotEmail}</span>
                    </p>
                    <button
                      onClick={() => { setStep('form'); setForgotSent(false); setForgotEmail(''); }}
                      className="text-primary text-sm font-medium hover:underline mt-4 block mx-auto"
                    >
                      Back to login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                        <Mail size={20} />
                      </div>
                      <Input
                        type="email"
                        placeholder="Email address"
                        className="pl-12 h-14 rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary text-base"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                    {forgotError && (
                      <p className="text-sm text-destructive text-center">{forgotError}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl text-lg font-semibold shadow-sm hover-elevate"
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
                      className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                {/* Role Selector — same visual as before */}
                <div className="flex bg-secondary p-1 rounded-2xl mb-7 relative">
                  <motion.div
                    className="absolute inset-y-1 bg-card shadow-sm rounded-xl"
                    layoutId="roleTab"
                    initial={false}
                    animate={{
                      left: role === 'merchant' ? '4px' : '50%',
                      width: 'calc(50% - 4px)',
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                  <button
                    onClick={() => { setRole('merchant'); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold relative z-10 transition-colors ${role === 'merchant' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Store size={18} />
                    Merchant
                  </button>
                  <button
                    onClick={() => { setRole('customer'); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold relative z-10 transition-colors ${role === 'customer' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
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
                      className="space-y-4"
                    >
                      {/* Email */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                          <Mail size={20} />
                        </div>
                        <Input
                          type="email"
                          placeholder="Email address"
                          className="pl-12 h-14 rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary text-base"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                          <Lock size={20} />
                        </div>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="pl-12 pr-12 h-14 rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary text-base"
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

                      {/* Remember Me + Forgot Password */}
                      <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <div
                            onClick={() => setRememberMe((v) => !v)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${rememberMe ? 'bg-primary border-primary' : 'border-border'}`}
                          >
                            {rememberMe && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setStep('forgot')}
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Error */}
                      {error && (
                        <p className="text-sm text-destructive text-center px-2">{error}</p>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-14 rounded-2xl text-lg font-semibold shadow-sm hover-elevate"
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
                      className="space-y-4"
                    >
                      <div className="bg-secondary/60 rounded-2xl p-5 text-center space-y-2">
                        <p className="text-sm font-medium text-foreground">No account needed</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Browse nearby merchants, approve debts, and make payments — all without signing up.
                        </p>
                      </div>
                      <Button
                        className="w-full h-14 rounded-2xl text-lg font-semibold shadow-sm hover-elevate"
                        onClick={handleCustomerContinue}
                      >
                        Continue as Customer <ArrowRight className="ml-2" size={20} />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center text-xs text-muted-foreground pb-4">
          By continuing, you agree to NearPay's Terms &amp; Conditions
        </div>
      </div>
    </div>
  );
}
