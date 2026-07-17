import { motion } from 'framer-motion';
import { Caption } from './Shared';
import { useState, useEffect } from 'react';

export default function Scene7NearbyStores() {
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFilterActive(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const MapPin = ({ color, icon, delay, top, left, isMain }: any) => (
    <motion.div
      className="absolute z-10 flex flex-col items-center"
      style={{ top, left }}
      initial={{ scale: 0, y: -50 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', bounce: 0.6 }}
    >
      <motion.div 
        animate={filterActive ? (isMain ? { scale: 1.2 } : { scale: 0.8, opacity: 0.5, filter: 'grayscale(100%)' }) : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <svg width={isMain ? "48" : "36"} height={isMain ? "60" : "45"} viewBox="0 0 32 40" fill="none">
          <path d="M16 0C7.16 0 0 7.16 0 16C0 27.5 16 40 16 40C16 40 32 27.5 32 16C32 7.16 24.84 0 16 0Z" fill={color}/>
          <circle cx="16" cy="15" r="7" fill="white" fillOpacity="0.2" />
          <text x="16" y="20" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">{icon}</text>
        </svg>
      </motion.div>
      {isMain && filterActive && (
        <motion.div 
          className="bg-white px-3 py-1 rounded-full shadow-lg text-sm font-bold text-[#0B2341] mt-2 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          بقالة جدة
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center font-arabic bg-[#E8F0F6] overflow-hidden"
      style={{ direction: 'rtl' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Map Elements */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(#CBD5E1 2px, transparent 2px), linear-gradient(90deg, #CBD5E1 2px, transparent 2px)',
        backgroundSize: '100px 100px',
        opacity: 0.6
      }} />

      {/* Main road */}
      <div className="absolute h-full w-12 bg-white/50 left-[40%] -skew-x-12" />
      <div className="absolute w-full h-12 bg-white/50 top-[60%] skew-y-6" />

      {/* Center user location */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0B2341] rounded-full border-2 border-white shadow-md z-20">
        <motion.div
          className="absolute inset-0 bg-[#0B2341] rounded-full"
          animate={{ scale: [1, 3], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Pins */}
      <MapPin top="35%" left="45%" color="#2ED8C3" icon="🏪" delay={0.5} isMain={true} />
      <MapPin top="20%" left="60%" color="#3B82F6" icon="💊" delay={1.0} />
      <MapPin top="65%" left="30%" color="#F97316" icon="🍔" delay={1.5} />
      <MapPin top="50%" left="75%" color="#A855F7" icon="☕" delay={2.0} />
      <MapPin top="80%" left="65%" color="#475569" icon="🛒" delay={2.5} />

      {/* Bottom UI Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center z-30">
        
        {/* Filters */}
        <motion.div 
          className="flex gap-3 mb-6 overflow-x-auto w-full max-w-2xl justify-center no-scrollbar"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3.0 }}
        >
          <motion.div 
            className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-colors ${!filterActive ? 'bg-[#2ED8C3] text-white' : 'bg-white text-[#0B2341]'}`}
          >
            الكل
          </motion.div>
          <motion.div 
            className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-colors ${filterActive ? 'bg-[#2ED8C3] text-white' : 'bg-white text-[#0B2341]'}`}
          >
            بقالة {filterActive && '✓'}
          </motion.div>
          <div className="px-5 py-2.5 rounded-full bg-white font-bold text-[#0B2341] text-sm shadow-md">مطعم</div>
          <div className="px-5 py-2.5 rounded-full bg-white font-bold text-[#0B2341] text-sm shadow-md">صيدلية</div>
        </motion.div>

        {/* Selected Store Card */}
        <motion.div 
          className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl flex items-center border border-[#E2E8F0]"
          initial={{ y: 150 }}
          animate={filterActive ? { y: 0 } : { y: 150 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B2341] to-[#143B63] flex items-center justify-center mr-4 shrink-0 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-[60%] h-[60%]">
              <path d="M16 1.5C9.1 1.5 3.5 7.1 3.5 14C3.5 19.8 7.2 24.7 12.4 26.7L16 30.5L19.6 26.7C24.8 24.7 28.5 19.8 28.5 14C28.5 7.1 22.9 1.5 16 1.5Z" fill="#2ED8C3" />
              <path d="M11 19.5V11L16 17.5L21 11V19.5" stroke="#0B2341" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div className="flex flex-col flex-1">
            <h3 className="font-bold text-xl text-[#0B2341]">بقالة جدة</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#64748B] text-sm">٣٠٠م</span>
              <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
              <span className="text-[#64748B] text-sm flex items-center gap-1">⭐ 4.8</span>
            </div>
          </div>

          <div className="bg-[#2ED8C3]/10 px-3 py-1.5 rounded-lg border border-[#2ED8C3]/20 text-center">
            <div className="text-[10px] text-[#0B2341] font-bold">٣ ديون</div>
            <div className="text-[10px] text-[#2ED8C3] font-bold">نشطة</div>
          </div>
        </motion.div>
      </div>

      <Caption ar="اكتشف المتاجر من حولك حسب النوع" en="Discover stores around you" />
    </motion.div>
  );
}
