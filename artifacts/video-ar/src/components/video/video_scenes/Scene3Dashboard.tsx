import { motion } from 'framer-motion';
import { PhoneMockup } from './Shared';

export const Scene3Dashboard = () => {
  const customers = [
    { id: 1, name: 'محمد', amount: '٤٥', date: 'اليوم', color: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'سارة', amount: '١٢٠', date: 'أمس', color: 'bg-purple-100 text-purple-600' },
    { id: 3, name: 'خالد', amount: '٨٥', date: 'أمس', color: 'bg-orange-100 text-orange-600' },
    { id: 4, name: 'نورة', amount: '٢٣٠', date: '٢ مايو', color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="bg-white rounded-[2.5rem] shadow-2xl w-[80vw] max-w-4xl h-[70vh] flex flex-col overflow-hidden border border-slate-100"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        {/* Header */}
        <div className="bg-[#0F172A] p-8 flex justify-between items-center text-white">
          <div>
            <h2 className="text-slate-400 text-lg mb-1">إجمالي الذمم</h2>
            <motion.div 
              className="text-5xl font-bold flex items-baseline gap-2 font-display"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ١٬٢٤٠ <span className="text-2xl text-[#14B8A6]">ريال</span>
            </motion.div>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="text-xl font-bold">مقهى النخيل</div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 p-8 bg-slate-50 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800">قائمة العملاء</h3>
            <button className="bg-[#14B8A6] text-white px-6 py-2 rounded-full font-bold shadow-md shadow-teal-500/30">
              + إضافة ذمة
            </button>
          </div>

          <div className="space-y-4">
            {customers.map((c, i) => (
              <motion.div 
                key={c.id}
                className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15, type: "spring", stiffness: 150 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full ${c.color} flex items-center justify-center text-xl font-bold`}>
                    {c.name[0]}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">{c.name}</div>
                    <div className="text-slate-400 text-sm">{c.date}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#0F172A]">
                  {c.amount} ريال
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};