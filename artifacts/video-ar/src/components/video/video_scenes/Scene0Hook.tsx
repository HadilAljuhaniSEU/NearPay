import { motion } from 'framer-motion';
import { FloatingReceipt } from './Shared';

export const Scene0Hook = () => {
  // Generate random receipts
  const receipts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 2,
    x: Math.random() * 80 + 10 + 'vw',
    y: '80vh',
    rotate: Math.random() * 60 - 30,
  }));

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {receipts.map((r) => (
          <FloatingReceipt key={r.id} delay={r.delay} x={r.x} y={r.y} rotate={r.rotate} />
        ))}
      </div>
      
      <motion.div
        className="relative z-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 100 }}
      >
        <h1 className="text-6xl font-black text-white leading-tight font-display drop-shadow-2xl" style={{ fontFamily: 'var(--font-display)' }}>
          هل تعبت من<br />
          <span className="text-[#EF4444]">متابعة الذمم؟</span>
        </h1>
        <motion.p 
          className="text-2xl text-slate-300 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          الدفاتر تضيع.. والورق يكثر..
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
