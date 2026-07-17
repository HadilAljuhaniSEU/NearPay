import { motion } from 'framer-motion';
import { Caption } from './Shared';
import { useState, useEffect } from 'react';

export function Scene10Payment() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 2500), // tap full pay
      setTimeout(() => setPhase(2), 3000), // loading
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#F1F5F9]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0, x: '50vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
      transition={{ type: "spring", damping: 25 }}
    >
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner border border-gray-100">🏪</div>
          <h2 className="text-lg font-bold text-gray-500 mb-1">سداد إلى بقالة النخيل</h2>
          <div className="text-4xl font-black text-[#0F172A]">٤٥ ريال</div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Full amount */}
          <motion.div
            className={`rounded-2xl p-4 border-2 cursor-pointer flex justify-between items-center relative overflow-hidden transition-colors ${phase >= 1 ? 'bg-[#14B8A6] border-[#14B8A6] text-white' : 'bg-[#14B8A6] border-[#14B8A6] text-white shadow-lg'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, scale: phase === 1 ? 0.95 : 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="font-bold text-lg">سدّد كاملاً</div>
            <div className="font-black text-xl">٤٥ ريال</div>
            {phase === 1 && <motion.div className="absolute inset-0 bg-white/30" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.4 }} />}
          </motion.div>

          {/* Half amount */}
          <motion.div
            className="rounded-2xl p-4 border-2 border-[#14B8A6] text-[#14B8A6] flex justify-between items-center"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          >
            <div className="font-bold text-lg">سدّد نصف</div>
            <div className="font-black text-xl">٢٢.٥ ريال</div>
          </motion.div>

          {/* Custom amount */}
          <motion.div
            className="rounded-2xl p-4 border-2 border-gray-200 text-gray-500 flex justify-between items-center bg-gray-50"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          >
            <div className="font-bold text-lg">مبلغ مخصص</div>
            <div className="text-gray-300 font-mono text-xl" dir="ltr">0.00</div>
          </motion.div>
        </div>

        {/* Loading overlay for the whole card */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <motion.div 
                className="w-16 h-16 border-4 border-gray-200 border-t-[#14B8A6] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <Caption text="Pay in full, half, or a custom amount" />
    </motion.div>
  );
}

import { AnimatePresence as AP } from 'framer-motion';
const AnimatePresence = AP;