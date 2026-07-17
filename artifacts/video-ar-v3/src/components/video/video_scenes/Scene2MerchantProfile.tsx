import { motion } from 'framer-motion';
import { Caption, NearPayLogo, PhoneFrame } from './Shared';

export default function Scene2MerchantProfile() {
  return (
    <motion.div
      className="absolute inset-0 flex font-arabic bg-white overflow-hidden"
      style={{ direction: 'rtl' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Split Left: Phone */}
      <div className="w-1/2 h-full flex items-center justify-center relative z-10 bg-white">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <PhoneFrame className="border border-[#E2E8F0]">
            <div className="w-full h-full bg-[#0D1929] relative">
              <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=600')] bg-cover bg-center" />
              
              {/* Bottom Sheet */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] p-6 flex flex-col items-center"
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: 'spring', damping: 20 }}
              >
                <div className="w-12 h-1 bg-[#E2E8F0] rounded-full mb-6" />
                
                <NearPayLogo className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-[#0B2341] mb-2">بقالة جدة</h2>
                <div className="px-3 py-1 rounded-full bg-[#2ED8C3]/10 text-[#2ED8C3] text-sm font-bold mb-4">بقالة</div>
                
                <div className="w-full bg-[#F8FAFC] rounded-2xl p-4 flex items-center justify-center gap-2 mb-6">
                  <span className="text-xl">⭐</span>
                  <span className="text-xl font-bold text-[#0B2341]">4.8</span>
                  <span className="text-[#64748B] text-sm">(120 تقييم)</span>
                </div>

                <div className="w-full grid grid-cols-3 gap-3">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.0 }} className="h-16 rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center gap-1">
                    <span className="text-[#0B2341] text-lg">📞</span>
                    <span className="text-[11px] font-bold text-[#0B2341]">اتصال</span>
                  </motion.div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }} className="h-16 rounded-xl border border-[#25D366] bg-[#25D366]/5 flex flex-col items-center justify-center gap-1">
                    <span className="text-[#25D366] text-lg">💬</span>
                    <span className="text-[11px] font-bold text-[#25D366]">واتساب</span>
                  </motion.div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }} className="h-16 rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center gap-1">
                    <span className="text-[#0B2341] text-lg">📍</span>
                    <span className="text-[11px] font-bold text-[#0B2341]">الموقع</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </PhoneFrame>
        </motion.div>
      </div>

      {/* Split Right: Map */}
      <div className="w-1/2 h-full bg-[#E8F0F6] relative overflow-hidden flex items-center justify-center border-r border-[#E2E8F0]">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.5
        }} />

        {/* Pulsing rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2ED8C3]"
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: i * 200, height: i * 200, opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Center Pin */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 1.5, type: 'spring', bounce: 0.6 }}
        >
          <div className="bg-white px-3 py-1 rounded-full shadow-md text-sm font-bold text-[#0B2341] mb-2 whitespace-nowrap">
            بقالة جدة
          </div>
          <svg width="40" height="50" viewBox="0 0 32 40" fill="none">
            <path d="M16 0C7.16 0 0 7.16 0 16C0 27.5 16 40 16 40C16 40 32 27.5 32 16C32 7.16 24.84 0 16 0ZM16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10C19.31 10 22 12.69 22 16C22 19.31 19.31 22 16 22Z" fill="#2ED8C3"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
          </svg>
        </motion.div>

        {/* Customer Pins */}
        {[
          { top: '30%', left: '70%', delay: 2.5 },
          { top: '70%', left: '30%', delay: 2.8 },
          { top: '20%', left: '20%', delay: 3.1 },
        ].map((pos, idx) => (
          <motion.div
            key={idx}
            className="absolute z-10"
            style={{ top: pos.top, left: pos.left }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: pos.delay, type: 'spring' }}
          >
            <div className="w-6 h-6 bg-[#0B2341] rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-2 h-2 bg-[#2ED8C3] rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
      <Caption text="Your store on the map — visible to nearby customers" />
    </motion.div>
  );
}
