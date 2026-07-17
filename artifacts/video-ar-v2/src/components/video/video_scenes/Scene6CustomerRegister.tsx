import { motion } from 'framer-motion';
import { Caption, LogoCard } from './Shared';
import { useState, useEffect } from 'react';

export function Scene6CustomerRegister() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800), // Type name
      setTimeout(() => setPhase(2), 1600), // Type phone
      setTimeout(() => setPhase(3), 2400), // Show location prompt
      setTimeout(() => setPhase(4), 3200), // Allow location
      setTimeout(() => setPhase(5), 4000), // Success
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#F1F5F9]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col relative" style={{ height: '75vh' }}>
        
        {/* Header */}
        <div className="py-8 flex flex-col items-center bg-gradient-to-b from-gray-50 to-white">
          <LogoCard className="mb-4" />
          <h2 className="text-2xl font-black text-gray-900">مرحباً بك في NearPay</h2>
          <p className="text-gray-500 font-medium">سجل حسابك كعميل</p>
        </div>

        <div className="p-6 flex flex-col gap-5 flex-1 relative">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-500">الاسم الكامل</label>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-800 font-bold text-lg h-14 flex items-center">
              {phase >= 1 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>محمد أحمد</motion.span>}
              {phase === 0 && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity }} className="w-[2px] h-6 bg-[#14B8A6] inline-block" />}
            </div>
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-500">رقم الجوال</label>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-800 font-bold text-lg font-mono h-14 flex items-center text-left" dir="ltr">
              {phase >= 2 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>050 123 4567</motion.span>}
              {phase === 1 && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity }} className="w-[2px] h-6 bg-[#14B8A6] inline-block" />}
            </div>
          </div>

          {/* Location Prompt Overlay */}
          <AnimatePresence>
            {phase >= 3 && phase < 5 && (
              <motion.div 
                className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">📍</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">نحتاج موقعك</h3>
                <p className="text-gray-500 mb-6 text-sm font-medium">لعرض المحلات القريبة منك والتي تقبل الديون</p>
                <motion.button 
                  className="w-full py-3 bg-[#14B8A6] text-white rounded-xl font-bold shadow-lg"
                  animate={phase === 4 ? { scale: 0.95, backgroundColor: '#0d9488' } : {}}
                >
                  السماح بالموقع
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Overlay */}
          <AnimatePresence>
            {phase >= 5 && (
              <motion.div 
                className="absolute inset-0 bg-[#10B981] z-30 flex flex-col items-center justify-center p-6 text-center text-white"
                initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
                animate={{ opacity: 1, clipPath: 'circle(150% at 50% 50%)' }}
                transition={{ duration: 0.6 }}
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="text-6xl mb-4 bg-white text-[#10B981] rounded-full w-20 h-20 flex items-center justify-center shadow-xl">✓</motion.div>
                <h3 className="text-2xl font-black mb-2">تم تسجيلك!</h3>
                <p className="text-white/90 font-medium">اكتشف المحلات القريبة منك →</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <Caption text="Sign up and start exploring nearby stores" />
    </motion.div>
  );
}

import { AnimatePresence as AP } from 'framer-motion';
const AnimatePresence = AP;