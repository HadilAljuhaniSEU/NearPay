import React from 'react';

export const NearPayLogo = ({ className = "", small = false }: { className?: string, small?: boolean }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={small ? "24" : "32"}
        height={small ? "24" : "32"}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill="#16A34A" />
        <path
          d="M10 22V10L22 22V10"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="3" fill="white" />
      </svg>
      {!small && (
        <span className="font-bold text-xl text-foreground tracking-tight">
          Near<span className="text-primary">Pay</span>
        </span>
      )}
    </div>
  );
};
