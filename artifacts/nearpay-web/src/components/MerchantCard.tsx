import React from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MerchantCardProps {
  name: string;
  category: string;
  distance: string;
  rating: number;
  verified: boolean;
}

export const MerchantCard = ({ name, category, distance, rating, verified }: MerchantCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-card border border-card-border rounded-[18px] p-4 shadow-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Store size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-foreground">{name}</h3>
              {verified && <ShieldCheck size={16} className="text-primary fill-primary/20" />}
            </div>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-lg text-sm font-medium">
          <Star size={14} className="fill-warning text-warning" />
          {rating}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} />
          {distance} away
        </div>
        <Button variant="secondary" size="sm" className="rounded-xl h-8 px-4 font-semibold">
          Start Tab
        </Button>
      </div>
    </motion.div>
  );
};
