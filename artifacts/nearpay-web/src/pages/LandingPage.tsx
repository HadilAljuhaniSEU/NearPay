import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Store, User, ArrowRight, Moon, Sun, MapPin, ShieldCheck, TrendingUp } from 'lucide-react';
import { NearPayLogo, NearPayIcon } from '../components/NearPayLogo';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useAuthContext } from '../contexts/AuthContext';
import { useT } from '../contexts/LanguageContext';
import { useDarkMode } from '../hooks/useDarkMode';

const stagger  = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp   = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.25 } } };
const fadeIn   = { hidden: { opacity: 0 },         show: { opacity: 1, transition: { duration: 0.5 } } };

const FEATURES = [
  { icon: ShieldCheck, label: 'Trusted by merchants',  color: '#20D6C7' },
  { icon: TrendingUp,  label: 'Track collections',     color: '#19B8D3' },
  { icon: MapPin,      label: 'Near your customers',   color: '#20D6C7' },
] as const;

export default function LandingPage() {
  const [, setLocation]          = useLocation();
  const { user, loading }        = useAuthContext();
  const { isDark, toggle }       = useDarkMode();
  const t = useT();

  // Already authenticated → skip landing, go straight to dashboard
  useEffect(() => {
    if (!loading && user) {
      setLocation('/merchant/dashboard');
    }
  }, [loading, user, setLocation]);

  // Show spinner while resolving auth
  if (loading) {
    return (
      <div className="app-container flex items-center justify-center bg-background">
        <div className="relative">
          <NearPayIcon size={52} />
          <div className="absolute -inset-3 border-2 border-teal/30 rounded-full animate-spin border-t-teal" />
        </div>
      </div>
    );
  }

  // Don't render landing if already being redirected
  if (user) return null;

  return (
    <div className="app-container flex flex-col bg-background overflow-hidden relative">

      {/* ── Ambient background blobs ── */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.12) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(32,214,199,0.10) 0%, transparent 70%)' }} />

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 flex-shrink-0">
        <NearPayLogo size={28} />
        <div className="flex items-center gap-2">
          {/* Dark / Light toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border/60 hover:bg-secondary/80 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark
              ? <Sun  size={15} className="text-amber-400" />
              : <Moon size={15} className="text-muted-foreground" />}
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-10" style={{ scrollbarWidth: 'none' }}>
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8 pt-4">

          {/* ── Hero ── */}
          <motion.div variants={fadeUp} className="text-center pt-2">
            {/* Large icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 scale-150 rounded-full blur-2xl"
                     style={{ background: 'radial-gradient(circle, rgba(11,95,255,0.18), transparent)' }} />
                <NearPayIcon size={72} />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground leading-tight mb-3">
              {t('simplify_your')}<br />
              <span style={{ background: 'linear-gradient(135deg, #2ED8C3, #19B8D3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('merchant_tabs')}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[300px] mx-auto">
              {t('hero_subtitle')}
            </p>
          </motion.div>

          {/* ── Feature chips ── */}
          <motion.div variants={fadeIn} className="flex gap-2 justify-center flex-wrap">
            {FEATURES.map(f => (
              <div key={f.label}
                   className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-card border border-border/60 shadow-sm">
                <f.icon size={12} style={{ color: f.color }} />
                <span className="text-[11px] font-semibold text-foreground">{f.label}</span>
              </div>
            ))}
          </motion.div>

          {/* ── Mini phone preview ── */}
          <motion.div variants={fadeIn} className="flex justify-center">
            <div className="relative w-[180px] h-[120px]">
              <svg width="100%" height="100%" viewBox="0 0 220 140" fill="none">
                {/* Card 1 */}
                <rect x="10" y="8"  width="120" height="70" rx="12" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.08" />
                <circle cx="38"  cy="37" r="13" fill="#2ED8C3" fillOpacity="0.15" />
                <rect x="60"  y="30" width="55" height="7" rx="3.5" fill="currentColor" fillOpacity="0.12" />
                <rect x="60"  y="43" width="38" height="5" rx="2.5" fill="#20D6C7" fillOpacity="0.5" />
                <rect x="20"  y="62" width="70" height="7" rx="3.5" fill="currentColor" fillOpacity="0.08" />

                {/* Card 2 */}
                <rect x="90" y="48" width="120" height="80" rx="12" fill="#19B8D3" fillOpacity="0.12" stroke="#19B8D3" strokeOpacity="0.2" />
                <circle cx="118" cy="78" r="13" fill="#20D6C7" fillOpacity="0.2" />
                <rect x="140" y="71" width="55" height="7" rx="3.5" fill="white" fillOpacity="0.25" />
                <rect x="140" y="84" width="38" height="5" rx="2.5" fill="#20D6C7" fillOpacity="0.6" />
                <rect x="100" y="108" width="70" height="7" rx="3.5" fill="white" fillOpacity="0.15" />

                {/* Pulse dot */}
                <circle cx="130" cy="48" r="5" fill="#20D6C7" />
                <circle cx="130" cy="48" r="5" fill="#20D6C7" fillOpacity="0.3">
                  <animate attributeName="r" from="5" to="14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="fillOpacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </motion.div>

          {/* ── CTA Buttons ── */}
          <motion.div variants={stagger} className="space-y-3">

            {/* Merchant Login */}
            <motion.button
              variants={fadeUp}
              onClick={() => setLocation('/login')}
              className="w-full h-14 rounded-2xl flex items-center justify-between px-5 font-bold text-sm text-white shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #2ED8C3 0%, #19B8D3 100%)', boxShadow: '0 4px 16px rgba(46,216,195,0.35)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Store size={17} />
                </div>
                <div className="text-left">
                  <p className="font-bold leading-tight">{t('merchant')}</p>
                  <p className="text-[11px] text-white/70 font-medium">{t('sign_in')} · {t('create_account_link')}</p>
                </div>
              </div>
              <ArrowRight size={18} className="rtl-flip" />
            </motion.button>

            {/* Customer Access */}
            <motion.button
              variants={fadeUp}
              onClick={() => {
                localStorage.setItem('nearpay_role', 'customer');
                setLocation('/customer/nearby');
              }}
              className="w-full h-14 rounded-2xl flex items-center justify-between px-5 font-bold text-sm bg-card border border-border/70 hover:border-teal/40 transition-colors active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                     style={{ background: 'rgba(32,214,199,0.12)' }}>
                  <User size={17} style={{ color: '#20D6C7' }} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground leading-tight">{t('customer')}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{t('no_account_needed')}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-muted-foreground rtl-flip" />
            </motion.button>
          </motion.div>

          {/* ── Trust line ── */}
          <motion.p variants={fadeIn}
            className="text-center text-[11px] text-muted-foreground font-medium">
            {t('by_continuing')}{' '}
            <a href="#" className="font-bold underline underline-offset-2"
               style={{ color: '#20D6C7' }}>
              {t('terms')}
            </a>
            {' '}&amp;{' '}
            <a href="#" className="font-bold underline underline-offset-2"
               style={{ color: '#20D6C7' }}>
              {t('privacy')}
            </a>
          </motion.p>

        </motion.div>
      </div>
    </div>
  );
}
