import { LiveFeedData, Place } from '../types';
import { redactSnippet } from '../utils/geo';

export interface GeocodeResult {
  name: string;
  country?: string;
  lat: number;
  lon: number;
  displayName: string;
  source: 'photon' | 'nominatim';
}

/**
 * Probes the live open endpoints to check if CORS and network allow real-time feed
 */
export async function probeLiveEndpoints(): Promise<{
  wikipediaOk: boolean;
  openverseOk: boolean;
  openLibraryOk: boolean;
  overallStatus: 'online' | 'bundled';
  latencyMs: number;
}> {
  const startTime = Date.now();
  let wikipediaOk = false;
  let openverseOk = false;
  let openLibraryOk = false;

  try {
    const wikiRes = await fetch(
      'https://en.wikipedia.org/api/rest_v1/page/summary/Singapore',
      { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(4000) }
    );
    if (wikiRes.ok) {
      const data = await wikiRes.json();
      if (data.title) wikipediaOk = true;
    }
  } catch {
    wikipediaOk = false;
  }

  try {
    const ovRes = await fetch(
      'https://api.openverse.org/v1/images/?q=singapore&page_size=1',
      { signal: AbortSignal.timeout(4000) }
    );
    if (ovRes.ok) {
      const data = await ovRes.json();
      if (data.results && data.results.length > 0) openverseOk = true;
    }
  } catch {
    openverseOk = false;
  }

  try {
    const olRes = await fetch(
      'https://openlibrary.org/search.json?q=singapore&limit=1&fields=title',
      { signal: AbortSignal.timeout(4000) }
    );
    if (olRes.ok) openLibraryOk = true;
  } catch {
    openLibraryOk = false;
  }

  const latencyMs = Date.now() - startTime;
  const overallStatus = wikipediaOk ? 'online' : 'bundled';

  return {
    wikipediaOk,
    openverseOk,
    openLibraryOk,
    overallStatus,
    latencyMs,
  };
}

/**
 * Fetches Wikipedia Summary with automated redaction
 */
export async function fetchWikipediaSummary(
  wikiTitle: string,
  placeName: string,
  countryName: string
): Promise<{
  extract: string;
  redactedExtract: string;
  pageUrl: string;
  thumbnailUrl?: string;
  description?: string;
} | null> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      wikiTitle.replace(/ /g, '_')
    )}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Summary/1.4.2"',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const rawExtract = data.extract || '';
    const redacted = redactSnippet(rawExtract, placeName, countryName, wikiTitle);

    return {
      extract: rawExtract,
      redactedExtract: redacted,
      pageUrl:
        data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`,
      thumbnailUrl: data.thumbnail?.source,
      description: data.description,
    };
  } catch {
    return null;
  }
}

/**
 * Fetches CC-licensed images from Openverse
 */
export async function fetchOpenverseImage(
  query: string
): Promise<{
  url: string;
  creator: string;
  license: string;
  licenseUrl?: string;
  title: string;
  sourceUrl: string;
} | null> {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(
      query
    )}&page_size=5`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    // Pick top high quality image
    const item = data.results[0];
    return {
      url: item.url,
      creator: item.creator || 'Openverse Contributor',
      license: (item.license || 'CC').toUpperCase(),
      licenseUrl: item.license_url,
      title: item.title || query,
      sourceUrl: item.foreign_landing_url || `https://openverse.org/image/${item.id}`,
    };
  } catch {
    return null;
  }
}

/**
 * Fetches related literature from OpenLibrary
 */
export async function fetchOpenLibraryBooks(
  keyword: string
): Promise<Array<{ title: string; author?: string; year?: number }>> {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      keyword
    )}&limit=4&fields=title,author_name,first_publish_year`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data.docs) return [];

    return data.docs.slice(0, 3).map((doc: { title: string; author_name?: string[]; first_publish_year?: number }) => ({
      title: doc.title,
      author: doc.author_name ? doc.author_name[0] : undefined,
      year: doc.first_publish_year,
    }));
  } catch {
    return [];
  }
}

/**
 * Loads all live or bundled data for a place
 */
export async function loadPlaceLiveFeed(place: Place): Promise<LiveFeedData> {
  // Parallel fetch live sources
  const [wikiData, openverseData, booksData] = await Promise.allSettled([
    fetchWikipediaSummary(place.wikipediaTitle, place.name, place.country),
    fetchOpenverseImage(place.name),
    fetchOpenLibraryBooks(place.literatureKeywords || place.name),
  ]);

  const wiki = wikiData.status === 'fulfilled' && wikiData.value ? wikiData.value : undefined;
  const ov = openverseData.status === 'fulfilled' && openverseData.value ? openverseData.value : undefined;
  const books = booksData.status === 'fulfilled' && booksData.value ? booksData.value : [];

  // Fallback to bundled cache if network failed
  const fallbackExtract = place.cachedExtract || '';
  const finalWiki = wiki || {
    extract: fallbackExtract,
    redactedExtract: redactSnippet(fallbackExtract, place.name, place.country, place.wikipediaTitle),
    pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(place.wikipediaTitle)}`,
  };

  const finalOv = ov || (place.cachedImage ? {
    url: place.cachedImage.url,
    creator: place.cachedImage.creator,
    license: place.cachedImage.license,
    licenseUrl: place.cachedImage.licenseUrl,
    title: place.cachedImage.title || place.name,
    sourceUrl: place.cachedImage.sourceUrl || 'https://openverse.org',
  } : undefined);

  return {
    wikipedia: finalWiki,
    openverse: finalOv,
    openLibrary: { books },
    loading: false,
  };
}

/**
 * Geocode query using Photon (Komoot / OpenStreetMap)
 */
export async function geocodePhoton(query: string): Promise<GeocodeResult[]> {
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.features) return [];

    return data.features.map((f: { geometry: { coordinates: [number, number] }; properties: { name: string; country?: string; city?: string; state?: string } }) => {
      const [lon, lat] = f.geometry.coordinates;
      const p = f.properties;
      const parts = [p.name, p.city, p.state, p.country].filter(Boolean);
      return {
        name: p.name || query,
        country: p.country,
        lat,
        lon,
        displayName: parts.join(', '),
        source: 'photon' as const,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Geocode query using OpenStreetMap Nominatim
 */
export async function geocodeNominatim(query: string): Promise<GeocodeResult[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=5`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data.map((item: { display_name: string; lat: string; lon: string }) => ({
      name: item.display_name.split(',')[0],
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      displayName: item.display_name,
      source: 'nominatim' as const,
    }));
  } catch {
    return [];
  }
}
