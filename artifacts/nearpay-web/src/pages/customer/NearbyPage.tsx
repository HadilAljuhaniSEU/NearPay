import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, SlidersHorizontal, Store } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { MerchantCard } from '../../components/MerchantCard';
import { mockNearbyMerchants } from '../../data/mock';
import { Input } from '@/components/ui/input';
import { useT } from '../../contexts/LanguageContext';

export default function CustomerNearbyPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'map'>('list');
  const t = useT();

  const filtered = mockNearbyMerchants.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title={t('discover_title')}
        subtitle={t('discover_sub')}
        action={
          <div className="flex bg-secondary p-1 rounded-xl">
            <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              <SlidersHorizontal size={15} />
            </button>
            <button onClick={() => setView('map')} className={`p-1.5 rounded-lg transition-colors ${view === 'map' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              <MapIcon size={15} />
            </button>
          </div>
        }
      />

      <div className="page-scroll px-5 py-4">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-3 -mt-4 mx-[-20px] px-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={17} />
            </div>
            <Input
              type="text"
              placeholder={t('search_places')}
              className="pl-12 h-13 rounded-2xl bg-card border border-border/60 shadow-sm text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3 mt-2">
              {filtered.map((merchant, i) => (
                <motion.div key={merchant.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <MerchantCard {...merchant} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="map" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full h-[480px] bg-card rounded-[24px] border border-border/60 mt-2 overflow-hidden flex items-center justify-center shadow-soft">
              <div className="absolute inset-0 opacity-[0.025]"
                   style={{ backgroundImage: 'linear-gradient(to right, #0B2341 1px, transparent 1px), linear-gradient(to bottom, #0B2341 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg mb-2 relative border-[3px] border-background"
                     style={{ background: 'linear-gradient(135deg, #2ED8C3, #19B8D3)' }}>
                  <div className="absolute w-full h-full rounded-full animate-ping opacity-40"
                       style={{ background: '#2ED8C3' }} />
                </div>
                <div className="bg-foreground text-background px-3 py-1 rounded-lg text-[10px] font-bold shadow-md uppercase tracking-wider">
                  {t('you_label')}
                </div>
              </div>
              {[
                { top: '25%', left: '25%' },
                { bottom: '35%', right: '20%' },
                { top: '65%', left: '40%' },
              ].map((pin, i) => (
                <div key={i} className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                     style={{ ...pin, transform: 'translate(-50%, -50%)' }}>
                  <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-foreground shadow-lg border-2 border-border/60">
                    <Store size={17} className="text-primary" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-10" />
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
