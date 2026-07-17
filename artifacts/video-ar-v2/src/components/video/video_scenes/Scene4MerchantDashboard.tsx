import { motion } from 'framer-motion';
import { Caption } from './Shared';

export function Scene4MerchantDashboard() {
  const rows = [
    { name: "محمد أحمد", amount: "٤٥ ريال", status: "معلّق 🟡", bg: "bg-amber-50" },
    { name: "سارة خالد", amount: "١٢٠ ريال", status: "مسدّد ✓🟢", bg: "bg-green-50" },
    { name: "خالد سعيد", amount: "٣٢ ريال", status: "معلّق 🟡", bg: "bg-amber-50" },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#F1F5F9] p-8 md:p-16"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-4xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden border border-gray-100 flex flex-col" style={{ height: '80vh' }}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#14B8A6] rounded-xl flex items-center justify-center text-white text-xl shadow-lg">📊</div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">لوحة تحكم الديون</h2>
              <p className="text-gray-500 font-medium">بقالة النخيل</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-700">الكل</div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-gray-400">معلّق</div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-gray-400">مسدّد</div>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-3 gap-6 p-8 bg-gray-50 border-b border-gray-100">
          {[
            { label: "إجمالي الديون", val: "١٬٢٤٠ ريال", color: "text-[#14B8A6]", bar: "bg-[#14B8A6]", w: "100%" },
            { label: "مسدّدة", val: "٧٨٠ ريال", color: "text-[#10B981]", bar: "bg-[#10B981]", w: "65%" },
            { label: "معلّقة", val: "٤٦٠ ريال", color: "text-[#F59E0B]", bar: "bg-[#F59E0B]", w: "35%" },
          ].map((metric, i) => (
            <motion.div 
              key={i} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
            >
              <div className="text-gray-500 font-bold mb-2">{metric.label}</div>
              <div className={`text-3xl font-black ${metric.color} mb-4`}>{metric.val}</div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${metric.bar} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: metric.w }}
                  transition={{ delay: 0.8 + i * 0.2, duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 p-8 overflow-hidden flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">أحدث العمليات</h3>
          {rows.map((row, i) => (
            <motion.div
              key={i}
              className={`flex justify-between items-center p-5 rounded-2xl border border-gray-100 shadow-sm ${row.bg}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-xl border border-gray-100">👤</div>
                <div className="font-bold text-lg text-gray-800">{row.name}</div>
              </div>
              <div className="flex items-center gap-8">
                <div className="font-black text-xl text-gray-900 w-24 text-left">{row.amount}</div>
                <div className="bg-white px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-gray-100 w-28 text-center">{row.status}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Caption text="Track every debt from one dashboard" />
    </motion.div>
  );
}