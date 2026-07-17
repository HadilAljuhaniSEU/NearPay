import { motion } from 'framer-motion';
import { Caption } from './Shared';
import { useState, useEffect } from 'react';

export function Scene3AddDebt() {
  const [itemsPhase, setItemsPhase] = useState(0);

  const items = [
    { name: "خبز توست", price: "٣" },
    { name: "حليب كاملة", price: "٨" },
    { name: "تمر مجدول", price: "١٥" },
    { name: "عصير برتقال", price: "٩" },
    { name: "بيض ١٢ حبة", price: "١٠" },
  ];

  useEffect(() => {
    const timers = items.map((_, i) => setTimeout(() => setItemsPhase(i + 1), 600 + i * 500));
    timers.push(setTimeout(() => setItemsPhase(6), 4000)); // Total sum ready
    timers.push(setTimeout(() => setItemsPhase(7), 5000)); // Click send
    timers.push(setTimeout(() => setItemsPhase(8), 6000)); // Success overlay
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const currentTotal = items.slice(0, Math.min(itemsPhase, items.length)).reduce((acc, item) => {
    // Basic mapping since values are known
    const vals: Record<string, number> = { "٣": 3, "٨": 8, "١٥": 15, "٩": 9, "١٠": 10 };
    return acc + vals[item.price];
  }, 0);

  // Convert sum back to Arabic numeral
  const toArabicNums = (num: number) => String(num).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#0F172A]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col relative z-10" style={{ height: '80vh' }}>
        
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F1F5F9] rounded-full flex items-center justify-center text-xl">👤</div>
          <div>
            <div className="font-bold text-gray-800">محمد أحمد</div>
            <div className="text-sm font-mono text-gray-500" dir="ltr">050 123 4567</div>
          </div>
          <div className="mr-auto bg-[#14B8A6]/10 text-[#14B8A6] px-3 py-1 rounded-full text-sm font-bold">دين جديد</div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
              initial={{ opacity: 0, x: -30 }}
              animate={itemsPhase > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="font-semibold text-gray-800 text-lg">{item.name}</span>
              <span className="font-bold text-[#0F172A] text-lg">{item.price} ريال</span>
            </motion.div>
          ))}
        </div>

        {/* Footer / Total */}
        <div className="bg-white p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-gray-100 relative z-20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-bold text-lg">الإجمالي</span>
            <motion.span 
              className="text-3xl font-black text-[#14B8A6]"
              key={currentTotal}
              initial={{ scale: 1.5, color: '#0F172A' }}
              animate={{ scale: 1, color: '#14B8A6' }}
            >
              {toArabicNums(currentTotal)} ريال
            </motion.span>
          </div>

          <motion.button
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg relative overflow-hidden transition-all ${itemsPhase >= 8 ? 'bg-[#10B981] text-white' : 'bg-[#14B8A6] text-white hover:bg-[#0d9488]'}`}
            whileTap={{ scale: 0.95 }}
            animate={itemsPhase === 7 ? { scale: 0.95, backgroundColor: '#0d9488' } : {}}
          >
            {itemsPhase >= 8 ? "تم الإرسال بنجاح ✓" : "أرسل طلب الدين"}
            {itemsPhase === 7 && <motion.div className="absolute inset-0 bg-white/30" initial={{ x: '100%' }} animate={{ x: '-100%' }} transition={{ duration: 0.5 }} />}
          </motion.button>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {itemsPhase >= 8 && (
            <motion.div
              className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 bg-[#10B981] rounded-full text-white flex items-center justify-center text-5xl mb-6 shadow-xl shadow-green-500/20"
              >
                ✓
              </motion.div>
              <motion.h3 
                className="text-2xl font-bold text-gray-900 mb-2"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              >
                تم إرسال طلب الدين
              </motion.h3>
              <motion.p 
                className="text-gray-500 font-medium"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              >
                تم إشعار محمد بقيمة {toArabicNums(45)} ريال
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Caption text="Log a grocery debt in seconds" />
    </motion.div>
  );
}

// Local AnimatePresence for the overlay
import { AnimatePresence as AP } from 'framer-motion';
const AnimatePresence = AP;