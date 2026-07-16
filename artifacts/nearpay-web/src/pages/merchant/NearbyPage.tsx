import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, SlidersHorizontal, Store } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { MerchantCard } from '../../components/MerchantCard';
import { mockNearbyMerchants } from '../../data/mock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MerchantNearbyPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'map'>('list');

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader 
        title="Explore" 
        subtitle="Local neighborhood network"
        action={
          <div className="flex bg-secondary p-1 rounded-xl">
            <button 
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              <SlidersHorizontal size={16} />
            </button>
            <button 
              onClick={() => setView('map')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'map' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              <MapIcon size={16} />
            </button>
          </div>
        }
      />
      
      <div className="page-scroll px-6 py-4 bg-secondary/30">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-4 -mt-4 mx-[-24px] px-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={20} />
            </div>
            <Input
              type="text"
              placeholder="Find merchants or categories..."
              className="pl-12 h-14 rounded-2xl bg-card border border-border focus-visible:ring-1 focus-visible:ring-primary shadow-sm text-base font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 mt-2"
            >
              {mockNearbyMerchants.map((merchant, i) => (
                <motion.div
                  key={merchant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MerchantCard {...merchant} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full h-[500px] bg-card rounded-[24px] border border-border mt-2 overflow-hidden flex items-center justify-center shadow-soft"
            >
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              {/* Fake Roads */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100 Q 200 150 400 50" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d="M150 0 L 250 500" stroke="currentColor" strokeWidth="8" fill="none" />
                <path d="M0 300 Q 150 250 400 400" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round" />
              </svg>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg mb-2 relative border-4 border-background">
                  <div className="absolute w-full h-full bg-primary rounded-full animate-ping opacity-40" />
                  <Store size={24} />
                </div>
                <div className="bg-foreground text-background px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                  Your Store
                </div>
              </div>

              {/* Merchant Pins Placeholder */}
              <div className="absolute top-[20%] left-[20%] flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform">
                <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background shadow-lg border-2 border-background">
                  <span className="text-[10px] font-bold tracking-tighter">0.5k</span>
                </div>
              </div>
              <div className="absolute bottom-[30%] right-[25%] flex flex-col items-center transform translate-x-1/2 translate-y-1/2 cursor-pointer hover:scale-110 transition-transform">
                <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background shadow-lg border-2 border-background">
                  <span className="text-[10px] font-bold tracking-tighter">1.2k</span>
                </div>
              </div>
              <div className="absolute top-[60%] left-[30%] flex flex-col items-center transform translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-success-foreground shadow-lg border-2 border-background">
                  <span className="text-[10px] font-bold tracking-tighter">New</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-10" />
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}