import { motion } from 'framer-motion';

export function Caption({ text }: { text: string }) {
  return (
    <motion.div
      className="absolute bottom-14 left-1/2 z-50"
      style={{ transform: 'translateX(-50%)', direction: 'ltr' }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div
        className="px-5 py-2 rounded-full text-white text-sm font-medium tracking-wide whitespace-nowrap shadow-lg"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
      >
        {text}
      </div>
    </motion.div>
  );
}

export const LogoCard = ({ className = "" }: { className?: string }) => (
  <div className={`w-12 h-12 bg-[#14B8A6] rounded-xl flex items-center justify-center shadow-lg ${className}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="2"/>
      <path d="M2 10H22" stroke="white" strokeWidth="2"/>
    </svg>
  </div>
);