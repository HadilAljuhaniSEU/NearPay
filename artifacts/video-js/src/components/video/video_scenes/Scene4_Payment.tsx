import { motion } from 'framer-motion';

export function Scene4Payment() {
  return (
    <motion.div
      className="absolute inset-0 flex"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-1/2 h-full flex items-center justify-center">
        {/* Customer Phone UI */}
        <motion.div 
          className="bg-white rounded-[40px] shadow-2xl p-6 relative overflow-hidden"
          style={{ width: '320px', height: '650px', border: '8px solid var(--color-secondary)' }}
          initial={{ y: '100%', rotate: -10 }}
          animate={{ y: 0, rotate: 2 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="w-1/3 h-1 bg-gray-300 rounded-full mx-auto mb-6 absolute top-4 left-1/2 -translate-x-1/2"></div>
          
          <div className="mt-8 mb-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-secondary)' }}>Local Beans</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Owed for Coffee & Pastries</p>
          </div>

          <motion.div 
            className="w-full flex flex-col items-center my-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
          >
            <div className="text-5xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-secondary)' }}>$45.00</div>
          </motion.div>

          <div className="space-y-3">
            <motion.div 
              className="w-full text-white p-4 rounded-xl font-bold text-center relative overflow-hidden"
              style={{ background: 'var(--color-primary)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              Pay Full Amount
              
              {/* Click ripple effect */}
              <motion.div 
                className="absolute rounded-full pointer-events-none"
                style={{ width: '5rem', height: '5rem', background: 'rgba(255,255,255,0.3)', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 3], opacity: [0.5, 0] }}
                transition={{ delay: 3.5, duration: 0.6 }}
              />
            </motion.div>

            <motion.div 
              className="w-full p-4 rounded-xl font-bold text-center border"
              style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--color-primary)', borderColor: 'rgba(20,184,166,0.2)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              Pay Half ($22.50)
            </motion.div>
            
            <motion.div 
              className="w-full bg-gray-50 p-4 rounded-xl font-bold text-center border border-gray-100"
              style={{ color: 'var(--color-secondary)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
            >
              Custom Amount
            </motion.div>
          </div>

          {/* Success State Overlay */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            style={{ background: 'var(--color-primary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.0, duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 4.3, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
            <motion.h4 
              className="font-bold text-3xl text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.5 }}
            >
              Paid!
            </motion.h4>
            <motion.p 
              className="text-white/80"
              style={{ fontFamily: 'var(--font-body)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.6 }}
            >
              Tab settled with Local Beans
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      <div className="w-1/2 h-full flex flex-col justify-center pr-20">
        <motion.h2 
          className="text-6xl font-bold text-white mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Settle up in <br/>
          <span style={{ color: 'var(--color-primary)' }}>one tap.</span>
        </motion.h2>
        <motion.div 
          className="flex flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {['Frictionless payments', 'Partial or full amounts', 'Instant merchant sync'].map((text, i) => (
            <motion.div
              key={text}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + i * 0.2 }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }}></div>
              <p className="text-xl" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
