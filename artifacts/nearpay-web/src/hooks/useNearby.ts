import { useState, useEffect } from 'react';
import { fetchVisibleMerchants } from '../services/nearbyService';
import { haversineDistance, isOpenNow } from '../lib/geo';
import { DiscoverableMerchant } from '../types';

export type LocationState = 'requesting' | 'granted' | 'denied';

export interface NearbyFilters {
  businessType: string;  // '' = all
  maxDistanceKm: number; // 0 = any
  minTrustScore: number; // 0 = any
  openNow: boolean;
  city: string;          // '' = any
}

export const DEFAULT_FILTERS: NearbyFilters = {
  businessType: '',
  maxDistanceKm: 0,
  minTrustScore: 0,
  openNow: false,
  city: '',
};

export function useNearby(initialCoords?: { lat: number; lng: number }) {
  const [locationState, setLocationState] = useState<LocationState>('requesting');
  const [userCoords, setUserCoords]       = useState<{ lat: number; lng: number } | null>(initialCoords ?? null);
  const [selectedCity, setSelectedCity]   = useState('');
  const [allMerchants, setAllMerchants]   = useState<DiscoverableMerchant[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [filters, setFilters]             = useState<NearbyFilters>(DEFAULT_FILTERS);

  // ── 1. Request geolocation permission ───────────────────────────────────────
  useEffect(() => {
    if (initialCoords) {
      setLocationState('granted');
      return;
    }
    if (!navigator.geolocation) {
      setLocationState('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationState('granted');
      },
      () => setLocationState('denied'),
      { timeout: 8000, maximumAge: 60_000 },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Fetch merchants once location state resolves ──────────────────────────
  useEffect(() => {
    if (locationState === 'requesting') return;
    setLoading(true);
    fetchVisibleMerchants()
      .then((raw) => {
        const withDist: DiscoverableMerchant[] = raw.map((m) => ({
          ...m,
          distance:
            userCoords && m.latitude != null && m.longitude != null
              ? haversineDistance(userCoords.lat, userCoords.lng, m.latitude!, m.longitude!)
              : undefined,
        }));
        // Sort: nearest first; unknown-distance merchants go to the end
        withDist.sort((a, b) => {
          if (a.distance == null && b.distance == null) return 0;
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return a.distance - b.distance;
        });
        setAllMerchants(withDist);
      })
      .finally(() => setLoading(false));
  }, [locationState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. Apply search + filters client-side ────────────────────────────────────
  const merchants = allMerchants.filter((m) => {
    if (search) {
      const q = search.toLowerCase();
      const nameMatch =
        m.businessName?.toLowerCase().includes(q) ||
        m.name?.toLowerCase().includes(q) ||
        m.businessType?.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q);
      if (!nameMatch) return false;
    }
    if (filters.businessType && m.businessType !== filters.businessType) return false;
    if (filters.maxDistanceKm > 0 && m.distance != null && m.distance > filters.maxDistanceKm) return false;
    if (filters.minTrustScore > 0 && (m.trustScore ?? 0) < filters.minTrustScore) return false;
    if (filters.city && m.city !== filters.city) return false;
    if (filters.openNow && m.workingHours) {
      if (!isOpenNow(m.workingHours.open, m.workingHours.close)) return false;
    }
    return true;
  });

  return {
    locationState,
    userCoords,
    selectedCity,
    setSelectedCity: (city: string) => {
      setSelectedCity(city);
      setFilters((f) => ({ ...f, city }));
    },
    loading,
    merchants,
    allMerchants,
    search,
    setSearch,
    filters,
    setFilters,
  };
}
