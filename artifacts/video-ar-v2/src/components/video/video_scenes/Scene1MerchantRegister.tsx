import { motion } from 'framer-motion';
import { Caption } from './Shared';
import { useState, useEffect } from 'react';

export function Scene1MerchantRegister() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
      setTimeout(() => setPhase(5), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#F8FAFC]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Decor */}
      <motion.div className="absolute top-0 right-0 w-96 h-96 bg-[#14B8A6] opacity-5 rounded-bl-[100px]" />
      
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 flex flex-col relative z-10" style={{ height: '70vh' }}>
        <div className="bg-[#14B8A6] text-white p-6 text-center shadow-sm z-10 relative">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-md"
          >
            <span className="text-2xl">🏪</span>
          </motion.div>
          <h2 className="text-xl font-bold">تسجيل متجر جديد</h2>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
          {/* Form Field 1 */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }} animate={phase >= 1 ? { x: 0, opacity: 1 } : {}}
            className="flex flex-col gap-2"
          >
            <label className="text-sm font-semibold text-gray-500">اسم المتجر</label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-800 font-bold flex items-center">
              {phase >= 1 && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block">بقالة النخيل</motion.span>
              )}
              {phase === 1 && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity }} className="w-[2px] h-5 bg-[#14B8A6] ml-1" />}
            </div>
          </motion.div>

          {/* Form Field 2 */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }} animate={phase >= 2 ? { x: 0, opacity: 1 } : {}}
            className="flex flex-col gap-2"
          >
            <label className="text-sm font-semibold text-gray-500">التصنيف</label>
            <div className="flex gap-2 text-sm font-medium">
              <div className="bg-[#14B8A6] text-white px-3 py-1.5 rounded-full shadow-sm">بقالة ✓</div>
              <div className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full">مطعم</div>
              <div className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full">صيدلية</div>
            </div>
          </motion.div>

          {/* Form Field 3 */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }} animate={phase >= 3 ? { x: 0, opacity: 1 } : {}}
            className="flex flex-col gap-2"
          >
            <label className="text-sm font-semibold text-gray-500">رقم الجوال</label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-800 flex items-center text-left" dir="ltr">
              <span className="text-gray-400 mr-2">+966</span>
              <span className="font-bold tracking-widest font-mono">50 XXX XXXX</span>
            </div>
          </motion.div>

          <div className="mt-auto">
            <motion.button
              initial={{ y: 50, opacity: 0 }} animate={phase >= 4 ? { y: 0, opacity: 1 } : {}}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg relative overflow-hidden transition-colors ${phase >= 5 ? 'bg-[#10B981] text-white' : 'bg-[#14B8A6] text-white'}`}
            >
              {phase >= 5 ? "✓ تم التسجيل" : "سجّل الآن"}
              {phase === 4 && <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '100%' }} animate={{ x: '-100%' }} transition={{ duration: 0.6 }} />}
            </motion.button>
          </div>
        </div>
      </div>

      <Caption text="Register your business in seconds" />
    </motion.div>
  );
}