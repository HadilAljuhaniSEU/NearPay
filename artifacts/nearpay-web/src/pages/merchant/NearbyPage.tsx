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

export default function MerchantNearbyPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'map'>('list');
  const t = useT();

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title={t('explore_title')}
        subtitle={t('explore_sub')}
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

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3 mt-2">
              {mockNearbyMerchants.map((merchant, i) => (
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
              <svg className="absolute inset-0 w-full h-full opacity-8" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100 Q 200 150 400 50" stroke="#0B2341" strokeWidth="10" fill="none" strokeLinecap="round" />
                <path d="M150 0 L 250 500" stroke="#0B2341" strokeWidth="7" fill="none" />
                <path d="M0 300 Q 150 250 400 400" stroke="#0B2341" strokeWidth="8" fill="none" strokeLinecap="round" />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg mb-2 relative border-4 border-background"
                     style={{ background: 'linear-gradient(135deg, #0B2341, #143B63)' }}>
                  <div className="absolute w-full h-full rounded-full animate-ping opacity-30"
                       style={{ background: '#2ED8C3' }} />
                  <Store size={22} />
                </div>
                <div className="bg-foreground text-background px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-md uppercase tracking-wider">
                  {t('your_store')}
                </div>
              </div>
              {[
                { top: '20%', left: '20%', label: '0.5k' },
                { bottom: '30%', right: '25%', label: '1.2k' },
                { top: '60%', left: '35%', label: '↑' },
              ].map((pin, i) => (
                <div key={i} className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                     style={{ top: (pin as any).top, left: (pin as any).left, bottom: (pin as any).bottom, right: (pin as any).right, transform: 'translate(-50%, -50%)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-background text-[10px] font-bold"
                       style={{ background: '#0B2341' }}>
                    {pin.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-10" />
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
