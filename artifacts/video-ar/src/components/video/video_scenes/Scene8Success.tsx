import { motion } from 'framer-motion';

export const Scene8Success = () => {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#14B8A6]"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Celebration Confetti/Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full"
            initial={{ 
              x: '50vw', y: '50vh', scale: 0, opacity: 1 
            }}
            animate={{ 
              x: `${50 + (Math.random() * 80 - 40)}vw`, 
              y: `${50 + (Math.random() * 80 - 40)}vh`,
              scale: Math.random() * 2,
              opacity: 0
            }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />
        ))}
      </div>

      <motion.div 
        className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8 relative z-10"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
      >
        <motion.svg 
          viewBox="0 0 24 24" 
          className="w-20 h-20 text-[#14B8A6]" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <motion.path 
            d="M20 6L9 17l-5-5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        className="text-center text-white z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <h2 className="text-6xl font-bold font-display mb-4 drop-shadow-lg" style={{ fontFamily: 'var(--font-display)' }}>
          تم الدفع!
        </h2>
        <p className="text-3xl text-teal-100">شكراً محمد 🎉</p>
      </motion.div>

      {/* Connection Animation between Merchant and Customer */}
      <motion.div 
        className="mt-16 flex items-center gap-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div 
          className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl border border-white/40"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ delay: 2.2, type: "spring" }}
        >
          🧑‍💼
        </motion.div>
        
        <div className="relative w-40 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 right-0 bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 2.5, duration: 0.8 }}
          />
        </div>

        <motion.div 
          className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white text-2xl border border-[#0F172A]"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ delay: 2.2, type: "spring" }}
        >
          🏪
        </motion.div>
      </motion.div>
    </motion.div>
  );
};