import { motion } from 'framer-motion';
import { Caption, NearPayLogo, PhoneFrame } from './Shared';
import { useState, useEffect } from 'react';

export default function Scene3AddDebt() {
  const [total, setTotal] = useState(3);
  
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setTotal(11), 1000 + 400),
      setTimeout(() => setTotal(26), 1000 + 800),
      setTimeout(() => setTotal(35), 1000 + 1200),
      setTimeout(() => setTotal(45), 1000 + 1600),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const products = [
    { name: "خبز التوست", price: "٣ ريال", delay: 1.0 },
    { name: "حليب كامل الدسم", price: "٨ ريال", delay: 1.4 },
    { name: "تمر مجدول", price: "١٥ ريال", delay: 1.8 },
    { name: "عصير برتقال", price: "٩ ريال", delay: 2.2 },
    { name: "بيض ١٢ حبة", price: "١٠ ريال", delay: 2.6 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center font-arabic"
      style={{ direction: 'rtl', background: '#F6F9FC' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8 }}
    >
      <PhoneFrame>
        <div className="w-full h-14 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] flex items-center justify-center px-6 sticky top-0 z-20">
          <h1 className="text-[18px] font-bold text-[#0B2341]">إضافة دين جديد</h1>
          <div className="absolute left-6 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#E2E8F0]" />
            <div className="w-2 h-2 rounded-full bg-[#2ED8C3]" />
            <div className="w-2 h-2 rounded-full bg-[#E2E8F0]" />
          </div>
        </div>

        <div className="p-6 flex flex-col h-full bg-white">
          <div className="mb-6 flex flex-col gap-2">
            <label className="text-sm font-bold text-[#0B2341]">العميل</label>
            <div className="h-14 border border-[#2ED8C3] bg-[#2ED8C3]/5 rounded-xl flex items-center px-4 relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B2341] to-[#143B63] flex items-center justify-center text-white text-sm font-bold ml-3">هـ</div>
              <span className="font-bold text-[#0B2341]">هديل المطيري</span>
              <span className="absolute left-4 text-[#2ED8C3] font-bold">✓</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold text-[#0B2341] mb-2 block">المنتجات</label>
            <div className="space-y-3">
              {products.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: p.delay, type: 'spring', stiffness: 200, damping: 20 }}
                  className="flex justify-between items-center py-2 border-b border-[#E2E8F0] last:border-0"
                >
                  <span className="font-medium text-[#0B2341]">{p.name}</span>
                  <span className="font-bold text-[#0B2341]">{p.price}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="mt-auto mb-4 bg-[#F1F5F9] rounded-xl py-6 flex flex-col items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-[#64748B] text-sm font-bold mb-1">الإجمالي</span>
            <div className="text-5xl font-bold text-[#0B2341] flex gap-2 items-baseline" style={{ direction: 'ltr' }}>
              <span className="text-2xl text-[#64748B]">ريال</span>
              <motion.span
                key={total}
                initial={{ scale: 1.2, color: '#2ED8C3' }}
                animate={{ scale: 1, color: '#0B2341' }}
              >
                {total.toLocaleString('ar-SA')}
              </motion.span>
            </div>
          </motion.div>

          <div className="flex gap-2 mb-6" style={{ direction: 'ltr' }}>
            {['+١٠', '+٢٠', '+٥٠'].map((val, i) => (
              <motion.div 
                key={val}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3 + (i * 0.1) }}
                className="flex-1 py-2 rounded-lg border border-[#2ED8C3] text-[#2ED8C3] font-bold text-center text-sm"
              >
                {val}
              </motion.div>
            ))}
          </div>

          <motion.button
            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2ED8C3] to-[#19B8D3] text-white font-bold text-lg mb-2 relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              animate={total === 45 ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.4, delay: 6.5 }}
            />
            <span className="relative z-10">إرسال طلب الدين {total.toLocaleString('ar-SA')} ريال</span>
          </motion.button>
        </div>

        {/* Success Overlay */}
        <motion.div
          className="absolute inset-0 bg-[#2ED8C3] z-50 flex flex-col items-center justify-center text-white"
          initial={{ opacity: 0 }}
          animate={total === 45 ? { opacity: [0, 1] } : { opacity: 0 }}
          transition={{ delay: 6.8, duration: 0.3 }}
          style={{ pointerEvents: 'none' }}
        >
          <motion.svg
            className="w-24 h-24 mb-4"
            viewBox="0 0 50 50"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={total === 45 ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ delay: 7.0, duration: 0.5 }}
          >
            <motion.path
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={total === 45 ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ delay: 7.0, duration: 0.5 }}
            />
          </motion.svg>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={total === 45 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 7.3 }}
            className="text-2xl font-bold text-center"
          >
            تم إرسال الطلب لـ هديل ✓
          </motion.div>
        </motion.div>
      </PhoneFrame>
      <Caption ar="سجّل دين البقالة فوراً" en="Log a grocery debt instantly" />
    </motion.div>
  );
}
