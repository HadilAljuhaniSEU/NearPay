import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

export const StatusBar = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-full h-[44px] flex items-center justify-between px-6 pt-2 z-50 top-0 sticky bg-background/80 backdrop-blur-md ${className}`}>
      <div className="text-[15px] font-semibold tracking-tight text-foreground">
        9:41
      </div>
      <div className="flex items-center gap-2 text-foreground">
        <Signal size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <Battery size={18} strokeWidth={2} />
      </div>
    </div>
  );
};
