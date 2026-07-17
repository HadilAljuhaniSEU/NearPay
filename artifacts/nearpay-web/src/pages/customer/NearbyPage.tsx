import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, SlidersHorizontal, MapPin, LocateFixed, X, ChevronDown } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { NearbyMerchantCard } from '../../components/NearbyMerchantCard';
import { MerchantProfileSheet } from '../../components/MerchantProfileSheet';
import { NearbyMap } from '../../components/NearbyMap';
import { Input } from '@/components/ui/input';
import { useT } from '../../contexts/LanguageContext';
import { useNearby, DEFAULT_FILTERS } from '../../hooks/useNearby';
import { BUSINESS_TYPES, SAUDI_CITIES } from '../../services/nearbyService';
import { DiscoverableMerchant } from '../../types';
import { SkeletonCard } from '../../components/SkeletonCard';

// ── Filter chip ────────────────────────────────────────────────────────────────
const Chip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({
  label, active, onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
      active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-card text-muted-foreground border-border/60 hover:border-primary/40'
    }`}
  >
    {label}
  </button>
);

export default function CustomerNearbyPage() {
  const t = useT();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selectedMerchant, setSelectedMerchant] = useState<DiscoverableMerchant | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    locationState,
    userCoords,
    selectedCity,
    setSelectedCity,
    loading,
    merchants,
    search,
    setSearch,
    filters,
    setFilters,
  } = useNearby();

  const openProfile = (m: DiscoverableMerchant) => {
    setSelectedMerchant(m);
    setSheetOpen(true);
  };

  const activeFilterCount = [
    filters.businessType,
    filters.maxDistanceKm > 0,
    filters.minTrustScore > 0,
    filters.openNow,
    filters.city,
  ].filter(Boolean).length;

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title={t('discover_title')}
        subtitle={t('discover_sub')}
        action={
          <div className="flex bg-secondary p-1 rounded-xl">
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              <SlidersHorizontal size={15} />
            </button>
            <button
              onClick={() => setView('map')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'map' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              <MapIcon size={15} />
            </button>
          </div>
        }
      />

      <div className="page-scroll px-5 py-4">
        {/* Sticky search + filters */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-3 -mt-4 mx-[-20px] px-5 space-y-2">
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={17} />
            </div>
            <Input
              type="text"
              placeholder={t('search_places')}
              className="pl-12 pr-10 h-13 rounded-2xl bg-card border border-border/60 shadow-sm text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter chips row */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                activeFilterCount > 0
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border/60 hover:border-primary/40'
              }`}
            >
              <SlidersHorizontal size={11} />
              {t('filter_title')}
              {activeFilterCount > 0 && (
                <span className="bg-primary-foreground/20 text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <Chip
              label={t('filter_open_now')}
              active={filters.openNow}
              onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}
            />
            {BUSINESS_TYPES.map((type) => (
              <Chip
                key={type}
                label={type}
                active={filters.businessType === type}
                onClick={() =>
                  setFilters({ ...filters, businessType: filters.businessType === type ? '' : type })
                }
              />
            ))}
          </div>

          {/* Expanded filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card border border-border/60 rounded-[18px] p-4 space-y-3 shadow-sm">
                  {/* Distance */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                      {t('filter_distance_label')}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { label: t('dist_any'), value: 0 },
                        { label: t('dist_1km'), value: 1 },
                        { label: t('dist_5km'), value: 5 },
                        { label: t('dist_10km'), value: 10 },
                      ].map((opt) => (
                        <Chip
                          key={opt.value}
                          label={opt.label}
                          active={filters.maxDistanceKm === opt.value}
                          onClick={() => setFilters({ ...filters, maxDistanceKm: opt.value })}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Trust */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                      {t('filter_trust_label')}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { label: t('trust_any'), value: 0 },
                        { label: t('trust_high'), value: 80 },
                        { label: t('trust_verified'), value: 90 },
                      ].map((opt) => (
                        <Chip
                          key={opt.value}
                          label={opt.label}
                          active={filters.minTrustScore === opt.value}
                          onClick={() => setFilters({ ...filters, minTrustScore: opt.value })}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Clear */}
                  <button
                    onClick={() => { setFilters(DEFAULT_FILTERS); setShowFilters(false); }}
                    className="text-xs font-bold text-destructive/70 hover:text-destructive transition-colors"
                  >
                    {t('clear_filters')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Location denied: city selector ── */}
        {locationState === 'denied' && !selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/60 rounded-[20px] p-5 mb-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                <LocateFixed size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{t('location_permission_title')}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {t('location_denied_subtitle')}
                </p>
              </div>
            </div>
            <div className="relative">
              <select
                className="w-full bg-secondary border border-border/60 rounded-xl px-4 py-3 text-sm font-bold text-foreground appearance-none cursor-pointer"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">{t('select_city')}</option>
                {SAUDI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* ── Requesting: spinner ── */}
        {locationState === 'requesting' && (
          <div className="space-y-3 mt-2">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        <AnimatePresence mode="wait">
          {locationState !== 'requesting' && view === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3 mt-2">
              {loading ? (
                [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              ) : merchants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <MapPin size={40} className="text-muted-foreground/30 mb-3" />
                  <p className="font-bold text-foreground text-sm">{t('no_nearby_merchants')}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{t('no_nearby_merchants_sub')}</p>
                </div>
              ) : (
                merchants.map((merchant, i) => (
                  <motion.div
                    key={merchant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <NearbyMerchantCard merchant={merchant} onClick={openProfile} />
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : locationState !== 'requesting' && view === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-[480px] bg-card rounded-[24px] border border-border/60 mt-2 overflow-hidden shadow-soft"
            >
              <NearbyMap
                userCoords={userCoords}
                merchants={merchants}
                onMerchantClick={openProfile}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="h-10" />
      </div>

      <MerchantProfileSheet
        merchant={selectedMerchant}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
      <BottomNav role="customer" />
    </div>
  );
}
