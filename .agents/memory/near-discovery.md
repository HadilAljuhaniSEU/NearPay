---
name: Near / Discovery architecture
description: How the location-aware merchant discovery feature is built in NearPay Web
---

## MerchantDoc geo fields (all optional, backward-compatible)
```ts
latitude?: number; longitude?: number; businessType?: string;
whatsapp?: string; isVisible?: boolean;
workingHours?: { open: string; close: string }; // "HH:MM" 24-h
description?: string;
geoPoint?: GeoPoint; // stored alongside lat/lng for future GeoFirestore
```
`DiscoverableMerchant extends MerchantDoc` adds `distance?: number` (km, computed client-side).

## Files created
- `src/lib/geo.ts` — haversineDistance, formatDistance, isOpenNow
- `src/services/nearbyService.ts` — fetchVisibleMerchants (isVisible==true), updateMerchantGeoData, BUSINESS_TYPES, SAUDI_CITIES constants
- `src/hooks/useNearby.ts` — location permission, GPS or city fallback, fetch + sort + filter
- `src/components/NearbyMerchantCard.tsx` — card with real WhatsApp/Call/Navigate actions
- `src/components/MerchantProfileSheet.tsx` — bottom sheet with full merchant details
- `src/components/NearbyMap.tsx` — @react-google-maps/api wrapper with no-key fallback

## Google Maps
Package: `@react-google-maps/api`. Key: `VITE_GOOGLE_MAPS_KEY` environment variable.
If not set, NearbyMap renders a styled "Map Not Available" placeholder — no crash.

## GeoFirestore future path
`nearbyService.ts` contains TODO comments: when merchant count > ~1000, replace getDocs with GeoFirestore radius query. Also store `geohash` field alongside `geoPoint` on each merchant doc.

## Firestore query
`fetchVisibleMerchants` queries `where('isVisible','==',true)` — no geobounds filtering yet.
Distance sort happens client-side in `useNearby.ts`.

## Settings location section
Merchant SettingsPage has a "Location & Discovery" section that:
- Gets GPS via navigator.geolocation
- Saves lat/lng, city, businessType, whatsapp, description, workingHours, isVisible
- Calls updateMerchantGeoData which also writes a GeoPoint field

**Why:** GeoPoint stored in parallel with flat lat/lng so GeoFirestore can be added later without a migration.
