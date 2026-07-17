import { motion } from 'framer-motion';
import { Caption, NearPayLogo } from './Shared';

export default function Scene0Hook() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center font-arabic"
      style={{ direction: 'rtl', background: 'linear-gradient(135deg, #0D1929 0%, #0B2341 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.15) 0%, rgba(13,25,41,0) 70%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <motion.div
        className="absolute top-8 right-8 z-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
      >
        <NearPayLogo className="w-12 h-12" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="absolute top-[20%] flex flex-col items-center z-20">
          <motion.h1
            className="text-white text-[40px] font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
          >
            هل تعبت من
          </motion.h1>
          <motion.h2
            className="text-[#2ED8C3] text-[52px] font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6, ease: "easeOut" }}
          >
            متابعة الديون؟
          </motion.h2>
        </div>

        <div className="relative mt-32 w-full flex justify-center items-center h-[200px]">
          {/* Card 1 (back-left) */}
          <motion.div
            className="absolute bg-[#F8FAFC] rounded-[16px] shadow-2xl w-[180px] h-[100px] p-3 flex flex-col justify-between"
            initial={{ opacity: 0, y: 100, rotate: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotate: -8, scale: 1, x: -100 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
            style={{ zIndex: 0 }}
          >
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B2341] to-[#143B63] flex items-center justify-center text-white font-bold text-sm">هـ</div>
                <span className="font-bold text-[#0B2341] text-sm">هديل</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
            </div>
            <div className="font-bold text-[#EF4444] text-lg text-left w-full" style={{ direction: 'ltr' }}>
              ٤٥ ريال
            </div>
          </motion.div>

          {/* Card 2 (middle) */}
          <motion.div
            className="absolute bg-white rounded-[16px] shadow-2xl w-[180px] h-[100px] p-3 flex flex-col justify-between z-10"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, rotate: 2, scale: 1.05, x: 0 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
            style={{ zIndex: 10 }}
          >
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B2341] to-[#143B63] flex items-center justify-center text-white font-bold text-sm">غ</div>
                <span className="font-bold text-[#0B2341] text-sm">غلا</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
            </div>
            <div className="font-bold text-[#EF4444] text-xl text-left w-full" style={{ direction: 'ltr' }}>
              ١٢٠ ريال
            </div>
          </motion.div>

          {/* Card 3 (front-right) */}
          <motion.div
            className="absolute bg-white rounded-[16px] shadow-2xl w-[180px] h-[100px] p-3 flex flex-col justify-between"
            initial={{ opacity: 0, y: 100, rotate: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 10, rotate: 6, scale: 1, x: 100 }}
            transition={{ delay: 1.1, type: 'spring', stiffness: 200, damping: 20 }}
            style={{ zIndex: 20 }}
          >
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B2341] to-[#143B63] flex items-center justify-center text-white font-bold text-sm">د</div>
                <span className="font-bold text-[#0B2341] text-sm">دالي</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
            </div>
            <div className="font-bold text-[#EF4444] text-lg text-left w-full" style={{ direction: 'ltr' }}>
              ٣٢ ريال
            </div>
          </motion.div>
        </div>
      </div>
      <Caption ar="هل تعبت من متابعة الديون؟" en="Tired of chasing unpaid debts?" />
    </motion.div>
  );
}
