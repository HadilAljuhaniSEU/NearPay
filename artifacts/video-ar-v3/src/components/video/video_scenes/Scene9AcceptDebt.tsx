import { motion } from 'framer-motion';
import { Caption, NearPayLogo, PhoneFrame } from './Shared';
import { useState, useEffect } from 'react';

export default function Scene9AcceptDebt() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAccepted(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center font-arabic"
      style={{ direction: 'rtl', background: '#F6F9FC' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8 }}
    >
      <PhoneFrame className="bg-[#F8FAFC]">
        {/* Notification Pill */}
        <motion.div
          className="absolute top-6 left-4 right-4 z-50 bg-[#0D1929] rounded-2xl shadow-2xl p-4 flex items-center gap-3 overflow-hidden"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.5 }}
        >
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl shrink-0">🔔</div>
          <div className="flex flex-col flex-1">
            <span className="text-[#2ED8C3] font-bold text-xs">NearPay</span>
            <span className="text-white text-sm">أنتِ قريبة من بقالة جدة! دين ٤٥ ريال</span>
          </div>
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ delay: 1, duration: 1 }}
          />
        </motion.div>

        {/* Header */}
        <div className="w-full h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-center px-6 sticky top-0 z-10 pt-2 shadow-sm">
          <h1 className="text-[18px] font-bold text-[#0B2341]">تفاصيل الدين</h1>
        </div>

        <div className="p-6 flex flex-col h-full mt-10">
          <motion.div
            className={`w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(11,35,65,0.08)] flex flex-col relative transition-colors duration-500 border-2 ${accepted ? 'border-[#2ED8C3]' : 'border-transparent'}`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 1.5, type: 'spring' }}
          >
            {/* Accepted Badge */}
            {accepted && (
              <motion.div
                className="absolute -top-4 -left-4 bg-[#22C55E] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg z-20 flex items-center gap-1"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: -5 }}
                transition={{ type: 'spring', bounce: 0.6 }}
              >
                <span>✓</span> تم القبول
              </motion.div>
            )}

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
              <NearPayLogo className="w-14 h-14" />
              <div className="flex flex-col">
                <span className="font-bold text-xl text-[#0B2341]">بقالة جدة</span>
                <span className="text-[#64748B] text-sm">اليوم، ٤:٣٠ م</span>
              </div>
            </div>

            <div className="flex flex-col items-center mb-6">
              <span className="text-[#64748B] font-bold mb-1">المبلغ المطلوب</span>
              <div className="text-5xl font-bold text-[#0B2341] flex gap-2 items-baseline" style={{ direction: 'ltr' }}>
                <span className="text-2xl text-[#64748B]">ريال</span>
                ٤٥
              </div>
            </div>

            <div className="space-y-3 mb-8 bg-[#F8FAFC] p-4 rounded-xl">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#0B2341]">خبز التوست</span>
                <span className="text-[#0B2341]">٣ ريال</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#0B2341]">حليب كامل الدسم</span>
                <span className="text-[#0B2341]">٨ ريال</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#64748B]">٣ منتجات أخرى...</span>
                <span className="text-[#64748B]">٣٤ ريال</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 relative">
              <motion.button
                className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2ED8C3] to-[#19B8D3] text-white font-bold text-lg flex items-center justify-center gap-2 relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>✅</span> قبول الدين
                {/* Ripple */}
                <motion.div
                  className="absolute w-20 h-20 bg-white/40 rounded-full pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={accepted ? { scale: 5, opacity: [1, 0] } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
              
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 h-12 rounded-xl border border-[#EF4444] text-[#EF4444] font-bold text-sm bg-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.3 }}
                >
                  ✕ رفض الدين
                </motion.button>
                <motion.button
                  className="flex-1 h-12 rounded-xl border border-[#E2E8F0] text-[#64748B] font-bold text-sm bg-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.6 }}
                >
                  🕐 تأجيل السداد
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </PhoneFrame>
      <Caption ar="راجع وقبل أو ارفض أي دين" en="Review and accept or decline" />
    </motion.div>
  );
}
