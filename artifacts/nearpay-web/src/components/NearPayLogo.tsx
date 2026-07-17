import React from 'react';

interface NearPayLogoProps {
  className?: string;
  size?: number;
  /** 'color' = full colour (default), 'white' = all white for dark backgrounds */
  variant?: 'color' | 'white';
}

export const NearPayLogo = ({ className = '', size = 32, variant = 'color' }: NearPayLogoProps) => {
  const textColor   = variant === 'white' ? '#FFFFFF' : '#0B2341';
  const accentColor = variant === 'white' ? '#FFFFFF' : '#20D6C7';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <NearPayIcon size={size} variant={variant} />
      {size >= 24 && (
        <span style={{
          fontSize:      `${Math.round(size * 0.58)}px`,
          lineHeight:    1,
          letterSpacing: '-0.03em',
          fontWeight:    800,
          color:         textColor,
        }}>
          Near<span style={{ color: accentColor }}>Pay</span>
        </span>
      )}
    </div>
  );
};

/** Standalone app icon — map pin with SAR riyal symbol inside */
export const NearPayIcon = ({
  size = 32,
  variant = 'color',
}: {
  size?: number;
  variant?: 'color' | 'white';
  color?: string; // kept for backward compat, ignored when variant supplied
}) => {
  const pinFill    = variant === 'white' ? 'rgba(255,255,255,0.25)' : 'url(#nearPayPinGrad)';
  const circleFill = variant === 'white' ? 'rgba(255,255,255,0.5)'  : 'url(#nearPayCircleGrad)';
  const symbolStroke = '#FFFFFF';
  const id = `np_${size}`; // unique gradient id per size to avoid SVG conflicts

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NearPay"
    >
      <defs>
        <linearGradient id={`${id}_pin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1A6FFF" />
          <stop offset="100%" stopColor="#0040CC" />
        </linearGradient>
        <linearGradient id={`${id}_circle`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#25E4D4" />
          <stop offset="100%" stopColor="#10B8A8" />
        </linearGradient>
      </defs>

      {/* ── Map pin body ── */}
      <path
        d="M16 1.5C9.1 1.5 3.5 7.1 3.5 14C3.5 19.8 7.2 24.7 12.4 26.7L16 30.5L19.6 26.7C24.8 24.7 28.5 19.8 28.5 14C28.5 7.1 22.9 1.5 16 1.5Z"
        fill={variant === 'white' ? 'rgba(255,255,255,0.3)' : `url(#${id}_pin)`}
      />

      {/* ── Inner teal circle ── */}
      <circle
        cx="16"
        cy="13.5"
        r="7"
        fill={variant === 'white' ? 'rgba(255,255,255,0.5)' : `url(#${id}_circle)`}
      />

      {/* ── SAR riyal symbol (stylised ر + two horizontal lines) ── */}
      {/* Vertical stroke of ر */}
      <line x1="13.5" y1="10" x2="13.5" y2="14.5" stroke={symbolStroke} strokeWidth="1.7" strokeLinecap="round" />
      {/* Curved top of ر */}
      <path
        d="M13.5 10 Q13.5 8.5 16 8.5 Q18.5 8.5 18.5 10.5 Q18.5 12 16.5 12.5"
        stroke={symbolStroke}
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Two horizontal lines (the two strokes of ﷼) */}
      <line x1="13" y1="15.5" x2="19" y2="15.5" stroke={symbolStroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="17.2" x2="19" y2="17.2" stroke={symbolStroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
