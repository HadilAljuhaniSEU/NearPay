import React from 'react';

export const NearPayLogo = ({ className = "", size = 32 }: { className?: string, size?: number }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pin body — slightly elongated teardrop */}
        <path
          d="M16 2C9.9 2 5 7.0 5 13.2C5 21.8 16 30 16 30C16 30 27 21.8 27 13.2C27 7.0 22.1 2 16 2Z"
          fill="#16A34A"
        />
        {/* N letterform — two verticals + diagonal */}
        <path
          d="M12 17.5V9L20 17.5V9"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {size >= 24 && (
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: `${size * 0.625}px`, lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          Near<span className="text-primary">Pay</span>
        </span>
      )}
    </div>
  );
};
