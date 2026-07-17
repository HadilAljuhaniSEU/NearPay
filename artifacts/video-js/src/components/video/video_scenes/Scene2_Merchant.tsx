import { motion } from 'framer-motion';

export function Scene2Merchant() {
  return (
    <motion.div
      className="absolute inset-0 flex"
      initial={{ opacity: 0, x: '20vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-1/2 h-full flex flex-col justify-center px-20">
        <motion.h2 
          className="text-6xl font-bold text-white mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Add tabs in <br/>seconds.
        </motion.h2>
        <motion.p 
          className="text-2xl"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Track who owes what.<br/>Never lose a dollar again.
        </motion.p>
      </div>
      
      <div className="w-1/2 h-full flex items-center justify-center">
        {/* Merchant Phone UI */}
        <motion.div 
          className="bg-white rounded-[40px] shadow-2xl p-6 relative overflow-hidden"
          style={{ width: '320px', height: '650px', border: '8px solid var(--color-secondary)' }}
          initial={{ y: '100%', rotate: 10 }}
          animate={{ y: 0, rotate: -2 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="w-1/3 h-1 bg-gray-300 rounded-full mx-auto mb-8 absolute top-4 left-1/2 -translate-x-1/2"></div>
          
          <div className="mt-8 mb-6">
            <h3 className="font-bold text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-secondary)' }}>New Debt</h3>
          </div>

          <div className="space-y-4">
            <motion.div 
              className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--color-accent)' }}>A</div>
              <div>
                <div className="font-bold" style={{ color: 'var(--color-secondary)' }}>Alex Johnson</div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Customer</div>
              </div>
            </motion.div>

            <motion.div 
              className="w-full p-4 rounded-xl border"
              style={{ background: 'rgba(20,184,166,0.1)', borderColor: 'rgba(20,184,166,0.3)' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
            >
              <div className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--color-primary)' }}>Amount</div>
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-secondary)' }}>$45.00</div>
            </motion.div>

            <motion.div 
              className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2 }}
            >
              <div className="text-sm" style={{ color: 'var(--color-secondary)' }}>Coffee & Pastries for the team</div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute bottom-8 left-6 right-6 text-white py-4 rounded-2xl text-center font-bold text-lg shadow-lg"
            style={{ background: 'var(--color-primary)' }}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 2.6, type: 'spring', stiffness: 200, damping: 20 }}
          >
            Create Tab
          </motion.div>

          {/* Success Overlay */}
          <motion.div
            className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            style={{ background: 'rgba(255,255,255,0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.8, duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 4.0, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg"
              style={{ background: 'var(--color-success)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
            <h4 className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-secondary)' }}>Tab Created</h4>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
