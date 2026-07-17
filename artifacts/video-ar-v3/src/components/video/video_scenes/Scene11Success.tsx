import { motion } from 'framer-motion';
import { Caption } from './Shared';

export default function Scene11Success() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center font-arabic overflow-hidden"
      style={{ direction: 'rtl', background: 'linear-gradient(135deg, #2ED8C3 0%, #19B8D3 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

      {/* Confetti */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white"
          style={{
            top: '50%',
            left: '50%',
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            opacity: 0.6
          }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 600,
            y: (Math.random() - 0.5) * 600,
            scale: Math.random() * 1.5 + 0.5,
            rotate: Math.random() * 360,
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeOut",
            delay: 0.2
          }}
        />
      ))}

      <motion.div
        className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-white"
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <svg viewBox="0 0 50 50" fill="none" className="w-20 h-20">
          <motion.path
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          />
        </svg>
      </motion.div>

      <motion.h1
        className="text-white text-[42px] font-bold mb-4 drop-shadow-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
      >
        تم السداد بنجاح!
      </motion.h1>

      <motion.div
        className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white text-lg font-medium tracking-wide flex gap-3 items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
      >
        <span className="font-bold">هديل</span>
        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        <span className="font-bold">بقالة جدة</span>
        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        <span className="font-bold bg-white text-[#19B8D3] px-3 py-0.5 rounded-full" style={{ direction: 'ltr' }}>٤٥ ريال</span>
      </motion.div>

      {/* Sync Animation */}
      <motion.div 
        className="mt-12 flex items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
      >
        <div className="w-14 h-20 rounded-xl bg-white/20 border-2 border-white/50 flex items-center justify-center text-white">📱</div>
        <div className="flex gap-1 overflow-hidden w-24 relative justify-center items-center">
          <motion.div 
            className="w-full h-1 bg-white/50 rounded-full overflow-hidden"
          >
            <motion.div 
              className="h-full bg-white w-1/2 rounded-full"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
        <div className="w-14 h-20 rounded-xl bg-white/20 border-2 border-white/50 flex items-center justify-center text-white relative">
          📱
          <motion.div 
            className="absolute -top-3 -right-3 w-6 h-6 bg-[#22C55E] rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.5, type: 'spring' }}
          >
            ✓
          </motion.div>
        </div>
      </motion.div>

      <Caption ar="تم الدفع! يُخطر التاجر فوراً" en="Paid! Merchant notified instantly" />
    </motion.div>
  );
}
