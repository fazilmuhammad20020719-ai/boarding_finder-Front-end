// Ranks boarding places by closeness to a reference point: the student's
// location ("near me") or a selected university. Pure functions so Home and
// Search behave identically.
import { findUniversity } from '../data/universities';

export const RADIUS_OPTIONS_KM = [1, 2, 5, 10, 20];
export const DEFAULT_RADIUS_KM = 5;

// The listing form's default pin (central Colombo). A listing still sitting
// exactly here never had its pin placed, so its coordinates mean nothing.
const DEFAULT_PIN = { lat: 6.9271, lng: 79.8612 };

// Owner-entered "distance to university" bands → representative km
const BAND_KM = {
  'Less than 100m': 0.1, '100m - 300m': 0.3, '300m - 500m': 0.5, '500m - 1km': 1,
  '1km - 2km': 2, '2km - 3km': 3, '3km - 5km': 5, '5km - 10km': 10, 'More than 10km': 15,
};

/** Great-circle distance in km. */
export function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Usable map position of a listing, or null (missing / never-placed pin). */
export function listingPosition(listing) {
  const lat = Number(listing.lat ?? listing.latitude);
  const lng = Number(listing.lng ?? listing.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return null;
  if (Math.abs(lat - DEFAULT_PIN.lat) < 1e-4 && Math.abs(lng - DEFAULT_PIN.lng) < 1e-4) return null;
  return { lat, lng };
}

/**
 * Reference point: { type: 'me', lat, lng } or { type: 'university', name }.
 * Returns the best distance estimate in km (or null), and how it was found.
 */
export function distanceFrom(listing, ref) {
  if (!ref) return { km: null, how: null };
  const pos = listingPosition(listing);
  if (ref.type === 'me') {
    return pos ? { km: haversineKm(pos, ref), how: 'map' } : { km: null, how: null };
  }
  if (ref.type === 'university') {
    // The owner's own "nearest university + distance" is the most reliable signal
    if (listing.universityName === ref.name && BAND_KM[listing.distanceBand] !== undefined) {
      return { km: BAND_KM[listing.distanceBand], how: 'owner' };
    }
    const uni = findUniversity(ref.name);
    if (pos && uni && uni.lat != null) return { km: haversineKm(pos, uni), how: 'map' };
    if (listing.universityName === ref.name) return { km: null, how: 'owner' }; // same uni, distance unknown
  }
  return { km: null, how: null };
}

/**
 * Split listings into "nearby" (within radius, or the owner named that
 * university) and "others", each sorted nearest first (unknown distance last).
 */
export function splitByProximity(listings, ref, radiusKm = DEFAULT_RADIUS_KM) {
  const withDistance = listings.map((l) => {
    const d = distanceFrom(l, ref);
    return { ...l, distanceKm: d.km, distanceHow: d.how };
  });
  if (!ref) return { nearby: [], others: withDistance };

  const isNearby = (l) =>
    (l.distanceKm !== null && l.distanceKm <= radiusKm) ||
    (ref.type === 'university' && l.universityName === ref.name && l.distanceKm === null);

  const byDistance = (a, b) => {
    if (a.distanceKm === null && b.distanceKm === null) return 0;
    if (a.distanceKm === null) return 1;
    if (b.distanceKm === null) return -1;
    return a.distanceKm - b.distanceKm;
  };

  return {
    nearby: withDistance.filter(isNearby).sort(byDistance),
    others: withDistance.filter((l) => !isNearby(l)).sort(byDistance),
  };
}

/** "350 m" / "2.4 km" / "" */
export function formatKm(km) {
  if (km === null || km === undefined) return '';
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

/** City / area part of "12 Test Road, Mihintale" → "Mihintale" */
export const cityOf = (location = '') => String(location).split(',').pop().trim();
