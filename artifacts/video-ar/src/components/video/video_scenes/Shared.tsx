import { motion } from 'framer-motion';

export const Logo = ({ className = "w-16 h-16", color = "currentColor" }: { className?: string, color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
    <path d="M2 10h20"></path>
  </svg>
);

export const PhoneMockup = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-[8px] border-[#0F172A] overflow-hidden w-[320px] h-[650px] flex flex-col ${className}`}>
    <div className="absolute top-0 inset-x-0 h-6 bg-[#0F172A] rounded-b-3xl w-32 mx-auto z-50"></div>
    {children}
  </div>
);

export const FloatingReceipt = ({ delay, x, y, rotate }: { delay: number, x: number | string, y: number | string, rotate: number }) => (
  <motion.div
    className="absolute bg-white text-slate-300 p-2 rounded shadow-lg w-20 flex flex-col gap-1"
    initial={{ opacity: 0, scale: 0.5, x, y: y as number + 100, rotate: rotate - 20 }}
    animate={{ opacity: [0, 0.8, 0], scale: 1, y: y as number - 300, x: (x as number) + (Math.random() * 50 - 25), rotate: rotate + (Math.random() * 40 - 20) }}
    transition={{ duration: 3, delay, ease: "linear", repeat: Infinity }}
  >
    <div className="h-2 bg-slate-200 rounded w-full"></div>
    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
    <div className="h-2 bg-slate-100 rounded w-1/2"></div>
    <div className="h-2 bg-slate-100 rounded w-full mt-2"></div>
  </motion.div>
);
