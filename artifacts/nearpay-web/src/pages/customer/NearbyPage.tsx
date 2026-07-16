import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Map as MapIcon, SlidersHorizontal, Store } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { MerchantCard } from '../../components/MerchantCard';
import { mockNearbyMerchants } from '../../data/mock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CustomerNearbyPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'map'>('list');

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader 
        title="Discover" 
        subtitle="Find NearPay merchants nearby"
        action={
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-card border-border"
            onClick={() => setView(view === 'list' ? 'map' : 'list')}
          >
            {view === 'list' ? <MapIcon size={18} /> : <SlidersHorizontal size={18} />}
          </Button>
        }
      />
      
      <div className="page-scroll px-6 py-4">
        <div className="sticky top-0 z-30 bg-background pt-2 pb-4 -mt-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <Input
              type="text"
              placeholder="Search merchants or categories..."
              className="pl-11 h-12 rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {view === 'list' ? (
          <div className="space-y-4 mt-2">
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
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-[400px] bg-secondary rounded-[24px] border border-border mt-2 overflow-hidden flex items-center justify-center"
          >
            {/* Map Placeholder */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg mb-2 relative">
                <div className="absolute w-full h-full bg-primary rounded-full animate-ping opacity-50" />
                <Store size={24} />
              </div>
              <div className="bg-card text-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                You are here
              </div>
            </div>

            {/* Merchant Pins Placeholder */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background shadow-lg border-2 border-background">
              <Store size={14} />
            </div>
            <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background shadow-lg border-2 border-background">
              <Store size={14} />
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
