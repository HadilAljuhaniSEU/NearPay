import { motion } from 'framer-motion';
import { Caption } from './Shared';
import { useState, useEffect } from 'react';

export function Scene8ContactOptions() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 2500), // tap WhatsApp
      setTimeout(() => setPhase(2), 3200), // tap Call
      setTimeout(() => setPhase(3), 3900), // tap Map
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#F8FAFC]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md p-8 flex flex-col gap-6">
        
        {/* Merchant Header */}
        <motion.div 
          className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-5 border border-gray-100"
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        >
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-gray-100">🏪</div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">بقالة النخيل</h2>
            <p className="text-gray-500 font-medium">تواصل بالطريقة اللي تناسبك</p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          {/* WhatsApp Card */}
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center justify-between cursor-pointer relative overflow-hidden"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1, scale: phase === 1 ? 0.95 : 1, backgroundColor: phase === 1 ? '#f0fdf4' : '#ffffff' }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center text-2xl">💬</div>
              <div className="font-bold text-gray-800 text-lg">راسل على واتساب</div>
            </div>
            <div className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded">سريع</div>
            {phase === 1 && <motion.div className="absolute inset-0 bg-[#25D366]/20" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} />}
          </motion.div>

          {/* Call Card */}
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center gap-4 cursor-pointer relative overflow-hidden"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1, scale: phase === 2 ? 0.95 : 1, backgroundColor: phase === 2 ? '#f0fdfa' : '#ffffff' }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <div className="w-12 h-12 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full flex items-center justify-center text-2xl">📞</div>
            <div className="font-bold text-gray-800 text-lg">اتصل بالتاجر</div>
            {phase === 2 && <motion.div className="absolute inset-0 bg-[#14B8A6]/20" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} />}
          </motion.div>

          {/* Map Card */}
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center justify-between cursor-pointer relative overflow-hidden"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1, scale: phase === 3 ? 0.95 : 1, backgroundColor: phase === 3 ? '#f8fafc' : '#ffffff' }}
            transition={{ delay: 1.0, type: "spring" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-2xl">📍</div>
              <div className="font-bold text-gray-800 text-lg">افتح الموقع</div>
            </div>
            <div className="w-16 h-10 bg-gray-200 rounded border border-gray-300 overflow-hidden relative">
               <div className="absolute inset-0 bg-blue-100/50 mix-blend-multiply" />
            </div>
            {phase === 3 && <motion.div className="absolute inset-0 bg-gray-200/50" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} />}
          </motion.div>
        </div>
      </div>

      <Caption text="WhatsApp, call, or get directions — instantly" />
    </motion.div>
  );
}