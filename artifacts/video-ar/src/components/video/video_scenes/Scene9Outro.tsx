import { motion } from 'framer-motion';
import { Logo } from './Shared';

export const Scene9Outro = () => {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0F172A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Pulsing Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute border border-[#14B8A6]/30 rounded-full"
            style={{ width: `${i * 30}vw`, height: `${i * 30}vw` }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="bg-[#14B8A6] p-6 rounded-3xl shadow-[0_0_50px_rgba(20,184,166,0.4)] mb-8">
          <Logo className="w-24 h-24" color="white" />
        </div>
        
        <h1 className="text-7xl font-bold text-white mb-6 font-display tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          NearPay
        </h1>
        
        <motion.div 
          className="bg-white/10 px-8 py-4 rounded-full backdrop-blur-sm border border-white/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <p className="text-3xl text-[#38BDF8] font-bold">
            لا تخسر ريالاً واحداً
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};