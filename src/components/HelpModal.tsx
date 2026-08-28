import React from 'react';
import {
  HelpCircle,
  X,
  Target,
  Compass,
  FileCode,
  Globe2,
  ShieldCheck,
  Keyboard,
} from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-scaleUp text-slate-800 my-8 max-h-[85vh] flex flex-col border-b-8 border-indigo-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-yellow-400 text-indigo-950 flex items-center justify-center font-black shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                HOW TO PLAY & SCORING RULES
              </h2>
              <p className="text-xs font-bold text-slate-400">
                Random Geography Open-Data Guessing Challenge
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

        {/* Body */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600 pr-1">
          {/* Section 1: Gameplay */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-indigo-600 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>1. Game Mechanics</span>
            </div>
            <p className="text-slate-700 font-medium">
              Each match consists of <strong>5 rounds</strong> randomly selected from a diverse global bank of places.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                <strong>Clue 1 (Hard):</strong> Narrows the hemisphere, latitude band, climate, or terrain.
              </li>
              <li>
                <strong>Clue 2 (Medium):</strong> Highlights history, regional economy, or culture.
              </li>
              <li>
                <strong>Clue 3 (Easy):</strong> Distinguishing geographic or landmark giveaway.
              </li>
              <li>
                <strong>Live Wikipedia Extract:</strong> Summary snippet with place name and country automatically blacked out (<code>████</code>).
              </li>
              <li>
                <strong>Openverse Photo:</strong> Creative Commons photograph with full artist attribution.
              </li>
            </ul>
          </div>

          {/* Section 2: Exponential Scoring Curve */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-amber-600 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>2. Exponential Distance Scoring</span>
            </div>
            <div className="p-3 rounded-xl bg-yellow-100/80 font-mono text-xs font-bold text-amber-900 border border-yellow-200 text-center">
              points = 5000 · e^(−distance_km / 1500)
            </div>
            <p className="text-slate-700 font-medium">
              Within <strong>25 km</strong> of the true coordinates, you earn a <strong>5,000 pt Bullseye</strong>. The exponential decay rewards pinpoint precision near the target and scales global distances calculated via the Haversine formula on WGS84 coordinates.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-black pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400 text-[10px]">&lt; 25 km</div>
                <div className="text-emerald-600 text-sm">5,000 pts</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400 text-[10px]">500 km</div>
                <div className="text-indigo-600 text-sm">3,583 pts</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400 text-[10px]">1,500 km</div>
                <div className="text-amber-600 text-sm">1,839 pts</div>
              </div>
            </div>
          </div>

          {/* Section 3: Keyboard Controls */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-pink-600 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4" />
              <span>3. Keyboard Accessibility</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                <span className="text-slate-500 font-bold">Arrow Keys:</span>
                <span className="text-slate-900 font-black">Move cursor (1° step)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                <span className="text-slate-500 font-bold">Shift + Arrows:</span>
                <span className="text-slate-900 font-black">Move cursor (5° step)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between sm:col-span-2 shadow-sm">
                <span className="text-slate-500 font-bold">Enter / Space:</span>
                <span className="text-pink-600 font-black">Lock in Guess Pin</span>
              </div>
            </div>
          </div>

          {/* Section 4: Live Open Data Sources */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-emerald-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>4. Open & Keyless Data Sources</span>
            </div>
            <p className="text-slate-700 font-medium">
              Powered entirely by keyless, public APIs and open data protocols:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
              <li>
                <strong>Wikipedia REST API:</strong> Article summaries (CC BY-SA).
              </li>
              <li>
                <strong>Openverse:</strong> High quality Creative Commons photographs with creator credits.
              </li>
              <li>
                <strong>OpenLibrary:</strong> Literature search by keyword.
              </li>
              <li>
                <strong>Photon & Nominatim:</strong> OpenStreetMap geocoding endpoints.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#9D174D] active:translate-y-0.5 active:shadow-none transition-all"
          >
            Got It, Let’s Play!
          </button>
        </div>
      </div>
    </div>
  );
};
