import { motion } from 'framer-motion';

export function Scene3CustomerMap() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ background: '#0F172A' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Map Background Pattern (Abstract) */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M0 200 Q 300 150 400 400 T 800 500 T 1200 300" fill="none" stroke="white" strokeWidth="10" />
          <path d="M200 0 L 300 800" fill="none" stroke="white" strokeWidth="8" />
        </svg>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div className="relative z-10 flex flex-col items-center mb-24">
          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            They get pinged<br/>when <span style={{ color: 'var(--color-accent)' }}>they're close.</span>
          </motion.h2>
        </motion.div>

        {/* Map UI Elements */}
        <div className="relative w-full max-w-4xl" style={{ height: '40vh' }}>
          
          {/* Customer Location Pin */}
          <motion.div
            className="absolute flex flex-col items-center"
            style={{ left: '25%', top: '50%' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="w-6 h-6 rounded-full border-4 z-10" style={{ background: 'var(--color-accent)', borderColor: '#0F172A' }}></div>
            {/* Pulsing ring */}
            <motion.div 
              className="absolute rounded-full"
              style={{ width: '6rem', height: '6rem', background: 'rgba(56,189,248,0.3)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              animate={{ scale: [1, 2], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Merchant Location Pin */}
          <motion.div
            className="absolute flex flex-col items-center"
            style={{ left: '75%', top: '33%' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center z-10 border-2" style={{ borderColor: 'var(--color-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="bg-white px-3 py-1 rounded-full text-xs font-bold mt-2 shadow-lg z-10" style={{ color: 'var(--color-secondary)' }}>Local Beans</div>
          </motion.div>

          {/* Path between them */}
          <motion.svg 
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.path 
              d="M 25% 50% Q 50% 60% 75% 33%"
              fill="none" 
              stroke="var(--color-accent)" 
              strokeWidth="3" 
              strokeDasharray="8 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2.2, duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.svg>

          {/* Push Notification Popup */}
          <motion.div
            className="absolute backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex gap-4 z-30"
            style={{ top: '60%', left: '50%', transform: 'translateX(-50%)', width: '340px', background: 'rgba(255,255,255,0.1)' }}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 3.2, type: 'spring', stiffness: 150, damping: 15 }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <path d="M2 10h20"></path>
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-sm" style={{ fontFamily: 'var(--font-body)' }}>NearPay</div>
              <div className="font-bold text-white mt-1" style={{ fontFamily: 'var(--font-display)' }}>You're near Local Beans!</div>
              <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>Settle your $45.00 tab in one tap.</div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
