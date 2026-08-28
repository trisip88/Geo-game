import React, { useState } from 'react';
import {
  geocodePhoton,
  fetchWikipediaSummary,
  fetchOpenverseImage,
  fetchOpenLibraryBooks,
  GeocodeResult,
} from '../services/apiService';
import { Place } from '../types';
import {
  FlaskConical,
  X,
  Search,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Scroll,
} from 'lucide-react';

interface PlaceAuthoringModalProps {
  onClose: () => void;
  onAddCustomPlace?: (place: Place) => void;
}

export const PlaceAuthoringModal: React.FC<PlaceAuthoringModalProps> = ({
  onClose,
  onAddCustomPlace,
}) => {
  const [query, setQuery] = useState('Singapore');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [selectedGeocode, setSelectedGeocode] = useState<GeocodeResult | null>(null);

  const [wikiData, setWikiData] = useState<{
    extract: string;
    redactedExtract: string;
    pageUrl: string;
  } | null>(null);

  const [imageData, setImageData] = useState<{
    url: string;
    creator: string;
    license: string;
    licenseUrl?: string;
    title: string;
    sourceUrl: string;
  } | null>(null);

  const [booksData, setBooksData] = useState<
    Array<{ title: string; author?: string; year?: number }>
  >([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // 1. Geocode via Photon
      const geo = await geocodePhoton(query.trim());
      setGeocodeResults(geo);
      if (geo.length > 0) {
        setSelectedGeocode(geo[0]);
      }

      // 2. Fetch Wikipedia Summary
      const wiki = await fetchWikipediaSummary(
        query.trim().replace(/ /g, '_'),
        query.trim(),
        geo[0]?.country || ''
      );
      setWikiData(wiki);

      // 3. Fetch Openverse image
      const img = await fetchOpenverseImage(query.trim());
      setImageData(img);

      // 4. Fetch OpenLibrary books
      const books = await fetchOpenLibraryBooks(query.trim());
      setBooksData(books);
    } catch {
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  // Generated Place Bank JSON Snippet
  const generatedPlaceObject: Place = {
    id: query.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: selectedGeocode ? selectedGeocode.name : query,
    country: selectedGeocode?.country || 'Unknown',
    lat: selectedGeocode ? selectedGeocode.lat : 0,
    lon: selectedGeocode ? selectedGeocode.lon : 0,
    wikipediaTitle: query.replace(/ /g, '_'),
    clues: [
      'Hemisphere, latitude band, climate, or terrain description.',
      'Regional history, culture, or economic significance.',
      'Famous landmark, iconic geography, or nickname giveaway.',
    ],
    cachedExtract: wikiData?.extract || '',
    cachedImage: imageData
      ? {
          url: imageData.url,
          creator: imageData.creator,
          license: imageData.license,
          licenseUrl: imageData.licenseUrl,
          sourceUrl: imageData.sourceUrl,
          title: imageData.title,
        }
      : undefined,
    literatureKeywords: query.toLowerCase(),
  };

  const jsonString = JSON.stringify(generatedPlaceObject, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl animate-scaleUp text-slate-800 my-6 max-h-[90vh] flex flex-col border-b-8 border-indigo-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-yellow-400 text-indigo-950 flex items-center justify-center font-black shadow-sm">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                PLACE AUTHORING LAB & API TESTER
              </h2>
              <p className="text-xs font-bold text-slate-400">
                Keyless Open Data Engine: Wikipedia REST · Openverse · OpenLibrary · Photon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter city, island, or landmark (e.g., Singapore, Kyoto, Petra)..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black tracking-wide transition-all shadow-[0_4px_0_#9D174D] active:translate-y-0.5 active:shadow-none flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Query APIs</span>
            </button>
          </form>

          {/* Quick preset tests */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-400">
            <span>Quick probe:</span>
            {['Singapore', 'Samarkand', 'Reykjavik', 'Galapagos', 'Zanzibar'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setQuery(preset);
                }}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-xs transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* API Responses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Geocoding Output */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black text-indigo-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-pink-500" />
                  <span>Photon / OSM Geocoding</span>
                </span>
                <span className="text-[10px] text-slate-400">WGS84</span>
              </div>

              {geocodeResults.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {geocodeResults.slice(0, 3).map((g, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGeocode(g)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-colors ${
                        selectedGeocode === g
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold">{g.displayName}</div>
                      <div className="text-[10px] font-mono text-indigo-600 mt-0.5">
                        Lat: {g.lat.toFixed(4)}, Lon: {g.lon.toFixed(4)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No coordinates queried yet.</p>
              )}
            </div>

            {/* Openverse Photo */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black text-indigo-700">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-pink-500" />
                  <span>Openverse CC Image</span>
                </span>
                {imageData && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                    {imageData.license}
                  </span>
                )}
              </div>

              {imageData ? (
                <div className="space-y-1.5 text-xs">
                  <img
                    src={imageData.url}
                    alt={imageData.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                  <div className="text-[11px] text-slate-500 truncate font-semibold">
                    Creator: <span className="text-slate-800 font-bold">{imageData.creator}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No Openverse photo loaded.</p>
              )}
            </div>

            {/* Wikipedia Summary & Redaction Test */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 md:col-span-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black text-amber-700">
                <span className="flex items-center gap-1.5">
                  <Scroll className="w-4 h-4 text-amber-600" />
                  <span>Wikipedia REST Summary & Auto-Redaction</span>
                </span>
                <span className="text-[10px] text-slate-400">en.wikipedia.org</span>
              </div>

              {wikiData ? (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm">
                    <div className="text-[10px] font-bold uppercase text-amber-600 mb-1">
                      Auto-Redacted (Gameplay Preview):
                    </div>
                    <p className="font-mono text-xs leading-relaxed">
                      {wikiData.redactedExtract}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No Wikipedia extract loaded.</p>
              )}
            </div>

            {/* OpenLibrary Book Literature */}
            {booksData.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 md:col-span-2 shadow-sm">
                <div className="flex items-center justify-between text-xs font-black text-indigo-700">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>OpenLibrary Literature Hits</span>
                  </span>
                  <span className="text-[10px] text-slate-400">openlibrary.org</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {booksData.map((b, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="font-bold text-slate-800">{b.title}</div>
                      {b.author && <div className="text-[11px] text-slate-500 font-semibold">{b.author}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generated Place Code Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span>RGOGC Place Bank JSON Output</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-indigo-700 font-bold shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <pre className="text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-36">
                {jsonString}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-400">
            Open-source protocol · 0 API keys required
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black transition-colors"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
