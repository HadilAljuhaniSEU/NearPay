import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Caption, NearPayLogo, PhoneFrame } from './Shared';
import { sfx } from '@/lib/sfx';

export default function Scene1MerchantRegister() {
  useEffect(() => {
    const t1 = setTimeout(() => sfx.tap(), 1200);
    const t2 = setTimeout(() => sfx.add(), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
      <motion.div
        initial={{ y: 50, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        style={{ perspective: 1000 }}
      >
        <PhoneFrame>
          <div className="w-full h-14 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] flex items-center px-6 sticky top-0 z-10">
            <NearPayLogo className="w-9 h-9 ml-3" />
            <div>
              <h1 className="text-[20px] font-bold text-[#0B2341]">تسجيل نشاطك التجاري</h1>
            </div>
          </div>
          
          <div className="p-6 flex flex-col gap-6 pt-8 relative flex-1">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-2"
            >
              <label className="text-sm font-bold text-[#0B2341]">اسم النشاط</label>
              <div className="h-12 border border-[#E2E8F0] rounded-xl flex items-center px-4 bg-white relative">
                <span className="text-lg">🏪</span>
                <span className="mr-3 font-medium text-[#0B2341]">بقالة جدة</span>
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
                  className="absolute left-4 text-[#22C55E]"
                >
                  ✓
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col gap-2"
            >
              <label className="text-sm font-bold text-[#0B2341]">نوع النشاط</label>
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-full bg-[#2ED8C3] text-white font-medium text-sm">بقالة ✓</div>
                <div className="px-4 py-2 rounded-full border border-[#E2E8F0] text-[#64748B] font-medium text-sm">مطعم</div>
                <div className="px-4 py-2 rounded-full border border-[#E2E8F0] text-[#64748B] font-medium text-sm">صيدلية</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex flex-col gap-2"
            >
              <label className="text-sm font-bold text-[#0B2341]">رقم الجوال</label>
              <div className="h-12 border border-[#E2E8F0] rounded-xl flex items-center px-4 bg-white" style={{ direction: 'ltr' }}>
                <span className="text-lg mr-2">📞</span>
                <motion.span 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
                  className="font-medium text-[#0B2341]"
                >
                  +966 55 XXX XXXX
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.6 }}
              className="flex flex-col gap-2"
            >
              <label className="text-sm font-bold text-[#0B2341]">الموقع</label>
              <div className="h-12 border border-[#E2E8F0] rounded-xl flex items-center px-4 bg-[#F8FAFC]">
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-lg"
                >
                  📍
                </motion.span>
                <span className="mr-3 font-medium text-[#0B2341]">جدة، حي الروضة</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="p-6 border-t border-[#E2E8F0]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            <motion.div 
              className="h-12 w-full rounded-xl bg-gradient-to-r from-[#2ED8C3] to-[#19B8D3] text-white font-bold text-lg flex items-center justify-center relative overflow-hidden"
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 0.98, 1] }}
              transition={{ delay: 4, duration: 0.3 }}
            >
              <span className="z-10">سجّل الآن</span>
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 4, duration: 0.4 }}
              />
            </motion.div>
          </motion.div>

          {/* Success Toast */}
          <motion.div
            className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#22C55E] text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 z-50"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 4.5, type: 'spring' }}
          >
            <span>✓</span>
            <span>تم التسجيل!</span>
          </motion.div>
        </PhoneFrame>
      </motion.div>
      <Caption ar="سجّل نشاطك التجاري في ثوانٍ" en="Register your business in seconds" />
    </motion.div>
  );
}
