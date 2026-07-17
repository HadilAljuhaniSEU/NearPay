import { motion } from 'framer-motion';
import { Caption } from './Shared';
import { useState, useEffect } from 'react';

export function Scene0Hook() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 3000), // explode
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const cards = [
    { name: "محمد", amount: "٤٥ ريال", initial: { x: '-80vw', y: '-40vh', rotate: -45 } },
    { name: "أحمد", amount: "١٢٠ ريال", initial: { x: '80vw', y: '20vh', rotate: 30 } },
    { name: "نورة", amount: "٣٢ ريال", initial: { x: '-20vw', y: '80vh', rotate: 15 } },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#0F172A]"
      style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ clipPath: 'circle(150% at 50% 50%)', opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className="relative z-10 text-center w-full max-w-4xl px-8">
        <h1 className="text-white text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl flex justify-center gap-4 flex-wrap">
          {["هل", "تعبت", "من", "ضياع", "الديون؟"].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: 90 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 200, damping: 15 }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.h2
          className="text-[#14B8A6] text-3xl md:text-5xl font-bold mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          ما تعرف مين يدين لك؟
        </motion.h2>

        <motion.div
          className="mt-8 text-6xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 3 ? { scale: [1, 1.2, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          🤦‍♂️
        </motion.div>
      </div>

      {/* Floating Receipts */}
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-xl shadow-2xl p-4 md:p-6 w-40 md:w-48 z-20 flex flex-col items-center justify-center border-l-4 border-l-[#EF4444]"
          initial={card.initial}
          animate={
            phase >= 4 ? { x: `${(Math.random() - 0.5) * 150}vw`, y: `${(Math.random() - 0.5) * 150}vh`, rotate: (Math.random() - 0.5) * 360, opacity: 0 } :
            { x: `${(i - 1) * 20}vw`, y: `${(i - 1) * 10}vh`, rotate: (i - 1) * 10 }
          }
          transition={
            phase >= 4 ? { duration: 0.8, ease: "easeIn" } :
            { duration: 1.5, type: "spring", bounce: 0.4, delay: i * 0.2 }
          }
        >
          <div className="text-gray-500 font-semibold mb-2">{card.name}</div>
          <div className="text-[#EF4444] font-black text-xl md:text-2xl">{card.amount}</div>
        </motion.div>
      ))}

      <Caption text="Lost track of who owes you money?" />
    </motion.div>
  );
}