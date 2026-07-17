import { motion } from 'framer-motion';
import { Caption } from './Shared';

export function Scene11Success() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#14B8A6]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Burst */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial="hidden" animate="visible"
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white opacity-80 rounded-sm"
            variants={{
              hidden: { x: 0, y: 0, scale: 0, rotate: 0 },
              visible: { 
                x: Math.cos(i * 30 * Math.PI / 180) * 200, 
                y: Math.sin(i * 30 * Math.PI / 180) * 200,
                scale: [0, 1, 0],
                rotate: 180
              }
            }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        ))}
      </motion.div>

      {/* Checkmark */}
      <div className="relative mb-8">
        <motion.div 
          className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <svg className="w-16 h-16 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
            <motion.path 
              strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
        {/* Ripple */}
        <motion.div 
          className="absolute inset-0 border-4 border-white rounded-full"
          initial={{ scale: 1, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ delay: 0.3, duration: 1 }}
        />
      </div>

      <motion.h1 
        className="text-4xl md:text-5xl font-black text-white mb-12 drop-shadow-lg"
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
      >
        تم الدفع بنجاح!
      </motion.h1>

      {/* Dual Phones Confirmation */}
      <div className="flex items-center gap-6">
        {/* Customer Phone */}
        <motion.div 
          className="w-16 h-24 bg-white/20 backdrop-blur border-2 border-white rounded-xl shadow-lg flex flex-col items-center justify-center"
          initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }}
        >
          <div className="w-6 h-6 bg-white rounded-full text-[#14B8A6] flex items-center justify-center font-bold text-xs">✓</div>
        </motion.div>

        {/* Arrow */}
        <motion.div 
          className="text-white text-3xl font-bold"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5 }}
        >
          ←
        </motion.div>

        {/* Merchant Phone */}
        <motion.div 
          className="w-16 h-24 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center relative border-4 border-white"
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 }}
        >
          <div className="text-2xl">🏪</div>
          {/* Notification Badge */}
          <motion.div 
            className="absolute -top-3 -right-3 w-8 h-8 bg-[#EF4444] text-white rounded-full font-bold flex items-center justify-center border-2 border-white shadow-md text-sm"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring", bounce: 0.6 }}
          >
            ١
          </motion.div>
        </motion.div>
      </div>

      <Caption text="Paid! Merchant notified instantly" />
    </motion.div>
  );
}