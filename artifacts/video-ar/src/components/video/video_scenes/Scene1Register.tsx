import { motion } from 'framer-motion';
import { Logo } from './Shared';

export const Scene1Register = () => {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center flex flex-col items-center">
        <motion.div
          className="bg-[#14B8A6] p-6 rounded-3xl shadow-2xl mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1, type: "spring", bounce: 0.5 }}
        >
          <Logo className="w-24 h-24" color="white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h1 className="text-7xl font-bold text-[#0F172A] mb-4 font-display" style={{ fontFamily: 'var(--font-display)' }}>
            NearPay
          </h1>
          <h2 className="text-4xl text-[#64748B] font-semibold">
            سجّل نشاطك التجاري في ثوانٍ
          </h2>
        </motion.div>
        
        <motion.div 
          className="mt-12 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="h-3 w-3 bg-[#14B8A6] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-3 bg-[#14B8A6] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-3 bg-[#14B8A6] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </motion.div>
      </div>
    </motion.div>
  );
};
