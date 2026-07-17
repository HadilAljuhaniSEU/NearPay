import { motion } from 'framer-motion';
import { PhoneMockup } from './Shared';
import { useState, useEffect } from 'react';

export const Scene7Payment = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1500), // Options appear
      setTimeout(() => setStep(2), 3500), // Tap first option
      setTimeout(() => setStep(3), 4000), // Button morphs to loading
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex gap-16 items-center">
        <PhoneMockup>
          <div className="bg-slate-50 w-full h-full flex flex-col pt-12 relative">
            <div className="px-6 pb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl mb-4">
                →
              </div>
              <h3 className="text-2xl font-bold text-slate-800">كم تريد أن تدفع؟</h3>
            </div>

            <div className="px-6 flex-1 flex flex-col gap-4 relative">
              
              {/* Option 1: Full Amount */}
              <motion.div 
                className={`p-5 rounded-2xl border-2 transition-colors relative overflow-hidden ${step >= 2 ? 'border-[#14B8A6] bg-teal-50/50' : 'border-slate-200 bg-white'}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {step >= 2 && (
                  <motion.div 
                    className="absolute inset-0 bg-[#14B8A6]/10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 2, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <div className="font-bold text-lg text-slate-800">المبلغ كاملاً</div>
                    <div className="text-sm text-slate-500">تسديد الذمة بالكامل</div>
                  </div>
                  <div className="text-2xl font-bold text-[#14B8A6]">٤٥ ريال</div>
                </div>
                
                {/* Simulated tap indicator */}
                {step === 2 && (
                  <motion.div 
                    className="absolute w-12 h-12 bg-black/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>

              {/* Option 2: Half Amount */}
              <motion.div 
                className="p-5 rounded-2xl border-2 border-slate-200 bg-white"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-slate-800">نصف المبلغ</div>
                    <div className="text-sm text-slate-500">تسديد ٥٠٪ الآن</div>
                  </div>
                  <div className="text-2xl font-bold text-slate-600">٢٢.٥ ريال</div>
                </div>
              </motion.div>

              {/* Option 3: Custom Amount */}
              <motion.div 
                className="p-5 rounded-2xl border-2 border-slate-200 bg-white"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-slate-800">مبلغ مخصص</div>
                    <div className="text-sm text-slate-500">أدخل المبلغ الذي يناسبك</div>
                  </div>
                  <div className="text-slate-400 text-xl">✎</div>
                </div>
              </motion.div>

              <div className="mt-auto mb-8">
                <motion.div 
                  className={`text-white text-center py-4 rounded-xl font-bold text-lg flex items-center justify-center h-14 ${step >= 2 ? 'bg-[#14B8A6]' : 'bg-slate-300'}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {step >= 3 ? (
                    <motion.div 
                      className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  ) : (
                    "تأكيد الدفع"
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </PhoneMockup>

        <motion.div 
          className="text-right"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-[#0F172A] mb-4 font-display leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            خيارات سداد مرنة
          </h2>
          <p className="text-2xl text-[#64748B]">
            يدفع العميل ما يناسبه<br/>لتسهيل التحصيل
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};