import { motion } from 'framer-motion';
import { Caption, LogoCard } from './Shared';

export function Scene12Outro() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Concentric Rings */}
      <motion.div 
        className="absolute w-64 h-64 border border-[#14B8A6]/30 rounded-full"
        initial={{ scale: 0, opacity: 1 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute w-64 h-64 border border-[#14B8A6]/20 rounded-full"
        initial={{ scale: 0, opacity: 1 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1.3 }}
      />
      <motion.div 
        className="absolute w-64 h-64 border border-[#14B8A6]/10 rounded-full"
        initial={{ scale: 0, opacity: 1 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2.6 }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
        >
          <LogoCard className="w-24 h-24 mb-6 shadow-[0_0_50px_rgba(20,184,166,0.3)]" />
        </motion.div>

        <motion.h1
          className="text-6xl font-black text-white mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          dir="ltr"
        >
          NearPay
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-[#14B8A6] to-[#38BDF8] mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          لا تخسر ريالاً واحداً
        </motion.h2>

        <motion.div
          className="text-gray-500 font-medium text-sm tracking-wide bg-white/5 px-4 py-2 rounded-full border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          متاح للتاجر والعميل
        </motion.div>
      </div>

      <Caption text="NearPay — Never lose a Riyal again" />
    </motion.div>
  );
}