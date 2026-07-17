import { motion } from 'framer-motion';

export function Scene0Problem() {
  const IOUs = [
    { name: 'Alex', amount: '$45', x: '10vw', y: '15vh', yFloat: '13vh', delay: 0.2, rotate: -10 },
    { name: 'Sarah', amount: '$120', x: '70vw', y: '20vh', yFloat: '18vh', delay: 0.5, rotate: 15 },
    { name: 'Mike', amount: '$15', x: '20vw', y: '65vh', yFloat: '63vh', delay: 0.8, rotate: -5 },
    { name: 'Emma', amount: '$60', x: '75vw', y: '60vh', yFloat: '58vh', delay: 1.1, rotate: 8 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Floating IOU Slips */}
      {IOUs.map((iou, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center min-w-[140px]"
          initial={{ opacity: 0, scale: 0.5, x: '50vw', y: '50vh', rotate: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            x: iou.x, 
            rotate: iou.rotate,
            y: [iou.y, iou.yFloat, iou.y]
          }}
          transition={{ 
            duration: 1.5, 
            delay: iou.delay,
            ease: [0.16, 1, 0.3, 1],
            y: {
              duration: 4,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: iou.delay + 1.5
            }
          }}
        >
          <div className="w-12 h-12 bg-primary rounded-full mb-3 flex items-center justify-center text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
            {iou.name.charAt(0)}
          </div>
          <p className="text-white/70 text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>{iou.name} owes</p>
          <p className="text-error font-bold text-2xl" style={{ fontFamily: 'var(--font-display)' }}>{iou.amount}</p>
        </motion.div>
      ))}

      {/* Main Copy */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center mb-8"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        </motion.div>
        
        <div className="overflow-hidden">
          <motion.h1 
            className="text-6xl md:text-8xl text-white font-bold tracking-tight text-center"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 1.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Losing track<br/>of <span style={{ color: 'var(--color-error)' }}>who owes you?</span>
          </motion.h1>
        </div>
      </div>
    </motion.div>
  );
}
