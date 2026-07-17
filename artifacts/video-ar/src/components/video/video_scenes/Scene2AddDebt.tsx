import { motion, AnimatePresence } from 'framer-motion';
import { PhoneMockup } from './Shared';
import { useState, useEffect } from 'react';

export const Scene2AddDebt = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000), // Show form
      setTimeout(() => setStep(2), 2500), // Fill name & amount
      setTimeout(() => setStep(3), 4000), // Click save
      setTimeout(() => setStep(4), 4500), // Success overlay
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center gap-16">
        <motion.div 
          className="text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-[#0F172A] mb-4 font-display" style={{ fontFamily: 'var(--font-display)' }}>
            سجّل ديون عملائك بسهولة
          </h2>
          <p className="text-2xl text-[#64748B]">
            بضغطة زر، كل شيء موثق
          </p>
        </motion.div>

        <PhoneMockup>
          <div className="bg-[#14B8A6] pt-12 pb-6 px-6 text-white rounded-b-3xl">
            <h3 className="text-xl font-bold">إضافة ذمة جديدة</h3>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-6">
            <motion.div 
              className="bg-slate-50 p-4 rounded-xl border border-slate-200"
              initial={{ opacity: 0, y: 10 }}
              animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
            >
              <label className="text-sm text-slate-500 mb-2 block">اسم العميل</label>
              <div className="text-lg font-bold text-slate-800 flex items-center">
                {step >= 2 ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>محمد</motion.span>
                ) : (
                  <span className="text-slate-300">أدخل الاسم...</span>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="bg-slate-50 p-4 rounded-xl border border-slate-200"
              initial={{ opacity: 0, y: 10 }}
              animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
            >
              <label className="text-sm text-slate-500 mb-2 block">المبلغ (ريال)</label>
              <div className="text-3xl font-bold text-[#0F172A]">
                {step >= 2 ? (
                  <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>٤٥</motion.span>
                ) : (
                  <span className="text-slate-300">٠.٠٠</span>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="bg-slate-50 p-4 rounded-xl border border-slate-200"
              initial={{ opacity: 0, y: 10 }}
              animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm text-slate-500 mb-2 block">التفاصيل</label>
              <div className="text-lg text-slate-800">
                {step >= 2 ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>قهوة وكيك</motion.span>
                ) : (
                  <span className="text-slate-300">مثال: قهوة...</span>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="mt-auto bg-[#14B8A6] text-white text-center py-4 rounded-xl font-bold text-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={step >= 2 ? { opacity: 1, y: 0 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              {step === 3 && (
                <motion.div 
                  className="absolute inset-0 bg-white/30"
                  initial={{ x: '100%' }}
                  animate={{ x: '-100%' }}
                  transition={{ duration: 0.5 }}
                />
              )}
              حفظ الذمة
            </motion.div>
          </div>

          <AnimatePresence>
            {step >= 4 && (
              <motion.div 
                className="absolute inset-0 bg-black/60 flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="bg-white p-8 rounded-3xl text-center w-full shadow-2xl"
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0.6 }}
                >
                  <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A]">تم تسجيل الذمة</h3>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </PhoneMockup>
      </div>
    </motion.div>
  );
};