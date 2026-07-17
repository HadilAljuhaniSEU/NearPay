import { motion } from 'framer-motion';

export function Caption({ text }: { text: string }) {
  return (
    <motion.div
      className="absolute bottom-14 left-1/2 z-50"
      style={{ transform: 'translateX(-50%)', direction: 'ltr' }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div
        className="px-5 py-2 rounded-full text-white text-sm font-medium tracking-wide whitespace-nowrap"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', fontFamily: 'Inter, sans-serif' }}
      >
        {text}
      </div>
    </motion.div>
  );
}

export const NearPayLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`flex items-center justify-center rounded-[14%] bg-gradient-to-br from-[#0B2341] to-[#143B63] shadow-[0_8px_32px_rgba(46,216,195,0.25)] ${className}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-[70%] h-[70%]">
      <path
        d="M16 1.5C9.1 1.5 3.5 7.1 3.5 14C3.5 19.8 7.2 24.7 12.4 26.7L16 30.5L19.6 26.7C24.8 24.7 28.5 19.8 28.5 14C28.5 7.1 22.9 1.5 16 1.5Z"
        fill="#0B2341"
      />
      <path
        d="M11 19.5V11L16 17.5L21 11V19.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const PhoneFrame = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative bg-white w-[360px] h-[680px] rounded-[32px] overflow-hidden shadow-[0_24px_80px_rgba(11,35,65,0.25)] flex flex-col scale-[0.8] origin-center ${className}`}>
    {children}
  </div>
);
