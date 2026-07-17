import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, SlidersHorizontal, MapPin, Settings } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { NearbyMerchantCard } from '../../components/NearbyMerchantCard';
import { MerchantProfileSheet } from '../../components/MerchantProfileSheet';
import { NearbyMap } from '../../components/NearbyMap';
import { Input } from '@/components/ui/input';
import { useT } from '../../contexts/LanguageContext';
import { useNearby } from '../../hooks/useNearby';
import { useAuth } from '../../hooks/useAuth';
import { fetchMerchantByOwner } from '../../services/merchantService';
import { DiscoverableMerchant, MerchantDoc } from '../../types';
import { SkeletonCard } from '../../components/SkeletonCard';
import { useLocation } from 'wouter';

export default function MerchantNearbyPage() {
  const t = useT();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selectedMerchant, setSelectedMerchant] = useState<DiscoverableMerchant | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [myMerchant, setMyMerchant] = useState<MerchantDoc | null>(null);

  // Load this merchant's own doc to get their coordinates
  useEffect(() => {
    if (!user?.uid) return;
    fetchMerchantByOwner(user.uid).then(setMyMerchant);
  }, [user?.uid]);

  const merchantCoords =
    myMerchant?.latitude != null && myMerchant?.longitude != null
      ? { lat: myMerchant.latitude, lng: myMerchant.longitude }
      : undefined;

  const { loading, merchants, search, setSearch } = useNearby(merchantCoords);

  // Exclude own store from peer list
  const peers = merchants.filter((m) => m.id !== myMerchant?.id);

  const openProfile = (m: DiscoverableMerchant) => {
    setSelectedMerchant(m);
    setSheetOpen(true);
  };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title={t('explore_title')}
        subtitle={t('explore_sub')}
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
        {/* Search bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-3 -mt-4 mx-[-20px] px-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <Input
              type="text"
              placeholder={t('search_merchants')}
              className="pl-12 h-13 rounded-2xl bg-card border border-border/60 shadow-sm text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* No location set prompt */}
        {!merchantCoords && myMerchant && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/60 rounded-[20px] p-5 mb-4 shadow-sm flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm">{t('no_location_set_merchant')}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{t('set_location_prompt')}</p>
            </div>
            <button
              onClick={() => setLocation('/merchant/settings')}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Settings size={16} />
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3 mt-2">
              {loading ? (
                [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              ) : peers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <MapPin size={40} className="text-muted-foreground/30 mb-3" />
                  <p className="font-bold text-foreground text-sm">{t('no_nearby_merchants')}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{t('no_nearby_merchants_sub')}</p>
                </div>
              ) : (
                peers.map((merchant, i) => (
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
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-[480px] bg-card rounded-[24px] border border-border/60 mt-2 overflow-hidden shadow-soft"
            >
              <NearbyMap
                userCoords={merchantCoords ?? null}
                merchants={peers}
                onMerchantClick={openProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-10" />
      </div>

      <MerchantProfileSheet
        merchant={selectedMerchant}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
      <BottomNav role="merchant" />
    </div>
  );
}
