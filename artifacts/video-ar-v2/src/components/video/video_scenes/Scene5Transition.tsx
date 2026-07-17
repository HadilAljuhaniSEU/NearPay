import { motion } from 'framer-motion';
import { Caption } from './Shared';

export function Scene5Transition() {
  return (
    <motion.div
      className="absolute inset-0 flex overflow-hidden bg-[#0F172A]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Right Side (Customer) fills in */}
      <motion.div 
        className="absolute top-0 right-0 bottom-0 bg-[#14B8A6] z-0"
        initial={{ width: '0vw' }}
        animate={{ width: '50vw' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/* Central Graphic */}
        <motion.div
          className="relative z-20 w-24 h-24"
          initial={{ x: '20vw', rotate: -15, scale: 0.8 }}
          animate={{ x: '-20vw', rotate: 0, scale: 1.2 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-white rounded-xl shadow-2xl flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="#14B8A6" strokeWidth="2"/>
              <path d="M2 10H22" stroke="#14B8A6" strokeWidth="2"/>
            </svg>
          </div>
          <motion.div 
            className="absolute inset-0 bg-white rounded-xl"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          className="absolute text-5xl font-black text-white text-center w-full z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-l from-white to-white drop-shadow-lg">
            ومن جهة العميل...
          </span>
        </motion.div>
      </div>

      <Caption text="Now, from the customer's side..." />
    </motion.div>
  );
}