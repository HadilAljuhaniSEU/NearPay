import { motion } from 'framer-motion';
import { Caption, NearPayLogo } from './Shared';

export default function Scene12Outro() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center font-arabic overflow-hidden"
      style={{ direction: 'rtl', background: '#0D1929' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2ED8C3]"
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: i * 300, height: i * 300, opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.6, duration: 1 }}
        >
          <NearPayLogo className="w-20 h-20 shadow-[0_0_40px_rgba(46,216,195,0.4)]" />
        </motion.div>

        <motion.h1
          className="text-white text-5xl font-[800] mt-6 tracking-wide"
          style={{ fontFamily: 'Inter, sans-serif', direction: 'ltr' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          NearPay
        </motion.h1>

        <motion.h2
          className="text-4xl font-bold mt-4"
          style={{
            background: 'linear-gradient(135deg, #2ED8C3 0%, #19B8D3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          لا تخسر ريالاً واحداً
        </motion.h2>

        <motion.p
          className="text-white/60 text-lg mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          للتاجر والعميل
        </motion.p>
      </div>

      <Caption ar="NearPay — لا تضيع ريالاً بعد الآن" en="Never lose a Riyal again" />
    </motion.div>
  );
}
