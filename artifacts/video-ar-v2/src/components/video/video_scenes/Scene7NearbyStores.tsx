import { motion } from 'framer-motion';
import { Caption } from './Shared';
import { useState, useEffect } from 'react';

export function Scene7NearbyStores() {
  const [filter, setFilter] = useState('الكل');

  useEffect(() => {
    const t1 = setTimeout(() => setFilter('بقالة'), 3500);
    return () => clearTimeout(t1);
  }, []);

  const pins = [
    { id: 1, name: "بقالة النخيل", type: "بقالة", icon: "🟢", color: "#14B8A6", x: "40%", y: "45%" },
    { id: 2, name: "صيدلية الشفاء", type: "صيدلية", icon: "🔵", color: "#3B82F6", x: "65%", y: "30%" },
    { id: 3, name: "مطعم الشاورما", type: "مطعم", icon: "🟠", color: "#F59E0B", x: "25%", y: "60%" },
    { id: 4, name: "كافيه القهوة", type: "كافيه", icon: "🟣", color: "#8B5CF6", x: "70%", y: "65%" },
    { id: 5, name: "سوبرماركت الرياض", type: "سوبرماركت", icon: "🔵", color: "#0EA5E9", x: "30%", y: "25%" },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#F1F5F9] overflow-hidden"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Map Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(#94A3B8 2px, transparent 2px), linear-gradient(90deg, #94A3B8 2px, transparent 2px)',
        backgroundSize: '100px 100px',
        transform: 'perspective(1000px) rotateX(45deg) scale(2)',
        transformOrigin: 'top center'
      }} />

      {/* Pins */}
      {pins.map((pin, i) => {
        const isVisible = filter === 'الكل' || filter === pin.type;
        const isHighlighted = filter === pin.type && pin.id === 1; // Highlight the main grocery
        
        return (
          <motion.div
            key={pin.id}
            className="absolute z-10 flex flex-col items-center"
            style={{ left: pin.x, top: pin.y }}
            initial={{ y: -100, opacity: 0 }}
            animate={{ 
              y: isVisible ? 0 : -20, 
              opacity: isVisible ? 1 : 0.2,
              scale: isHighlighted ? 1.3 : isVisible ? 1 : 0.8,
              zIndex: isHighlighted ? 50 : 10
            }}
            transition={{ delay: i * 0.15, type: "spring", bounce: 0.5 }}
          >
            {isHighlighted && (
              <motion.div 
                className="absolute w-24 h-24 rounded-full border-4 border-[#14B8A6]/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                animate={{ scale: [1, 2], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <div className={`px-3 py-1.5 rounded-full font-bold text-white shadow-lg text-sm mb-2 relative z-10 whitespace-nowrap`} style={{ backgroundColor: pin.color }}>
              {pin.name}
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-white shadow-md relative z-10" style={{ backgroundColor: pin.color }} />
          </motion.div>
        );
      })}

      {/* Top Filter Chips */}
      <motion.div 
        className="absolute top-10 left-0 right-0 flex justify-center gap-3 z-30"
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
      >
        {["الكل", "بقالة", "مطعم", "صيدلية", "كافيه"].map(chip => (
          <div 
            key={chip}
            className={`px-5 py-2 rounded-full font-bold shadow-md transition-all ${filter === chip ? 'bg-[#14B8A6] text-white scale-110' : 'bg-white text-gray-600'}`}
          >
            {chip}
          </div>
        ))}
      </motion.div>

      {/* Bottom Sheet Card */}
      <AnimatePresence>
        {filter === 'بقالة' && (
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-white rounded-3xl shadow-2xl p-6 z-40 border border-gray-100"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#14B8A6]/10 rounded-2xl flex items-center justify-center text-3xl">🏪</div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-1">بقالة النخيل</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">بقالة</span>
                  <span className="text-[#F59E0B] font-bold text-sm">★ ٤.٨</span>
                  <span className="text-gray-400 text-sm font-medium">| ٣٠٠م</span>
                </div>
              </div>
              <motion.button 
                className="w-12 h-12 bg-[#14B8A6] text-white rounded-full flex items-center justify-center shadow-md text-xl"
                whileHover={{ scale: 1.1 }}
              >
                ←
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Caption text="Discover stores by type — groceries, pharmacies, cafés & more" />
    </motion.div>
  );
}

import { AnimatePresence as AP } from 'framer-motion';
const AnimatePresence = AP;