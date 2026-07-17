import { motion } from 'framer-motion';
import { Caption } from './Shared';

export function Scene2MerchantProfile() {
  return (
    <motion.div
      className="absolute inset-0 flex bg-[#F8FAFC]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Right Side - Map */}
      <div className="w-1/2 h-full relative bg-gray-100 overflow-hidden flex items-center justify-center">
        {/* Abstract Grid Map */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        
        {/* Radar Rings */}
        <motion.div
          className="absolute w-96 h-96 border-[3px] border-[#14B8A6]/20 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-96 h-96 border-[3px] border-[#14B8A6]/30 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
        />

        {/* Pin */}
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.5 }}
        >
          <div className="bg-[#14B8A6] text-white px-4 py-2 rounded-xl font-bold shadow-xl text-lg mb-2 whitespace-nowrap relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-[#14B8A6]">
            بقالة النخيل
          </div>
          <div className="w-6 h-6 bg-[#14B8A6] rounded-full border-4 border-white shadow-md z-10" />
        </motion.div>

        {/* Callout */}
        <motion.div
          className="absolute bottom-1/4 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg font-bold text-gray-700 text-lg border border-gray-100"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          يظهر لعملاء في دائرة ٣ كيلومتر 📍
        </motion.div>
      </div>

      {/* Left Side - Profile Card */}
      <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12 shadow-2xl z-20">
        <motion.div 
          className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 border border-gray-100 relative overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#14B8A6] to-[#0F172A]" />
          
          <div className="relative pt-16 flex flex-col items-center text-center">
            <motion.div 
              className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl mb-4 border-4 border-white"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              🏪
            </motion.div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-2">بقالة النخيل</h2>
            
            <div className="flex items-center gap-1 text-[#F59E0B] text-xl font-bold mb-4">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              <span className="text-gray-500 text-base font-medium mr-2">(٤.٨)</span>
            </div>

            <p className="text-gray-500 font-medium mb-8 text-lg" dir="ltr">+966 50 XXX XXXX</p>

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
              <motion.button className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-md hover:shadow-lg transition-all" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0 }}>
                <span className="text-2xl">💬</span> واتساب
              </motion.button>
              <div className="flex gap-3">
                <motion.button className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.1 }}>
                  📞 مكالمة
                </motion.button>
                <motion.button className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 }}>
                  📍 الموقع
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Caption text="Your store on the map — visible to everyone nearby" />
    </motion.div>
  );
}