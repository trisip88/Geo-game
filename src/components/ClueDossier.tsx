import React, { useState } from 'react';
import { Place, LiveFeedData } from '../types';
import {
  Compass,
  Scroll,
  BookOpen,
  Image as ImageIcon,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface ClueDossierProps {
  place: Place;
  liveFeedData: LiveFeedData;
  revealedCluesCount: number;
  onRevealNextClue: () => void;
  isGuessed: boolean;
}

export const ClueDossier: React.FC<ClueDossierProps> = ({
  place,
  liveFeedData,
  revealedCluesCount,
  onRevealNextClue,
  isGuessed,
}) => {
  const [showWikiSection, setShowWikiSection] = useState(true);
  const [showLiteratureSection, setShowLiteratureSection] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);

  const photo = liveFeedData.openverse || (place.cachedImage ? {
    url: place.cachedImage.url,
    creator: place.cachedImage.creator,
    license: place.cachedImage.license,
    licenseUrl: place.cachedImage.licenseUrl,
    title: place.cachedImage.title || 'Location Visual',
    sourceUrl: place.cachedImage.sourceUrl || 'https://openverse.org',
  } : null);

  const wikiExtract = isGuessed
    ? (liveFeedData.wikipedia?.extract || place.cachedExtract || '')
    : (liveFeedData.wikipedia?.redactedExtract || place.cachedExtract || '');

  const books = liveFeedData.openLibrary?.books || [];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 text-slate-800 border-b-8 border-indigo-200">
      {/* Dossier Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">
              Location Dossier
            </h2>
            <p className="text-xs font-bold text-indigo-500">
              {isGuessed
                ? `${place.name}, ${place.country}`
                : 'Secret Mystery Coordinates'}
            </p>
          </div>
        </div>

        {/* Clue Count Pill */}
        <div className="flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
          <span>HINTS:</span>
          <span className="text-pink-600">{revealedCluesCount}/3</span>
        </div>
      </div>

      {/* Photo with Openverse Attribution */}
      {photo && (
        <div className="relative group overflow-hidden rounded-2xl aspect-video bg-slate-100 flex items-center justify-center border border-slate-200 shadow-md">
          <img
            src={photo.url}
            alt={isGuessed ? `${place.name}` : 'Mystery Location Visual Clue'}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageExpanded ? 'h-64 sm:h-72 object-contain bg-slate-900' : ''
            }`}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-indigo-600/95 backdrop-blur-sm py-1.5 px-3 flex items-center justify-between text-white text-[11px] font-bold">
            <span className="truncate max-w-[200px]" title={photo.creator}>
              Photo: {photo.creator}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-yellow-300 font-mono text-[9px]">
                {photo.license}
              </span>
              <button
                onClick={() => setImageExpanded(!imageExpanded)}
                className="hover:text-yellow-300 transition-colors flex items-center gap-0.5"
              >
                <ImageIcon className="w-3 h-3" />
                <span>{imageExpanded ? 'Fit' : 'Expand'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wikipedia Extract Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
              WIKIPEDIA EXTRACT
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {isGuessed ? 'Revealed' : 'Name Redacted'}
            </span>
          </div>
          <button
            onClick={() => setShowWikiSection(!showWikiSection)}
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
          >
            {showWikiSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showWikiSection && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700">
            <p className="text-sm sm:text-base font-medium leading-relaxed italic text-slate-600 font-sans">
              "{wikiExtract || 'Fetching summary extract from Wikipedia API...'}"
            </p>
            {isGuessed && (
              <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(place.wikipediaTitle)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>Open Wikipedia Article</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Written Clues Tier 1, 2, 3 */}
      <div className="space-y-3">
        {/* Clue 1: Hemisphere & Terrain */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Clue 1 · Hemisphere & Terrain
            </span>
            <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">
              Tier 1
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700 leading-snug">
            {place.clues[0]}
          </p>
        </div>

        {/* Clue 2: History & Economy */}
        {revealedCluesCount >= 2 ? (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 shadow-sm animate-fadeIn">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Clue 2 · History & Culture
              </span>
              <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">
                Tier 2
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-snug">
              {place.clues[1]}
            </p>
          </div>
        ) : (
          !isGuessed && (
            <button
              onClick={onRevealNextClue}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Unlock Clue 2 (History & Economy)</span>
            </button>
          )
        )}

        {/* Clue 3: Distinguishing Giveaway */}
        {revealedCluesCount >= 3 ? (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 shadow-sm animate-fadeIn">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Clue 3 · Distinguishing Feature
              </span>
              <span className="text-[10px] font-black text-pink-600 uppercase bg-pink-50 px-2 py-0.5 rounded">
                Tier 3
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-snug">
              {place.clues[2]}
            </p>
          </div>
        ) : (
          revealedCluesCount === 2 &&
          !isGuessed && (
            <button
              onClick={onRevealNextClue}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-pink-300 hover:border-pink-500 bg-pink-50/50 hover:bg-pink-50 text-pink-700 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Unlock Clue 3 (Distinguishing Giveaway)</span>
            </button>
          )
        )}
      </div>

      {/* OpenLibrary Book Clues (if present) */}
      {books.length > 0 && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
          <button
            onClick={() => setShowLiteratureSection(!showLiteratureSection)}
            className="w-full px-4 py-2.5 text-xs font-bold flex items-center justify-between text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>OpenLibrary Literary References</span>
            </div>
            {showLiteratureSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showLiteratureSection && (
            <div className="p-3 bg-white border-t border-slate-200 space-y-1 text-xs">
              {books.map((b, i) => (
                <div key={i} className="text-slate-600 flex items-start gap-1.5 py-0.5">
                  <span className="text-indigo-500 font-bold">📖</span>
                  <span>
                    <strong>{isGuessed ? b.title : b.title.replace(new RegExp(place.name, 'gi'), '████')}</strong>
                    {b.author && ` by ${b.author}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer engine tag */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase pt-1">
        <div className="flex items-center gap-1 text-indigo-600">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Open Data Engine</span>
        </div>
        <span>WGS84 Equirectangular</span>
      </div>
    </div>
  );
};
