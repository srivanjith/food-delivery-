import dotenv from 'dotenv';
dotenv.config();

/**
 * Calculates distance (in km) and estimated delivery time (in minutes)
 * between user coordinates and restaurant coordinates.
 * Falls back to Haversine distance if Google Maps API key is not configured.
 * 
 * @param {number} userLat 
 * @param {number} userLng 
 * @param {number} restLat 
 * @param {number} restLng 
 * @returns {Promise<{distance: number, duration: number, isSimulated: boolean}>}
 */
export async function calculateDistanceAndDeliveryTime(userLat, userLng, restLat, restLng) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Use default lat/lng if not provided/invalid
  const uLat = parseFloat(userLat) || 12.9716;
  const uLng = parseFloat(userLng) || 77.5946;
  const rLat = parseFloat(restLat) || 12.9279;
  const rLng = parseFloat(restLng) || 77.6271;

  // 1. Query OpenStreetMap OSRM Routing Engine (completely free & open source routing)
  try {
    console.log(`🌐 [GEO SERVICE] Querying OpenStreetMap OSRM routing engine...`);
    const url = `http://router.project-osrm.org/route/v1/driving/${rLng},${rLat};${uLng},${uLat}?overview=false`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes?.[0]) {
      const route = data.routes[0];
      const distanceKm = parseFloat((route.distance / 1000).toFixed(1));
      const durationMin = Math.round(route.duration / 60);

      console.log(`🌐 [GEO SERVICE] OpenStreetMap OSRM: ${distanceKm} km, ${durationMin} mins`);
      return {
        distance: distanceKm,
        duration: durationMin,
        isSimulated: false
      };
    } else {
      console.warn(`⚠️ [GEO SERVICE] OpenStreetMap OSRM returned code: ${data.code}. Falling back to Haversine...`);
    }
  } catch (error) {
    console.error(`🚨 [GEO SERVICE] OpenStreetMap OSRM API error:`, error.message);
  }

  // Fallback Haversine calculation (Great-circle distance)
  console.log(`🌱 [GEO SERVICE] Running Haversine distance simulation fallback...`);
  
  const R = 6371; // Earth radius in km
  const dLat = (rLat - uLat) * Math.PI / 180;
  const dLon = (rLng - uLng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(uLat * Math.PI / 180) * Math.cos(rLat * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distanceKm = parseFloat((R * c).toFixed(1));

  // If distance is 0 (due to matching coordinates or missing inputs), randomize to a realistic value
  if (distanceKm <= 0.05) {
    distanceKm = parseFloat((Math.random() * 4 + 0.5).toFixed(1));
  }

  // Estimate delivery time: base 15 mins + 5 mins per km + random traffic offset (0-5 mins)
  const durationMin = Math.round(15 + (distanceKm * 5) + (Math.random() * 5));

  console.log(`🌱 [GEO SERVICE] Simulated: ${distanceKm} km, ${durationMin} mins`);
  return {
    distance: distanceKm,
    duration: durationMin,
    isSimulated: true
  };
}
