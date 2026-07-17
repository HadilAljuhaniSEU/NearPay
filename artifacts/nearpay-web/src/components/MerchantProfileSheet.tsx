import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Navigation,
  Users,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useT } from '../contexts/LanguageContext';
import { DiscoverableMerchant } from '../types';
import { formatDistance, isOpenNow } from '../lib/geo';

interface MerchantProfileSheetProps {
  merchant: DiscoverableMerchant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-bold text-foreground mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

export const MerchantProfileSheet: React.FC<MerchantProfileSheetProps> = ({
  merchant,
  open,
  onOpenChange,
}) => {
  const t = useT();
  if (!merchant) return null;

  const name = merchant.businessName || merchant.name || '';
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isOpen =
    merchant.workingHours
      ? isOpenNow(merchant.workingHours.open, merchant.workingHours.close)
      : null;

  const trust = merchant.trustScore ?? 0;

  const handleCall = () => {
    if (merchant.phone) window.location.href = `tel:${merchant.phone}`;
  };

  const handleWhatsApp = () => {
    const num = (merchant.whatsapp || merchant.phone || '').replace(/\D/g, '');
    if (num) window.open(`https://wa.me/${num}`, '_blank');
  };

  const handleOpenMaps = () => {
    if (merchant.latitude && merchant.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${merchant.latitude},${merchant.longitude}`,
        '_blank',
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[88vh] rounded-t-[28px] px-0 pt-0 overflow-hidden flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 pb-8">
          {/* Header */}
          <SheetHeader className="text-left mb-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border/40">
                {merchant.logoUrl && <AvatarImage src={merchant.logoUrl} alt={initials} />}
                <AvatarFallback className="bg-primary/8 text-primary font-bold text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-bold text-foreground leading-tight">
                  {name}
                </SheetTitle>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {merchant.businessType}
                  {merchant.city && ` · ${merchant.city}`}
                </p>
                {/* Open/Closed + Distance */}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {isOpen !== null && (
                    <Badge
                      className={`px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider text-[10px] ${
                        isOpen
                          ? 'bg-success/10 text-success border-success/20 border'
                          : 'bg-secondary text-muted-foreground border border-border/60'
                      }`}
                    >
                      {isOpen ? t('open_label') : t('closed_label')}
                    </Badge>
                  )}
                  {merchant.distance != null && (
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-0.5">
                      <MapPin size={10} />
                      {formatDistance(merchant.distance)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Trust Score */}
          <div className="bg-secondary/50 rounded-[18px] p-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-teal" />
              <div>
                <p className="text-xs font-bold text-foreground">{t('trust_score_label')}</p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {trust >= 90
                    ? t('trust_badge_verified')
                    : trust >= 80
                    ? t('trust_badge_high')
                    : t('trust_badge_cr')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary">{trust}</p>
              <div className="flex gap-0.5 justify-end mt-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={9}
                    className={i <= Math.round(trust / 20) ? 'text-primary fill-primary' : 'text-border'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <Button
              onClick={handleCall}
              variant="outline"
              className="flex-col h-16 gap-1.5 rounded-[16px] border-border/60 bg-secondary/40 hover:bg-secondary font-semibold text-xs"
            >
              <Phone size={18} className="text-teal" />
              {t('call')}
            </Button>
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="flex-col h-16 gap-1.5 rounded-[16px] border-border/60 bg-secondary/40 hover:bg-secondary font-semibold text-xs"
            >
              <MessageCircle size={18} className="text-teal" />
              {t('whatsapp')}
            </Button>
            <Button
              onClick={handleOpenMaps}
              variant="outline"
              disabled={!merchant.latitude}
              className="flex-col h-16 gap-1.5 rounded-[16px] border-border/60 bg-secondary/40 hover:bg-secondary font-semibold text-xs"
            >
              <Navigation size={18} className="text-teal" />
              {t('open_in_maps')}
            </Button>
          </div>

          {/* Info rows */}
          <div className="bg-card border border-border/60 rounded-[20px] px-4 mb-4 shadow-sm">
            {merchant.description && (
              <InfoRow icon={FileText} label={t('profile_about')} value={merchant.description} />
            )}
            {merchant.commercialRegistration && (
              <InfoRow
                icon={ShieldCheck}
                label={t('commercial_reg_label')}
                value={merchant.commercialRegistration}
              />
            )}
            {merchant.workingHours && (
              <InfoRow
                icon={Clock}
                label={t('working_hours_label')}
                value={`${merchant.workingHours.open} – ${merchant.workingHours.close}`}
              />
            )}
            {merchant.phone && (
              <InfoRow icon={Phone} label={t('biz_phone')} value={merchant.phone} />
            )}
            {merchant.whatsapp && (
              <InfoRow icon={MessageCircle} label={t('whatsapp_label')} value={merchant.whatsapp} />
            )}
            {merchant.city && (
              <InfoRow icon={MapPin} label={t('biz_city')} value={merchant.city} />
            )}
            <InfoRow
              icon={Users}
              label={t('active_customers_label')}
              value={String(merchant.customerCount ?? 0)}
            />
          </div>

          {/* Open in Google Maps link */}
          {merchant.latitude && merchant.longitude && (
            <button
              onClick={handleOpenMaps}
              className="w-full flex items-center justify-center gap-2 text-sm font-bold text-teal py-3 rounded-[16px] border border-teal/20 bg-teal/5 hover:bg-teal/10 transition-colors"
            >
              <ExternalLink size={15} />
              {t('open_in_maps')}
            </button>
          )}

          {/* Future-prep: store photos, reviews, merchant ads — architecture ready */}
          {/* TODO: Store Photos carousel — storageService.listMerchantPhotos(id) */}
          {/* TODO: Customer Reviews — subcollection merchants/{id}/reviews */}
          {/* TODO: Sponsored/Featured badge — merchant.featured, merchant.sponsored */}
          {/* TODO: Merchant Verification status — merchant.verificationStatus */}
        </div>
      </SheetContent>
    </Sheet>
  );
};
