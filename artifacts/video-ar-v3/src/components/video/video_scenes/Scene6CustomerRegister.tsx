import { motion } from 'framer-motion';
import { Caption, NearPayLogo, PhoneFrame } from './Shared';
import { useState, useEffect } from 'react';

export default function Scene6CustomerRegister() {
  const [mapRevealed, setMapRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMapRevealed(true), 3000);
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
        <div className="flex flex-col h-full bg-white relative">
          {/* Main Form Content */}
          <motion.div 
            className="p-8 flex flex-col items-center flex-1 z-10 bg-white w-full"
            animate={mapRevealed ? { y: -200, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <NearPayLogo className="w-16 h-16 mb-6" />
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-bold text-[#0B2341] mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              مرحباً في NearPay!
            </motion.h1>

            <div className="w-full space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="h-14 border border-[#E2E8F0] rounded-xl flex items-center px-4 bg-white">
                  <span className="font-bold text-[#0B2341]">هديل المطيري</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="h-14 border border-[#E2E8F0] rounded-xl flex items-center px-4 bg-white" style={{ direction: 'ltr' }}>
                  <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    className="font-medium text-[#0B2341]"
                  >
                    +966 50 XXX XXXX
                  </motion.span>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="w-full mt-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col items-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-[#2ED8C3]/10 flex items-center justify-center text-2xl">
                📍
              </div>
              <div className="text-center">
                <h3 className="font-bold text-[#0B2341] mb-1">نحتاج إذن الموقع</h3>
                <p className="text-xs text-[#64748B]">لعرض المحلات القريبة منك</p>
              </div>
              <motion.button 
                className="w-full h-12 rounded-xl bg-[#2ED8C3] text-white font-bold"
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 0.98, 1] }}
                transition={{ delay: 2.5, duration: 0.2 }}
              >
                السماح بالموقع
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Map Reveal State */}
          {mapRevealed && (
            <motion.div 
              className="absolute inset-0 z-0 bg-[#E8F0F6] flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Abstract Map Grid */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.5
              }} />

              {/* Pulsing ring */}
              <motion.div
                className="absolute w-[300px] h-[300px] rounded-full border border-[#2ED8C3] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />

              <motion.div 
                className="relative z-10"
                initial={{ y: -50, scale: 0 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="w-10 h-10 bg-[#0B2341] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#2ED8C3] rounded-full" />
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-10 bg-white px-6 py-3 rounded-full shadow-lg font-bold text-[#0B2341] flex items-center gap-2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span>اكتشفي المحلات القريبة منك</span>
                <span>←</span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </PhoneFrame>
      <Caption text="Sign up and explore nearby stores" />
    </motion.div>
  );
}
