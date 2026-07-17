import { motion } from 'framer-motion';
import { PhoneMockup } from './Shared';

export const Scene5Notification = () => {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-[#38BDF8]" />
          {/* Map pins */}
          <circle cx="30%" cy="40%" r="8" fill="#14B8A6" />
          <circle cx="70%" cy="60%" r="6" fill="#14B8A6" />
          <circle cx="50%" cy="50%" r="12" fill="#EF4444" className="animate-pulse" />
        </svg>
      </div>

      <div className="flex items-center gap-16 relative z-10">
        <PhoneMockup className="scale-90">
          <div className="bg-[#0F172A] w-full h-full flex flex-col pt-12 relative overflow-hidden">
            {/* Fake Lock Screen */}
            <div className="flex-1 flex flex-col items-center pt-10 text-white">
              <div className="text-6xl font-light mb-2">١٤:٤٥</div>
              <div className="text-slate-400">الاثنين، ١٢ مايو</div>
            </div>

            {/* Push Notification */}
            <motion.div 
              className="absolute top-1/3 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5, type: "spring", bounce: 0.5 }}
            >
              <div className="flex gap-3 mb-2">
                <div className="w-6 h-6 bg-[#14B8A6] rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <path d="M2 10h20"></path>
                  </svg>
                </div>
                <div className="font-bold text-slate-800 text-sm">NearPay</div>
                <div className="mr-auto text-xs text-slate-400">الآن</div>
              </div>
              <div className="font-bold text-slate-800 mb-1">أنت قريب من مقهى النخيل!</div>
              <div className="text-slate-600 text-sm">لديك ٤٥ ريال ذمة — ادفع الآن بكل سهولة.</div>
            </motion.div>
          </div>
        </PhoneMockup>

        <motion.div 
          className="text-right"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-[#0F172A] mb-4 font-display leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            تنبيه ذكي<br/>عند الاقتراب
          </h2>
          <p className="text-2xl text-[#64748B]">
            نذكّر العميل بالدفع<br/>في الوقت المناسب
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};