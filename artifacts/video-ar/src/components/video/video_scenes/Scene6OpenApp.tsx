import { motion } from 'framer-motion';
import { PhoneMockup } from './Shared';

export const Scene6OpenApp = () => {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-5xl font-bold text-[#0F172A] font-display" style={{ fontFamily: 'var(--font-display)' }}>
            واجهة العميل
          </h2>
        </motion.div>

        <PhoneMockup>
          <div className="bg-slate-50 w-full h-full flex flex-col pt-12">
            <div className="px-6 pb-6">
              <h3 className="text-xl font-bold text-slate-800">مرحباً محمد،</h3>
              <p className="text-slate-500 text-sm">لديك ذمم مستحقة الدفع</p>
            </div>

            <div className="px-6 flex-1">
              <motion.div 
                className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1, type: "spring", bounce: 0.4 }}
              >
                {/* Accent top border */}
                <div className="absolute top-0 inset-x-0 h-2 bg-[#14B8A6]"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-teal-100 text-[#14B8A6] rounded-2xl flex items-center justify-center text-2xl">
                    ☕
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-800">مقهى النخيل</div>
                    <div className="text-sm text-slate-500">منذ يومين</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center mb-6">
                  <div className="text-sm text-slate-500 mb-1">المبلغ المستحق</div>
                  <div className="text-4xl font-bold text-[#0F172A] font-display" style={{ fontFamily: 'var(--font-display)' }}>
                    ٤٥ <span className="text-xl text-[#14B8A6]">ريال</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-2">التفاصيل: قهوة وكيك</div>
                </div>

                <motion.div 
                  className="bg-[#0F172A] text-white text-center py-4 rounded-xl font-bold text-lg cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  استعراض خيارات الدفع
                </motion.div>
              </motion.div>
            </div>
          </div>
        </PhoneMockup>
      </div>
    </motion.div>
  );
};