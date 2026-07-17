// ─── Haversine distance formula ───────────────────────────────────────────────
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Returns distance in kilometres between two GPS coordinates. */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Human-readable distance string: "350m" or "3.2 km". */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Returns true if current time falls within open/close times (24-h "HH:MM"). */
export function isOpenNow(open: string, close: string): boolean {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;
  // Same-day hours
  if (closeMin > openMin) return nowMin >= openMin && nowMin < closeMin;
  // Overnight hours (e.g. 22:00–02:00)
  return nowMin >= openMin || nowMin < closeMin;
}
