import { motion } from 'framer-motion';
import { Caption, NearPayLogo } from './Shared';

export default function Scene5Transition() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center font-arabic overflow-hidden"
      style={{ direction: 'rtl', background: '#0D1929' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 flex w-full h-full">
        {/* Left Half: Merchant (Fades to Navy) */}
        <motion.div 
          className="w-1/2 h-full bg-white flex items-center justify-center relative overflow-hidden"
          animate={{ backgroundColor: '#0B2341' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <motion.div 
            className="text-[#0B2341] text-6xl font-bold opacity-10 absolute"
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            التاجر
          </motion.div>
        </motion.div>

        {/* Right Half: Customer (Reveals Teal) */}
        <motion.div 
          className="w-1/2 h-full bg-white flex items-center justify-center relative overflow-hidden"
          animate={{ backgroundColor: '#2ED8C3' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <motion.div 
            className="text-[#0B2341] text-6xl font-bold opacity-10 absolute"
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            العميل
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [0, 1.5, 1], rotate: 0, x: [0, 0, 150] }}
        transition={{ duration: 2, times: [0, 0.6, 1], ease: "easeInOut" }}
      >
        <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[14%] bg-gradient-to-br from-[#0B2341] to-[#143B63] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
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
      </motion.div>

      <motion.h2
        className="absolute z-10 text-white text-5xl font-bold tracking-wide mix-blend-overlay"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        ومن جهة العميل...
      </motion.h2>

      <Caption text="Now, from the customer's side..." />
    </motion.div>
  );
}
