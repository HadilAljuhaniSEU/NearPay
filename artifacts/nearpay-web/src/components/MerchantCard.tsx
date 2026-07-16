import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Navigation, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useT } from '../contexts/LanguageContext';

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
  const t = useT();

  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      className="bg-card border border-card-border p-5 rounded-[20px] cursor-pointer flex flex-col gap-4 group"
      style={{ boxShadow: '0 1px 3px rgba(11,35,65,0.06), 0 4px 12px rgba(11,35,65,0.04)' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-13 w-13 border border-border/60">
            <AvatarFallback className="bg-primary/8 text-primary font-bold text-base">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-foreground text-sm leading-tight">{name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
              <Store size={11} />
              <span>{category}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{distance}{t('km_unit')}</span>
            </div>
            {address && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin size={10} />
                <span className="truncate max-w-[140px]">{address}</span>
              </div>
            )}
          </div>
        </div>
        <Badge
          variant={isOpen ? 'default' : 'secondary'}
          className={`px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider text-[10px] ${
            isOpen ? 'bg-success/10 text-success border-success/20 border' : 'text-muted-foreground'
          }`}
        >
          {isOpen ? t('open_label') : t('closed_label')}
        </Badge>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl h-10 gap-1.5 border-border/60 font-semibold text-xs text-foreground bg-secondary/40 hover:bg-secondary"
        >
          <MessageCircle size={13} className="text-teal" /> {t('whatsapp')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl h-10 gap-1.5 border-border/60 font-semibold text-xs text-foreground bg-secondary/40 hover:bg-secondary"
        >
          <Phone size={13} className="text-teal" /> {t('call')}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-xl border-border/60 bg-secondary/40 hover:bg-secondary flex-shrink-0"
        >
          <Navigation size={15} className="text-teal" />
        </Button>
      </div>
    </motion.div>
  );
};
