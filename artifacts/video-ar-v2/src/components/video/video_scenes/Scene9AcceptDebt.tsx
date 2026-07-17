import { motion } from 'framer-motion';
import { Caption } from './Shared';
import { useState, useEffect } from 'react';

export function Scene9AcceptDebt() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000), // Popup appears
      setTimeout(() => setPhase(2), 3000), // Transitions to main card
      setTimeout(() => setPhase(3), 4500), // Tap accept
      setTimeout(() => setPhase(4), 5000), // Accepted state
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#F8FAFC]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Notification Popup */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            className="absolute top-10 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-white rounded-2xl shadow-2xl p-4 flex gap-4 items-center z-50 border border-gray-100"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-12 h-12 bg-[#14B8A6] rounded-xl flex items-center justify-center text-white text-xl shadow-md">🔔</div>
            <div>
              <div className="text-xs font-bold text-gray-400 mb-1">إشعار من NearPay</div>
              <div className="font-bold text-gray-800 text-sm">أنت قريب من بقالة النخيل! لديك دين ٤٥ ريال</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Review Card */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            className={`w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 transition-colors duration-500 ${phase >= 4 ? 'bg-[#14B8A6] text-white' : 'bg-white'}`}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
          >
            <div className="p-8 flex flex-col items-center text-center border-b border-white/10">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg ${phase >= 4 ? 'bg-white' : 'bg-gray-50 border border-gray-100'}`}>🏪</div>
              <h2 className={`text-xl font-bold mb-1 ${phase >= 4 ? 'text-white' : 'text-gray-500'}`}>بقالة النخيل</h2>
              <div className={`text-5xl font-black mb-4 ${phase >= 4 ? 'text-white' : 'text-[#0F172A]'}`}>٤٥ ريال</div>
              <div className={`text-sm font-medium px-4 py-1.5 rounded-full ${phase >= 4 ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                ٥ أصناف • اليوم
              </div>
            </div>

            <div className="p-6 flex flex-col gap-3 bg-white/5">
              {phase < 4 ? (
                <>
                  <motion.button 
                    className="w-full py-4 bg-[#10B981] text-white rounded-xl font-bold text-lg shadow-lg relative overflow-hidden"
                    animate={phase === 3 ? { scale: 0.95 } : {}}
                  >
                    قبول الدين
                    {phase === 3 && <motion.div className="absolute inset-0 bg-white/30" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.3 }} />}
                  </motion.button>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 border-2 border-[#EF4444] text-[#EF4444] rounded-xl font-bold">رفض الدين</button>
                    <button className="flex-1 py-3 border-2 border-gray-300 text-gray-500 rounded-xl font-bold">تأجيل السداد</button>
                  </div>
                </>
              ) : (
                <motion.div 
                  className="py-6 flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 bg-white text-[#14B8A6] rounded-full flex items-center justify-center text-3xl font-black mb-3 shadow-lg">✓</div>
                  <div className="text-2xl font-bold text-white">تم قبول الدين</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Caption text="Review, accept, or reject any debt" />
    </motion.div>
  );
}

import { AnimatePresence as AP } from 'framer-motion';
const AnimatePresence = AP;