import { motion } from 'framer-motion';

export const Scene4Transition = () => {
  return (
    <motion.div 
      className="absolute inset-0 z-20 flex"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Merchant Side (Right in RTL) */}
      <motion.div 
        className="w-1/2 h-full bg-[#0F172A] flex items-center justify-center"
        initial={{ x: '0%' }}
        animate={{ x: '100%', opacity: 0 }}
        transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
      >
        <motion.h2 
          className="text-6xl font-bold text-white font-display"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          التاجر
        </motion.h2>
      </motion.div>

      {/* Customer Side (Left in RTL) */}
      <motion.div 
        className="w-1/2 h-full bg-[#14B8A6] flex items-center justify-center relative overflow-hidden"
        initial={{ x: '0%' }}
        animate={{ width: '100%', x: '50%' }}
        transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
      >
        {/* Swoosh effect */}
        <motion.div 
          className="absolute inset-0 bg-white opacity-20 transform -skew-x-12"
          initial={{ x: '-150%' }}
          animate={{ x: '150%' }}
          transition={{ delay: 1.8, duration: 0.8 }}
        />
        
        <motion.h2 
          className="text-6xl font-bold text-white font-display relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          العميل
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};