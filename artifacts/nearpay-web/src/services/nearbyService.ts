import {
  collection,
  doc,
  getDocs,
  updateDoc,
  GeoPoint,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MerchantDoc } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────
export const BUSINESS_TYPES = [
  'Grocery',
  'Restaurant',
  'Pharmacy',
  'Electronics',
  'Clothing',
  'Coffee',
  'Bakery',
  'Services',
  'Automotive',
  'Other',
] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const SAUDI_CITIES = [
  'Riyadh',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Al Khobar',
  'Taif',
  'Abha',
  'Hail',
  'Tabuk',
] as const;
export type SaudiCity = (typeof SAUDI_CITIES)[number];

// ─── Fetch all visible merchants ──────────────────────────────────────────────
// TODO: Replace client-side distance sort with GeoFirestore radius queries
//       once merchant count exceeds ~1000. Install geofirestore-js, add a
//       `geohash` field to each merchant doc (via updateMerchantGeoData), and
//       query `geoCollection(db).near({ center, radius })` instead of getDocs.
//       Reference: https://github.com/MichaelSolati/geofirestore-js
// Fetches all merchants that have coordinates set.
// isVisible flag is not required — any merchant with lat/lng appears in Discover.
export async function fetchVisibleMerchants(): Promise<MerchantDoc[]> {
  const snap = await getDocs(collection(db, 'merchants'));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as MerchantDoc))
    .filter((m) => m.latitude != null && m.longitude != null);
}

// ─── Save merchant geo / discovery data ──────────────────────────────────────
export interface MerchantGeoData {
  latitude: number;
  longitude: number;
  city: string;
  businessType: string;
  whatsapp?: string;
  description?: string;
  isVisible: boolean;
  workingHours?: { open: string; close: string };
}

export async function updateMerchantGeoData(
  merchantId: string,
  data: MerchantGeoData,
): Promise<void> {
  await updateDoc(doc(db, 'merchants', merchantId), {
    ...data,
    // GeoPoint stored for future GeoFirestore compatibility
    // TODO: also store geohash here for radius-query support
    geoPoint: new GeoPoint(data.latitude, data.longitude),
    updatedAt: serverTimestamp(),
  });
}
