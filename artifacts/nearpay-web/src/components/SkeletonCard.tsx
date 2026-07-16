import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-card border border-card-border p-6 rounded-[24px] shadow-soft flex flex-col gap-4 w-full animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-1/2 bg-secondary rounded" />
          <div className="h-3 w-1/3 bg-secondary rounded" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-2">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-secondary rounded" />
          <div className="h-6 w-24 bg-secondary rounded" />
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary" />
      </div>
    </div>
  );
};
