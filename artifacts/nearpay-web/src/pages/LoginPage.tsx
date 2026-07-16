import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, User, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBar } from '../components/StatusBar';
import { NearPayLogo } from '../components/NearPayLogo';

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const [role, setRole] = useState<'merchant' | 'customer'>('merchant');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('nearpay_role', role);
      setLocation(role === 'merchant' ? '/merchant/dashboard' : '/customer/home');
    }, 800);
  };

  return (
    <div className="app-container flex flex-col bg-card">
      <StatusBar />
      
      <div className="flex-1 flex flex-col px-6 py-8 justify-between relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <NearPayLogo className="mb-6 justify-center scale-125" />
            <h1 className="text-3xl font-bold text-center tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-center text-muted-foreground mt-2">
              Log in to manage your tabs
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                {/* Role Selector */}
                <div className="flex bg-secondary p-1 rounded-2xl mb-8 relative">
                  <motion.div 
                    className="absolute inset-y-1 bg-card shadow-sm rounded-xl"
                    layoutId="roleTab"
                    initial={false}
                    animate={{ 
                      left: role === 'merchant' ? '4px' : '50%', 
                      width: 'calc(50% - 4px)' 
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                  <button
                    onClick={() => setRole('merchant')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold relative z-10 transition-colors ${role === 'merchant' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Store size={18} />
                    Merchant
                  </button>
                  <button
                    onClick={() => setRole('customer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold relative z-10 transition-colors ${role === 'customer' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <User size={18} />
                    Customer
                  </button>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                      <Phone size={20} />
                    </div>
                    <Input
                      type="tel"
                      placeholder="Phone number (+966)"
                      className="pl-12 h-14 rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary text-lg"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl text-lg font-semibold shadow-sm hover-elevate"
                    disabled={phone.length < 9 || loading}
                  >
                    {loading ? (
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <>Continue <ArrowRight className="ml-2" size={20} /></>
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                <div className="text-center mb-8">
                  <p className="text-sm text-muted-foreground mb-1">Enter code sent to</p>
                  <p className="font-semibold text-foreground">{phone}</p>
                  <button 
                    onClick={() => setStep('phone')}
                    className="text-primary text-sm font-medium mt-2 hover:underline"
                  >
                    Change number
                  </button>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-14 h-16 text-center text-2xl font-bold rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                        onChange={(e) => {
                          setOtp(prev => e.target.value ? prev + e.target.value : prev);
                          if (e.target.value && i < 4) {
                            const next = document.getElementById(`otp-${i + 1}`);
                            next?.focus();
                          }
                        }}
                        id={`otp-${i}`}
                      />
                    ))}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl text-lg font-semibold shadow-sm hover-elevate"
                    disabled={otp.length < 4 || loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="text-center text-xs text-muted-foreground pb-4">
          By continuing, you agree to NearPay's Terms & Conditions
        </div>
      </div>
    </div>
  );
}
