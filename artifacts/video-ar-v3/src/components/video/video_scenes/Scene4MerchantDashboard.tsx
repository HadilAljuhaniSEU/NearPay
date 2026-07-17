import { motion } from 'framer-motion';
import { Caption, NearPayLogo, PhoneFrame } from './Shared';

export default function Scene4MerchantDashboard() {
  const debts = [
    { name: "هديل", amount: "٤٥", status: "معلّق", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", delay: 2.0 },
    { name: "غلا", amount: "١٢٠", status: "مسدّد ✓", color: "#22C55E", bg: "rgba(34,197,94,0.1)", delay: 2.2 },
    { name: "دالي", amount: "٣٢", status: "معلّق", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", delay: 2.4 },
    { name: "البندري", amount: "٦٥", status: "متأخر", color: "#EF4444", bg: "rgba(239,68,68,0.1)", delay: 2.6, alert: true },
  ];

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
        <div className="w-full h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] flex flex-col justify-center px-6 sticky top-0 z-20">
          <h1 className="text-[20px] font-bold text-[#0B2341]">لوحة التحكم</h1>
          <span className="text-[13px] text-[#64748B]">بقالة جدة</span>
        </div>

        <div className="p-5 flex flex-col bg-[#F8FAFC] h-full overflow-hidden">
          {/* Hero Card */}
          <motion.div
            className="w-full rounded-[20px] p-5 mb-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)' }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white opacity-5 blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-[#2ED8C3] opacity-10 blur-2xl" />
            
            <div className="text-[11px] uppercase font-bold text-[#2ED8C3] mb-1">إجمالي المديونيات</div>
            <div className="text-[32px] font-bold text-white mb-4" style={{ direction: 'ltr', textAlign: 'right' }}>١٬٢٤٠ ريال</div>
            
            <div className="flex gap-3">
              <div className="flex-1 h-10 rounded-xl bg-[#2ED8C3] text-[#0B2341] font-bold text-sm flex items-center justify-center">
                إضافة دين +
              </div>
              <div className="flex-1 h-10 rounded-xl border border-white/20 text-white font-bold text-sm flex items-center justify-center">
                سحب الرصيد
              </div>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              className="bg-white rounded-[16px] p-3 border border-[#E2E8F0] shadow-[0_2px_8px_rgba(11,35,65,0.06)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.0, type: 'spring' }}
            >
              <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-2">
                <span className="text-[14px]">🟡</span>
              </div>
              <div className="text-[9px] uppercase font-bold text-[#64748B]">٣ ديون معلّقة</div>
              <div className="text-[18px] font-bold text-[#0B2341] mt-1" style={{ direction: 'ltr', textAlign: 'right' }}>١٠٩ ريال</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-[16px] p-3 border border-[#E2E8F0] shadow-[0_2px_8px_rgba(11,35,65,0.06)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
            >
              <div className="w-7 h-7 rounded-lg bg-[#22C55E]/10 flex items-center justify-center mb-2">
                <span className="text-[14px]">🟢</span>
              </div>
              <div className="text-[9px] uppercase font-bold text-[#64748B]">مسدّد اليوم</div>
              <div className="text-[18px] font-bold text-[#0B2341] mt-1" style={{ direction: 'ltr', textAlign: 'right' }}>٧٨٠ ريال</div>
            </motion.div>
          </div>

          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-bold text-[#0B2341]">أحدث الديون</h3>
            <span className="text-[#2ED8C3] text-sm font-bold">الكل</span>
          </div>

          {/* Debt List */}
          <div className="space-y-3">
            {debts.map((debt, i) => (
              <motion.div
                key={i}
                className={`bg-white rounded-[20px] p-4 border shadow-[0_2px_8px_rgba(11,35,65,0.06)] flex items-center relative overflow-hidden ${debt.alert ? 'border-t-2 border-t-[#EF4444] border-x-[#E2E8F0] border-b-[#E2E8F0]' : 'border-[#E2E8F0]'}`}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: debt.delay, type: 'spring', damping: 20 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B2341] to-[#143B63] flex items-center justify-center text-white font-bold text-sm ml-3 shrink-0">
                  {debt.name[0]}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-[15px] text-[#0B2341]">{debt.name}</span>
                  <span className="text-[11px] text-[#64748B]">اليوم، ١٠:٣٠ ص</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-[16px] text-[#0B2341]" style={{ direction: 'ltr' }}>{debt.amount} ريال</span>
                  <div className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ backgroundColor: debt.bg, color: debt.color }}>
                    {debt.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PhoneFrame>
      <Caption ar="كل ديونك في مكان واحد" en="All your debts in one place" />
    </motion.div>
  );
}
