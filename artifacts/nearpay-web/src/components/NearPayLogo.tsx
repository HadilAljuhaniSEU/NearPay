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
        <path d="M16 2C9.9 2 5 6.9 5 13C5 21.5 16 30 16 30C16 30 27 21.5 27 13C27 6.9 22.1 2 16 2Z" fill="#16A34A" />
        <path d="M11 10V18L17 12V18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 18L19 20L23 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {size >= 24 && (
        <span className="font-bold text-xl text-foreground tracking-tight" style={{ fontSize: `${size * 0.6}px` }}>
          Near<span className="text-primary">Pay</span>
        </span>
      )}
    </div>
  );
};
