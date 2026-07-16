import React from 'react';

interface NearPayLogoProps {
  className?: string;
  size?: number;
  /** 'color' = navy mark + navy/teal wordmark (default), 'white' = all white for dark backgrounds */
  variant?: 'color' | 'white';
}

export const NearPayLogo = ({ className = '', size = 32, variant = 'color' }: NearPayLogoProps) => {
  const markColor = variant === 'white' ? '#FFFFFF' : '#0B2341';
  const textColor = variant === 'white' ? '#FFFFFF' : '#0B2341';
  const accentColor = variant === 'white' ? '#FFFFFF' : '#2ED8C3';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* App icon: coin-pin hybrid with N letterform */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Coin-pin body: large circular top (coin) + narrow curved tail (pin) */}
        <path
          d="M16 1.5C9.1 1.5 3.5 7.1 3.5 14C3.5 19.8 7.2 24.7 12.4 26.7L16 30.5L19.6 26.7C24.8 24.7 28.5 19.8 28.5 14C28.5 7.1 22.9 1.5 16 1.5Z"
          fill={markColor}
        />
        {/* N letterform — two verticals + diagonal, centered in coin circle */}
        <path
          d="M11 19.5V11L16 17.5L21 11V19.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {size >= 24 && (
        <span
          style={{
            fontSize: `${Math.round(size * 0.6)}px`,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontWeight: 700,
            color: textColor,
          }}
        >
          Near<span style={{ color: accentColor }}>Pay</span>
        </span>
      )}
    </div>
  );
};

/** Standalone app icon only (no wordmark) — for splash screen and favicon usage */
export const NearPayIcon = ({ size = 32, color = '#0B2341' }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 1.5C9.1 1.5 3.5 7.1 3.5 14C3.5 19.8 7.2 24.7 12.4 26.7L16 30.5L19.6 26.7C24.8 24.7 28.5 19.8 28.5 14C28.5 7.1 22.9 1.5 16 1.5Z"
      fill={color}
    />
    <path
      d="M11 19.5V11L16 17.5L21 11V19.5"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
