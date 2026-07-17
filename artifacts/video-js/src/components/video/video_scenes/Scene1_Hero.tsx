import { motion } from 'framer-motion';

export function Scene1Hero() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-20vw' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background flare */}
      <motion.div 
        className="absolute rounded-full blur-[100px]"
        style={{ width: '60vw', height: '60vw', background: 'var(--color-primary)', opacity: 0.2 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 20 }}
          className="mb-6 flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>NearPay</span>
        </motion.div>

        <motion.h2
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          The smart way to <br/>
          <span style={{ color: 'var(--color-primary)' }}>manage tabs</span>
        </motion.h2>

        {/* Abstract UI Elements */}
        <motion.div 
          className="mt-12 relative bg-white rounded-t-3xl shadow-2xl border-t border-x border-white/20 overflow-hidden"
          style={{ width: '80vw', maxWidth: '64rem', height: '40vh' }}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '20%', opacity: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 80, damping: 20 }}
        >
          {/* Mock Dashboard Header */}
          <div className="w-full h-16 border-b border-gray-100 flex items-center px-8 justify-between">
            <div className="w-32 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="p-8 flex gap-8">
            <div className="flex-1 space-y-4">
              <motion.div 
                className="w-full h-32 rounded-2xl border flex flex-col justify-center px-8"
                style={{ background: 'rgba(20,184,166,0.1)', borderColor: 'rgba(20,184,166,0.2)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.6, ease: 'circOut' }}
              >
                <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-primary)' }}>Total Outstanding</div>
                <div className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-secondary)' }}>$1,240.00</div>
              </motion.div>
              <div className="w-full h-16 bg-gray-50 rounded-xl"></div>
              <div className="w-full h-16 bg-gray-50 rounded-xl"></div>
            </div>
            <div className="w-1/3 bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col justify-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(20,184,166,0.2)' }}>
                <div className="w-16 h-16 rounded-full" style={{ background: 'var(--color-primary)' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
