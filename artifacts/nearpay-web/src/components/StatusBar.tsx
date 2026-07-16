import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

export const StatusBar = () => {
  return (
    <div className="h-12 w-full px-6 flex items-center justify-between z-50 bg-transparent text-foreground pointer-events-none select-none">
      <span className="text-[15px] font-bold tracking-tight">9:41</span>
      <div className="flex items-center gap-2">
        <Signal size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <Battery size={22} strokeWidth={2} />
      </div>
    </div>
  );
};
