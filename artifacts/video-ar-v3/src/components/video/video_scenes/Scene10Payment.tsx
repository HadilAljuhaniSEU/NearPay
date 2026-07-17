import { motion } from 'framer-motion';
import { Caption, NearPayLogo, PhoneFrame } from './Shared';
import { useState, useEffect } from 'react';
import { sfx } from '@/lib/sfx';

export default function Scene10Payment() {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => { setPaying(true); sfx.tap(); }, 3500);
    const t2 = setTimeout(() => { setPaid(true); sfx.payment(); }, 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center font-arabic"
      style={{ direction: 'rtl', background: '#F6F9FC' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6 }}
    >
      <PhoneFrame className="bg-white justify-center">
        <div className="flex flex-col items-center p-8 w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mb-4"
          >
            <NearPayLogo className="w-16 h-16" />
          </motion.div>
          
          <motion.h2
            className="text-xl font-bold text-[#64748B] mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            بقالة جدة
          </motion.h2>

          <motion.div
            className="relative flex flex-col items-center mb-12"
            animate={paid ? { scale: 1.2, y: -20 } : paying ? { scale: 0.95 } : { scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <motion.div 
              className="text-6xl font-bold text-[#0B2341] flex gap-2 items-baseline" style={{ direction: 'ltr' }}
              animate={paying ? { opacity: 0.5 } : paid ? { opacity: 1, color: '#22C55E' } : { opacity: 1 }}
            >
              <span className="text-3xl text-[#64748B]">ريال</span>
              ٤٥
            </motion.div>
            
            {paid && (
              <motion.div
                className="absolute -right-8 top-0 text-[#22C55E] text-4xl"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.6 }}
              >
                ✓
              </motion.div>
            )}
          </motion.div>

          <div className="w-full flex flex-col gap-4 relative">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="w-full relative overflow-hidden rounded-xl"
            >
              <div className={`w-full h-16 rounded-xl flex items-center justify-center font-bold text-lg transition-colors duration-300 ${paying || paid ? 'bg-[#22C55E] text-white' : 'bg-gradient-to-r from-[#2ED8C3] to-[#19B8D3] text-white'}`}>
                {paying && !paid ? (
                  <motion.div
                    className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : paid ? (
                  <span>تم السداد ✓</span>
                ) : (
                  <span>سداد كامل — ٤٥ ريال</span>
                )}
              </div>
              {/* Tap Ripple */}
              <motion.div
                className="absolute w-20 h-20 bg-white/40 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={paying && !paid ? { scale: 10, opacity: [1, 0] } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0, type: 'spring' }}
              className="w-full h-16 rounded-xl border-2 border-[#2ED8C3] bg-white flex items-center justify-center font-bold text-lg text-[#2ED8C3]"
            >
              سداد نصف — ٢٢.٥ ريال
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
              className="w-full h-16 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center font-bold text-lg text-[#64748B] gap-2"
            >
              <span>مبلغ مخصص</span>
              <span className="text-xl">✏️</span>
            </motion.div>
          </div>
        </div>
      </PhoneFrame>
      <Caption ar="ادفع كلاً أو نصفاً أو مبلغاً مخصصاً" en="Pay in full, half, or custom" />
    </motion.div>
  );
}
