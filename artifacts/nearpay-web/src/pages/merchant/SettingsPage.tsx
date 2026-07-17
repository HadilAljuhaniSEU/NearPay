import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut, ChevronRight, Bell, MessageSquare, Smartphone, Shield,
  CircleDollarSign, HelpCircle, Store, MapPin, Eye, EyeOff, LocateFixed,
  Clock, Save, CheckCircle,
} from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { NearPayLogo } from '../../components/NearPayLogo';
import { useT } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { updateMerchantGeoData, BUSINESS_TYPES, SAUDI_CITIES, MerchantGeoData } from '../../services/nearbyService';

export default function MerchantSettingsPage() {
  const [notifs, setNotifs]       = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sms, setSms]             = useState(false);
  const [, setLocation]           = useLocation();
  const t = useT();
  const { user, merchant } = useAuth();

  // ── Location & Discovery state ───────────────────────────────────────────────
  const [lat, setLat]                     = useState('');
  const [lng, setLng]                     = useState('');
  const [city, setCity]                   = useState('');
  const [businessType, setBusinessType]   = useState('');
  const [whatsapp, setWhatsapp]           = useState('');
  const [description, setDescription]     = useState('');
  const [opensAt, setOpensAt]             = useState('08:00');
  const [closesAt, setClosesAt]           = useState('22:00');
  const [isVisible, setIsVisible]         = useState(true);
  const [geoSaving, setGeoSaving]         = useState(false);
  const [geoSaved, setGeoSaved]           = useState(false);
  const [gpsLoading, setGpsLoading]       = useState(false);

  // Pre-fill from existing merchant doc
  useEffect(() => {
    if (!merchant) return;
    if (merchant.latitude)    setLat(String(merchant.latitude));
    if (merchant.longitude)   setLng(String(merchant.longitude));
    if (merchant.city)        setCity(merchant.city);
    if (merchant.businessType) setBusinessType(merchant.businessType);
    if (merchant.whatsapp)    setWhatsapp(merchant.whatsapp);
    if (merchant.description) setDescription(merchant.description);
    if (merchant.workingHours) {
      setOpensAt(merchant.workingHours.open);
      setClosesAt(merchant.workingHours.close);
    }
    if (merchant.isVisible != null) setIsVisible(merchant.isVisible);
  }, [merchant]);

  const handleLogout = () => {
    localStorage.removeItem('nearpay_role');
    setLocation('/login');
  };

  const handleGetGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { timeout: 8000 },
    );
  };

  const handleSaveLocation = async () => {
    if (!merchant?.id) return;
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) return;
    setGeoSaving(true);
    try {
      const data: MerchantGeoData = {
        latitude: latNum,
        longitude: lngNum,
        city,
        businessType,
        whatsapp,
        description,
        isVisible,
        workingHours: { open: opensAt, close: closesAt },
      };
      await updateMerchantGeoData(merchant.id, data);
      setGeoSaved(true);
      setTimeout(() => setGeoSaved(false), 3000);
    } finally {
      setGeoSaving(false);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item      = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('menu_title')} showLanguage={true} />

      <div className="page-scroll px-5 py-5 pb-32 bg-secondary/20">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

          {/* Profile Card */}
          <motion.div variants={item} className="bg-card rounded-[22px] p-5 flex items-center gap-4 border border-border/60 shadow-sm group cursor-pointer hover:border-teal/30 transition-colors">
            <Avatar className="h-14 w-14 border-2 border-border/40">
              <AvatarFallback className="bg-primary/8 text-primary font-bold text-lg">
                {(merchant?.businessName || merchant?.name || 'M').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-base mb-0.5">
                {merchant?.businessName || merchant?.name || '—'}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Store size={12} />
                {merchant?.businessType || t('grocery_cat')}
                <span className="w-1 h-1 rounded-full bg-border" />
                {merchant?.city || t('riyadh_city')}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <ChevronRight size={18} className="rtl-flip" />
            </div>
          </motion.div>

          {/* Business Info */}
          <motion.div variants={item} className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('business_details')}</h3>
            </div>
            {[
              { labelKey: 'biz_name',  value: merchant?.businessName || merchant?.name || '—' },
              { labelKey: 'biz_cat',   value: merchant?.businessType || t('grocery_cat') },
              { labelKey: 'biz_city',  value: merchant?.city || t('riyadh_city') },
              { labelKey: 'biz_phone', value: merchant?.phone || '—' },
            ].map((row, i, arr) => (
              <div
                key={row.labelKey}
                className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <span className="text-sm font-semibold text-muted-foreground">{t(row.labelKey as any)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{row.value}</span>
                  <ChevronRight size={14} className="text-muted-foreground/40 rtl-flip" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── Location & Discovery ───────────────────────────────────────────── */}
          <motion.div variants={item} className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('location_setup_title')}</h3>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{t('location_setup_subtitle')}</p>
              </div>
              <MapPin size={16} className="text-teal" />
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* GPS button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetGPS}
                disabled={gpsLoading}
                className="w-full h-10 rounded-xl border-teal/30 bg-teal/5 hover:bg-teal/10 text-teal font-bold text-xs gap-2"
              >
                <LocateFixed size={14} className={gpsLoading ? 'animate-spin' : ''} />
                {gpsLoading ? 'Locating…' : t('get_my_location')}
              </Button>

              {/* Lat / Lng */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Latitude</label>
                  <Input
                    type="number"
                    placeholder="24.7136"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="h-10 rounded-xl text-sm font-medium bg-secondary border-border/60"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Longitude</label>
                  <Input
                    type="number"
                    placeholder="46.6753"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="h-10 rounded-xl text-sm font-medium bg-secondary border-border/60"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">{t('biz_city')}</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 bg-secondary border border-border/60 rounded-xl px-3 text-sm font-bold text-foreground appearance-none cursor-pointer"
                >
                  <option value="">{t('select_city')}</option>
                  {SAUDI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Business Type */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">{t('business_type_label')}</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full h-10 bg-secondary border border-border/60 rounded-xl px-3 text-sm font-bold text-foreground appearance-none cursor-pointer"
                >
                  <option value="">— {t('business_type_label')} —</option>
                  {BUSINESS_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">{t('biz_whatsapp')}</label>
                <Input
                  type="tel"
                  placeholder="+966 5X XXX XXXX"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="h-10 rounded-xl text-sm font-medium bg-secondary border-border/60"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">{t('biz_description')}</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of your business…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-secondary border border-border/60 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              {/* Working Hours */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block mb-1 flex items-center gap-1">
                  <Clock size={11} /> {t('working_hours_label')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium mb-1">{t('work_opens')}</p>
                    <Input
                      type="time"
                      value={opensAt}
                      onChange={(e) => setOpensAt(e.target.value)}
                      className="h-10 rounded-xl text-sm font-medium bg-secondary border-border/60"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium mb-1">{t('work_closes')}</p>
                    <Input
                      type="time"
                      value={closesAt}
                      onChange={(e) => setClosesAt(e.target.value)}
                      className="h-10 rounded-xl text-sm font-medium bg-secondary border-border/60"
                    />
                  </div>
                </div>
              </div>

              {/* Visible toggle */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                    {isVisible ? <Eye size={14} className="text-primary" /> : <EyeOff size={14} className="text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t('business_visible_label')}</p>
                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{t('business_visible_sub')}</p>
                  </div>
                </div>
                <Switch
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Save button */}
              <Button
                onClick={handleSaveLocation}
                disabled={geoSaving || !lat || !lng}
                className="w-full h-11 rounded-xl font-bold text-sm gap-2"
              >
                {geoSaved ? (
                  <><CheckCircle size={16} /> {t('location_saved_msg')}</>
                ) : (
                  <><Save size={16} /> {t('save_location')}</>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div variants={item} className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('preferences_title')}</h3>
            </div>
            {[
              { labelKey: 'pref_push_notifs', subKey: 'pref_push_notifs_sub', icon: Bell,         value: notifs,    set: setNotifs },
              { labelKey: 'pref_auto_remind', subKey: 'pref_auto_remind_sub', icon: MessageSquare, value: reminders, set: setReminders },
              { labelKey: 'pref_sms_alerts',  subKey: 'pref_sms_alerts_sub',  icon: Smartphone,   value: sms,       set: setSms },
            ].map((row, i, arr) => (
              <div
                key={row.labelKey}
                className={`flex items-center gap-4 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <row.icon size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{t(row.labelKey as any)}</p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{t(row.subKey as any)}</p>
                </div>
                <Switch checked={row.value} onCheckedChange={row.set} className="data-[state=checked]:bg-primary" />
              </div>
            ))}
          </motion.div>

          {/* Account */}
          <motion.div variants={item} className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('account_section')}</h3>
            </div>
            {[
              { labelKey: 'account_payment_methods', icon: CircleDollarSign },
              { labelKey: 'account_security',        icon: Shield },
              { labelKey: 'account_help',             icon: HelpCircle },
            ].map((row, i, arr) => (
              <div
                key={row.labelKey}
                className={`flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-secondary/50 transition-colors ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <row.icon size={17} className="text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">{t(row.labelKey as any)}</span>
                </div>
                <ChevronRight size={15} className="text-muted-foreground/40 rtl-flip" />
              </div>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.div variants={item} className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-destructive/5 text-destructive border border-destructive/20 rounded-[18px] py-4 font-bold text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform rtl-flip" />
              {t('sign_out')}
            </button>
          </motion.div>

          <div className="flex flex-col items-center justify-center py-4 opacity-50">
            <NearPayLogo size={20} className="mb-1.5 grayscale" />
            <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">{t('version_label')}</p>
          </div>

        </motion.div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
