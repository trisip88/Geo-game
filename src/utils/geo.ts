export const MAP_SVG_WIDTH = 1000;
export const MAP_SVG_HEIGHT = 500;
export const BULLSEYE_RADIUS_KM = 25;
export const SCORING_SCALE_KM = 1500;
export const MAX_POINTS_PER_ROUND = 5000;

/**
 * Calculates Great-Circle distance between two points using Haversine formula on WGS84 sphere.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Scoring formula:
 * points = 5000 * exp(-distance_km / 1500)
 * Within 25 km => 5000
 */
export function calculatePoints(distanceKm: number): number {
  if (distanceKm <= BULLSEYE_RADIUS_KM) {
    return MAX_POINTS_PER_ROUND;
  }
  const pts = MAX_POINTS_PER_ROUND * Math.exp(-distanceKm / SCORING_SCALE_KM);
  return Math.max(1, Math.round(pts));
}

/**
 * Converts Lon/Lat to Equirectangular SVG coordinates (1000 x 500)
 */
export function geoToSvgCoords(
  lat: number,
  lon: number,
  width = MAP_SVG_WIDTH,
  height = MAP_SVG_HEIGHT
): { x: number; y: number } {
  // lon in [-180, 180] -> x in [0, width]
  // lat in [-90, 90]   -> y in [0, height] (North is y=0, South is y=height)
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

/**
 * Converts Equirectangular SVG coordinates back to WGS84 Lat/Lon
 */
export function svgCoordsToGeo(
  x: number,
  y: number,
  width = MAP_SVG_WIDTH,
  height = MAP_SVG_HEIGHT
): { lat: number; lon: number } {
  const lon = (x / width) * 360 - 180;
  const lat = 90 - (y / height) * 180;
  // Clamp boundaries safely
  const clampedLat = Math.max(-90, Math.min(90, Math.round(lat * 1000) / 1000));
  const clampedLon = Math.max(-180, Math.min(180, Math.round(lon * 1000) / 1000));
  return { lat: clampedLat, lon: clampedLon };
}

/**
 * Formats decimal latitude and longitude into human-readable cardinal format
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
}

/**
 * Calculates initial compass bearing from point A to point B
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  let brng = (toDeg(Math.atan2(y, x)) + 360) % 360;

  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(brng / 22.5) % 16;
  return directions[index];
}

/**
 * Generates an SVG curved arc or dashed geodesic path between two coordinate points
 */
export function getGreatCircleSvgPath(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  width = MAP_SVG_WIDTH,
  height = MAP_SVG_HEIGHT
): string {
  const start = geoToSvgCoords(startLat, startLon, width, height);
  const end = geoToSvgCoords(endLat, endLon, width, height);

  // If the points cross the antimeridian (wrap around x)
  const dx = end.x - start.x;
  if (Math.abs(dx) > width / 2) {
    // Render straight connector or segmented path
    return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} L ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
  }

  // Slight quadratic bezier curve for aesthetic elevation
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2 - Math.min(40, Math.abs(dx) * 0.15);

  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}

/**
 * Strips and redacts the place name, country, and related keywords from Wikipedia text
 */
export function redactSnippet(
  text: string,
  placeName: string,
  countryName: string,
  wikiTitle?: string
): string {
  if (!text) return '';

  // Collect target words and phrases to redact
  const keywords = new Set<string>();

  // Add full phrases
  keywords.add(placeName);
  keywords.add(countryName);
  if (wikiTitle) {
    keywords.add(wikiTitle.replace(/_/g, ' '));
  }

  // Add individual words longer than 2 characters
  const splitWords = `${placeName} ${countryName} ${wikiTitle || ''}`
    .split(/[\s,()/-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2);

  splitWords.forEach((w) => keywords.add(w));

  let redacted = text;

  // Sort by length descending so longer phrases match first
  const sortedKeywords = Array.from(keywords).sort(
    (a, b) => b.length - a.length
  );

  sortedKeywords.forEach((kw) => {
    if (!kw || kw.length < 2) return;
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}(?:'s|s|ian|ese|er|ic|ite)?\\b`, 'gi');
    redacted = redacted.replace(regex, (match) => {
      // Return solid censor blocks matching approximate length
      const blockLength = Math.max(3, match.length);
      return '█'.repeat(blockLength);
    });
  });

  return redacted;
}
