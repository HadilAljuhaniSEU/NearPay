import { motion } from 'framer-motion';
import { Caption, NearPayLogo, PhoneFrame } from './Shared';
import { useState, useEffect } from 'react';

export default function Scene8ContactOptions() {
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTapped(true), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center font-arabic"
      style={{ direction: 'rtl', background: '#F6F9FC' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8 }}
    >
      <PhoneFrame>
        <div className="w-full h-full bg-[#0D1929] relative overflow-hidden flex flex-col justify-end">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=600')] bg-cover bg-center" />
          
          <motion.div 
            className="w-full bg-white rounded-t-[32px] p-6 relative z-10 flex flex-col items-center pb-12"
            initial={{ y: 400 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="w-12 h-1.5 bg-[#E2E8F0] rounded-full mb-6" />
            
            <NearPayLogo className="w-12 h-12 mb-3 shadow-md" />
            <h2 className="text-2xl font-bold text-[#0B2341] mb-2">بقالة جدة</h2>
            <div className="px-3 py-1 rounded-full bg-[#2ED8C3]/10 text-[#2ED8C3] text-xs font-bold mb-8 border border-[#2ED8C3]/20">بقالة</div>
            
            <motion.h3 
              className="text-[#0B2341] font-bold mb-6 text-lg w-full text-right"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              تواصل بالطريقة اللي تناسبك
            </motion.h3>

            <div className="w-full space-y-3 relative">
              {/* WhatsApp Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, type: 'spring' }}
                className="w-full h-16 rounded-xl bg-[#25D366]/10 border border-[#25D366] flex items-center px-4 relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xl ml-3">
                  💬
                </div>
                <span className="font-bold text-[#25D366] text-lg">راسل على واتساب</span>
                
                {/* Tap Ripple */}
                <motion.div
                  className="absolute w-12 h-12 bg-[#25D366]/30 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={tapped ? { scale: 10, opacity: [0.8, 0] } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>

              {/* Call Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, type: 'spring' }}
                className="w-full h-16 rounded-xl border border-[#E2E8F0] flex items-center px-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#2ED8C3]/10 flex items-center justify-center text-xl ml-3">
                  📞
                </div>
                <span className="font-bold text-[#0B2341] text-lg">اتصل بالتاجر</span>
              </motion.div>

              {/* Map Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, type: 'spring' }}
                className="w-full h-16 rounded-xl border border-[#E2E8F0] flex items-center px-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#0B2341]/10 flex items-center justify-center text-xl ml-3">
                  📍
                </div>
                <span className="font-bold text-[#0B2341] text-lg">افتح الموقع</span>
              </motion.div>

              {/* Mock WhatsApp Bubble */}
              <motion.div
                className="absolute top-12 left-0 right-4 bg-[#E7FFDB] rounded-2xl rounded-tr-sm p-3 shadow-lg z-20"
                initial={{ opacity: 0, scale: 0.8, x: -50, y: 20 }}
                animate={tapped ? { opacity: 1, scale: 1, x: 0, y: 0 } : { opacity: 0, scale: 0.8, x: -50, y: 20 }}
                transition={{ delay: 3.8, type: 'spring', bounce: 0.6 }}
              >
                <p className="text-[#111B21] font-medium text-sm">
                  السلام عليكم، عندي دين ٤٥ ريال من بقالتكم اليوم العصر ومحتاجة أسدده.
                </p>
                <span className="text-[10px] text-[#667781] block mt-1 text-left" style={{ direction: 'ltr' }}>10:42 AM ✓✓</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </PhoneFrame>
      <Caption ar="واتساب أو اتصال أو موقع — بنقرة واحدة" en="WhatsApp, call, or directions — one tap" />
    </motion.div>
  );
}
