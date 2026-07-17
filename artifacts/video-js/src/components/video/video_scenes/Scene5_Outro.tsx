import { motion } from 'framer-motion';

export function Scene5Outro() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'var(--color-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      {/* Background ripples */}
      <motion.div 
        className="absolute rounded-full border border-white/20"
        style={{ width: '80vw', height: '80vw' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="absolute rounded-full border border-white/10"
        style={{ width: '80vw', height: '80vw' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ delay: 1, duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-8"
          style={{ width: '8rem', height: '8rem', transform: 'rotate(3deg)' }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </motion.div>

        <motion.h1 
          className="font-bold text-white mb-6"
          style={{ fontFamily: 'var(--font-display)', fontSize: '7vw' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          NearPay
        </motion.h1>

        <motion.div 
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="text-2xl text-white/90 tracking-wide font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            Never lose track again.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
