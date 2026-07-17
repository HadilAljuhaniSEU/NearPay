import { motion } from 'framer-motion';

/** Bilingual caption bar — Arabic primary, English secondary */
export function Caption({ ar, en }: { ar: string; en: string }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-[3px] px-5 pb-5 pt-10"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.5, duration: 0.45 }}
    >
      <span
        className="text-white font-bold text-center leading-snug"
        style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          direction: 'rtl',
          fontSize: 'clamp(14px, 3.8vw, 19px)',
          textShadow: '0 1px 6px rgba(0,0,0,0.6)',
        }}
      >
        {ar}
      </span>
      <span
        className="text-white/50 text-center font-normal tracking-widest uppercase"
        style={{
          fontFamily: 'Inter, sans-serif',
          direction: 'ltr',
          fontSize: 'clamp(9px, 2.2vw, 11px)',
          letterSpacing: '0.1em',
        }}
      >
        {en}
      </span>
    </motion.div>
  );
}

/** Official NearPay coin-pin logo — no bounding box */
export const NearPayLogo = ({ className = 'w-12 h-12' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    style={{ filter: 'drop-shadow(0 0 6px rgba(46,216,195,0.45))' }}
  >
    {/* Coin-pin body */}
    <path
      d="M16 1.5C9.1 1.5 3.5 7.1 3.5 14C3.5 19.8 7.2 24.7 12.4 26.7L16 30.5L19.6 26.7C24.8 24.7 28.5 19.8 28.5 14C28.5 7.1 22.9 1.5 16 1.5Z"
      fill="#0B2341"
      stroke="#2ED8C3"
      strokeWidth="0.75"
    />
    {/* N letterform */}
    <path
      d="M11 19.5V11L16 17.5L21 11V19.5"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PhoneFrame = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative bg-white rounded-[32px] overflow-hidden shadow-[0_24px_80px_rgba(11,35,65,0.28)] flex flex-col ${className}`}
    style={{ width: 'min(320px, 82vw)', aspectRatio: '360 / 680' }}
  >
    {children}
  </div>
);
