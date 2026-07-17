import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Navigation, Store, ShieldCheck, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useT } from '../contexts/LanguageContext';
import { DiscoverableMerchant } from '../types';
import { formatDistance, isOpenNow } from '../lib/geo';

interface NearbyMerchantCardProps {
  merchant: DiscoverableMerchant;
  onClick: (merchant: DiscoverableMerchant) => void;
}

function TrustBadge({ score }: { score: number }) {
  const t = useT();
  if (score >= 90)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal bg-teal/10 border border-teal/20 rounded-lg px-2 py-0.5">
        <ShieldCheck size={10} /> {t('trust_badge_verified')}
      </span>
    );
  if (score >= 80)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/8 border border-primary/15 rounded-lg px-2 py-0.5">
        <Star size={10} /> {t('trust_badge_high')}
      </span>
    );
  return null;
}

export const NearbyMerchantCard: React.FC<NearbyMerchantCardProps> = ({ merchant, onClick }) => {
  const t = useT();

  const open =
    merchant.workingHours
      ? isOpenNow(merchant.workingHours.open, merchant.workingHours.close)
      : null;

  const initials = (merchant.businessName || merchant.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (merchant.phone) window.location.href = `tel:${merchant.phone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const num = (merchant.whatsapp || merchant.phone || '').replace(/\D/g, '');
    if (num) window.open(`https://wa.me/${num}`, '_blank');
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (merchant.latitude && merchant.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${merchant.latitude},${merchant.longitude}`,
        '_blank',
      );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onClick(merchant)}
      className="bg-card border border-card-border p-5 rounded-[20px] cursor-pointer flex flex-col gap-4 group"
      style={{ boxShadow: '0 1px 3px rgba(11,35,65,0.06), 0 4px 12px rgba(11,35,65,0.04)' }}
    >
      {/* Top row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-13 w-13 border border-border/60">
            {merchant.logoUrl && <AvatarImage src={merchant.logoUrl} alt={initials} />}
            <AvatarFallback className="bg-primary/8 text-primary font-bold text-base">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-foreground text-sm leading-tight">
              {merchant.businessName || merchant.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
              <Store size={11} />
              <span>{merchant.businessType || '—'}</span>
              {merchant.distance != null && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <MapPin size={10} />
                  <span>{formatDistance(merchant.distance)}</span>
                </>
              )}
            </div>
            {/* Trust badge row */}
            {merchant.trustScore != null && merchant.trustScore >= 80 && (
              <div className="mt-1">
                <TrustBadge score={merchant.trustScore} />
              </div>
            )}
          </div>
        </div>

        {/* Open / Closed badge */}
        {open !== null && (
          <Badge
            variant={open ? 'default' : 'secondary'}
            className={`px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider text-[10px] flex-shrink-0 ${
              open
                ? 'bg-success/10 text-success border-success/20 border'
                : 'text-muted-foreground'
            }`}
          >
            {open ? t('open_label') : t('closed_label')}
          </Badge>
        )}
      </div>

      {/* City / address */}
      {(merchant.city || merchant.address) && (
        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 -mt-2">
          <MapPin size={10} />
          {merchant.city || merchant.address}
        </p>
      )}

      {/* Action row */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsApp}
          className="flex-1 rounded-xl h-10 gap-1.5 border-border/60 font-semibold text-xs text-foreground bg-secondary/40 hover:bg-secondary"
        >
          <MessageCircle size={13} className="text-teal" /> {t('whatsapp')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCall}
          className="flex-1 rounded-xl h-10 gap-1.5 border-border/60 font-semibold text-xs text-foreground bg-secondary/40 hover:bg-secondary"
        >
          <Phone size={13} className="text-teal" /> {t('call')}
        </Button>
        {merchant.latitude && merchant.longitude && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleNavigate}
            className="w-10 h-10 rounded-xl border-border/60 bg-secondary/40 hover:bg-secondary flex-shrink-0"
          >
            <Navigation size={15} className="text-teal" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};
