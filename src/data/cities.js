// Cities owners can pick in the listing form, with APPROXIMATE town-centre
// coordinates (±~1 km). Used only to show the cities near the chosen
// university. Names are stored on listings as-is, so never rename an entry.
import { findUniversity } from './universities';

export const CITIES = [
  // Western Province
  { name: 'Colombo', province: 'Western Province', lat: 6.9271, lng: 79.8612 },
  { name: 'Dehiwala-Mount Lavinia', province: 'Western Province', lat: 6.8402, lng: 79.8712 },
  { name: 'Ratmalana', province: 'Western Province', lat: 6.8200, lng: 79.8800 },
  { name: 'Moratuwa', province: 'Western Province', lat: 6.7730, lng: 79.8816 },
  { name: 'Kotte (Sri Jayewardenepura)', province: 'Western Province', lat: 6.8905, lng: 79.9020 },
  { name: 'Battaramulla', province: 'Western Province', lat: 6.8990, lng: 79.9180 },
  { name: 'Malabe', province: 'Western Province', lat: 6.9061, lng: 79.9580 },
  { name: 'Kolonnawa', province: 'Western Province', lat: 6.9330, lng: 79.8840 },
  { name: 'Kaduwela', province: 'Western Province', lat: 6.9330, lng: 79.9840 },
  { name: 'Maharagama', province: 'Western Province', lat: 6.8480, lng: 79.9265 },
  { name: 'Kottawa', province: 'Western Province', lat: 6.8410, lng: 79.9650 },
  { name: 'Kesbewa', province: 'Western Province', lat: 6.7953, lng: 79.9407 },
  { name: 'Boralesgamuwa', province: 'Western Province', lat: 6.8410, lng: 79.9020 },
  { name: 'Homagama', province: 'Western Province', lat: 6.8441, lng: 80.0026 },
  { name: 'Pitipana', province: 'Western Province', lat: 6.8213, lng: 80.0416 },
  { name: 'Piliyandala', province: 'Western Province', lat: 6.8018, lng: 79.9227 },
  { name: 'Nugegoda', province: 'Western Province', lat: 6.8649, lng: 79.8997 },
  { name: 'Gampaha', province: 'Western Province', lat: 7.0917, lng: 79.9997 },
  { name: 'Kadawatha', province: 'Western Province', lat: 7.0010, lng: 79.9530 },
  { name: 'Ragama', province: 'Western Province', lat: 7.0300, lng: 79.9200 },
  { name: 'Negombo', province: 'Western Province', lat: 7.2083, lng: 79.8358 },
  { name: 'Wattala', province: 'Western Province', lat: 6.9890, lng: 79.8930 },
  { name: 'Ja-Ela', province: 'Western Province', lat: 7.0744, lng: 79.8919 },
  { name: 'Kandana', province: 'Western Province', lat: 7.0480, lng: 79.8970 },
  { name: 'Kelaniya', province: 'Western Province', lat: 6.9553, lng: 79.9220 },
  { name: 'Minuwangoda', province: 'Western Province', lat: 7.1667, lng: 79.9500 },
  { name: 'Kalutara', province: 'Western Province', lat: 6.5854, lng: 79.9607 },
  { name: 'Panadura', province: 'Western Province', lat: 6.7132, lng: 79.9026 },
  { name: 'Beruwala', province: 'Western Province', lat: 6.4788, lng: 79.9828 },
  { name: 'Horana', province: 'Western Province', lat: 6.7159, lng: 80.0626 },
  // Central Province
  { name: 'Kandy', province: 'Central Province', lat: 7.2906, lng: 80.6337 },
  { name: 'Peradeniya', province: 'Central Province', lat: 7.2690, lng: 80.5940 },
  { name: 'Gampola', province: 'Central Province', lat: 7.1640, lng: 80.5770 },
  { name: 'Nawalapitiya', province: 'Central Province', lat: 7.0550, lng: 80.5320 },
  { name: 'Matale', province: 'Central Province', lat: 7.4675, lng: 80.6234 },
  { name: 'Dambulla', province: 'Central Province', lat: 7.8600, lng: 80.6517 },
  { name: 'Nuwara Eliya', province: 'Central Province', lat: 6.9497, lng: 80.7891 },
  { name: 'Hatton', province: 'Central Province', lat: 6.8916, lng: 80.5955 },
  // Southern Province
  { name: 'Galle', province: 'Southern Province', lat: 6.0535, lng: 80.2210 },
  { name: 'Unawatuna', province: 'Southern Province', lat: 6.0100, lng: 80.2490 },
  { name: 'Hikkaduwa', province: 'Southern Province', lat: 6.1395, lng: 80.1010 },
  { name: 'Matara', province: 'Southern Province', lat: 5.9549, lng: 80.5550 },
  { name: 'Weligama', province: 'Southern Province', lat: 5.9750, lng: 80.4290 },
  { name: 'Hambantota', province: 'Southern Province', lat: 6.1241, lng: 81.1185 },
  { name: 'Tangalle', province: 'Southern Province', lat: 6.0240, lng: 80.7940 },
  { name: 'Ambalangoda', province: 'Southern Province', lat: 6.2350, lng: 80.0540 },
  // Northern Province
  { name: 'Jaffna', province: 'Northern Province', lat: 9.6615, lng: 80.0255 },
  { name: 'Kilinochchi', province: 'Northern Province', lat: 9.3803, lng: 80.3770 },
  { name: 'Mullaitivu', province: 'Northern Province', lat: 9.2671, lng: 80.8142 },
  { name: 'Point Pedro', province: 'Northern Province', lat: 9.8167, lng: 80.2333 },
  { name: 'Chavakachcheri', province: 'Northern Province', lat: 9.6580, lng: 80.1600 },
  { name: 'Vavuniya', province: 'Northern Province', lat: 8.7514, lng: 80.4971 },
  { name: 'Mannar', province: 'Northern Province', lat: 8.9810, lng: 79.9044 },
  // Eastern Province
  { name: 'Batticaloa', province: 'Eastern Province', lat: 7.7170, lng: 81.7000 },
  { name: 'Chenkalady', province: 'Eastern Province', lat: 7.7830, lng: 81.5830 },
  { name: 'Trincomalee', province: 'Eastern Province', lat: 8.5874, lng: 81.2152 },
  { name: 'Ampara', province: 'Eastern Province', lat: 7.2975, lng: 81.6820 },
  { name: 'Kalmunai', province: 'Eastern Province', lat: 7.4167, lng: 81.8167 },
  { name: 'Oluvil', province: 'Eastern Province', lat: 7.2830, lng: 81.8530 },
  { name: 'Akkaraipattu', province: 'Eastern Province', lat: 7.2167, lng: 81.8500 },
  // North Western Province
  { name: 'Kurunegala', province: 'North Western Province', lat: 7.4863, lng: 80.3647 },
  { name: 'Puttalam', province: 'North Western Province', lat: 8.0362, lng: 79.8283 },
  { name: 'Chilaw', province: 'North Western Province', lat: 7.5758, lng: 79.7953 },
  { name: 'Kuliyapitiya', province: 'North Western Province', lat: 7.4688, lng: 80.0401 },
  // North Central Province
  { name: 'Anuradhapura', province: 'North Central Province', lat: 8.3114, lng: 80.4037 },
  { name: 'Polonnaruwa', province: 'North Central Province', lat: 7.9403, lng: 81.0188 },
  { name: 'Mihintale', province: 'North Central Province', lat: 8.3590, lng: 80.5100 },
  // Uva Province
  { name: 'Badulla', province: 'Uva Province', lat: 6.9934, lng: 81.0550 },
  { name: 'Bandarawela', province: 'Uva Province', lat: 6.8290, lng: 80.9900 },
  { name: 'Ella', province: 'Uva Province', lat: 6.8667, lng: 81.0466 },
  { name: 'Monaragala', province: 'Uva Province', lat: 6.8728, lng: 81.3507 },
  { name: 'Wellawaya', province: 'Uva Province', lat: 6.7381, lng: 81.1028 },
  // Sabaragamuwa Province
  { name: 'Ratnapura', province: 'Sabaragamuwa Province', lat: 6.6828, lng: 80.3992 },
  { name: 'Kegalle', province: 'Sabaragamuwa Province', lat: 7.2513, lng: 80.3464 },
  { name: 'Balangoda', province: 'Sabaragamuwa Province', lat: 6.6470, lng: 80.7020 },
  { name: 'Belihuloya', province: 'Sabaragamuwa Province', lat: 6.7170, lng: 80.7700 },
  { name: 'Embilipitiya', province: 'Sabaragamuwa Province', lat: 6.3439, lng: 80.8490 },
];

export const PROVINCES = [...new Set(CITIES.map((c) => c.province))];

const kmBetween = (a, b) => {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

/**
 * Cities within `radiusKm` of a university, nearest first, as [{ name, km }].
 * Always returns at least `minCount` cities so remote campuses still get a list.
 * Returns null when the university is unknown or has no single campus location
 * (the form then shows every city).
 */
export const citiesNearUniversity = (universityName, radiusKm = 15, minCount = 4) => {
  const uni = findUniversity(universityName);
  if (!uni || uni.lat == null || uni.lng == null) return null;
  const sorted = CITIES
    .map((c) => ({ name: c.name, km: kmBetween(uni, c) }))
    .sort((a, b) => a.km - b.km);
  const near = sorted.filter((c) => c.km <= radiusKm);
  return (near.length >= minCount ? near : sorted.slice(0, minCount))
    .map((c) => ({ name: c.name, km: Math.max(1, Math.round(c.km)) }));
};
