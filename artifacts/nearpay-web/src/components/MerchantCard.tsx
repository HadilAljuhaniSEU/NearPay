import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Navigation, ChevronRight, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface MerchantCardProps {
  id: string;
  name: string;
  category: string;
  distance: number;
  isOpen: boolean;
  avatar: string;
  phone?: string;
  address?: string;
}

export const MerchantCard = ({ id, name, category, distance, isOpen, avatar, phone, address }: MerchantCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card border border-card-border p-5 rounded-[20px] shadow-soft cursor-pointer flex flex-col gap-4 group"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-foreground text-base leading-tight flex items-center gap-2">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-medium">
              <Store size={12} />
              <span>{category}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{distance}km</span>
            </div>
            {address && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin size={10} />
                <span className="truncate max-w-[150px]">{address}</span>
              </div>
            )}
          </div>
        </div>
        <Badge variant={isOpen ? "default" : "secondary"} className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] ${isOpen ? 'bg-success/10 text-success border-success/20' : 'text-muted-foreground'}`}>
          {isOpen ? 'Open' : 'Closed'}
        </Badge>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Button variant="outline" size="sm" className="flex-1 rounded-xl h-10 gap-1.5 border-border font-semibold text-xs text-foreground bg-secondary/50 hover:bg-secondary">
          <MessageCircle size={14} className="text-primary" /> WhatsApp
        </Button>
        <Button variant="outline" size="sm" className="flex-1 rounded-xl h-10 gap-1.5 border-border font-semibold text-xs text-foreground bg-secondary/50 hover:bg-secondary">
          <Phone size={14} className="text-primary" /> Call
        </Button>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-border bg-secondary/50 hover:bg-secondary flex-shrink-0">
          <Navigation size={16} className="text-primary" />
        </Button>
      </div>
    </motion.div>
  );
};
