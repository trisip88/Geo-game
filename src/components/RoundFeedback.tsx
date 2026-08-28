import React from 'react';
import { Place, GuessCoordinates } from '../types';
import {
  calculateDistanceKm,
  calculatePoints,
  calculateBearing,
  formatCoordinates,
  BULLSEYE_RADIUS_KM,
} from '../utils/geo';
import {
  Trophy,
  ArrowRight,
  Target,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface RoundFeedbackProps {
  round: number;
  totalRounds: number;
  place: Place;
  userGuess: GuessCoordinates;
  onNextRound: () => void;
  isLastRound: boolean;
}

export const RoundFeedback: React.FC<RoundFeedbackProps> = ({
  round,
  totalRounds,
  place,
  userGuess,
  onNextRound,
  isLastRound,
}) => {
  const distanceKm = calculateDistanceKm(
    userGuess.lat,
    userGuess.lon,
    place.lat,
    place.lon
  );
  const points = calculatePoints(distanceKm);
  const bearing = calculateBearing(
    place.lat,
    place.lon,
    userGuess.lat,
    userGuess.lon
  );
  const isBullseye = distanceKm <= BULLSEYE_RADIUS_KM;

  const getEvaluation = (pts: number, dist: number) => {
    if (dist <= 25) return { text: 'BULLSEYE! Perfect Accuracy 🎯', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-300' };
    if (pts >= 4500) return { text: 'Incredible Precision! 🔥', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-300' };
    if (pts >= 3500) return { text: 'Great Geolocation! 🧭', color: 'text-indigo-700', bg: 'bg-indigo-100 border-indigo-300' };
    if (pts >= 2000) return { text: 'Good Regional Reading 📍', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-300' };
    if (pts >= 800) return { text: 'Right Hemisphere 🌊', color: 'text-orange-800', bg: 'bg-orange-100 border-orange-300' };
    return { text: 'Lost at Sea 🧭', color: 'text-pink-700', bg: 'bg-pink-100 border-pink-300' };
  };

  const evalState = getEvaluation(points, distanceKm);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-b-8 border-indigo-200 text-slate-800 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${evalState.bg} ${evalState.color} shadow-sm`}>
              {evalState.text}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Round {round} of {totalRounds}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Target: <span className="text-indigo-600">{place.name}</span>, {place.country}
          </h3>
        </div>

        {/* Big Points Award Badge */}
        <div className="flex items-center gap-3 bg-yellow-400 text-indigo-950 px-5 py-3 rounded-2xl shadow-md">
          <Trophy className="w-6 h-6 text-indigo-950 fill-indigo-950" />
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black leading-tight">
              +{points.toLocaleString()}
            </div>
            <div className="text-[10px] font-black uppercase tracking-wider">Points Earned</div>
          </div>
        </div>
      </div>

      {/* Round Telemetry Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-5">
        {/* Distance Error */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
            <Target className="w-4 h-4 text-pink-500" />
            <span>Distance Off</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {distanceKm.toLocaleString()} <span className="text-xs font-bold text-slate-400">km</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {distanceKm > 0 ? `Pin landed ${bearing} of target` : 'Exact pinpoint!'}
          </p>
        </div>

        {/* Your Coordinates */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-pink-500" />
            <span>Your Pin Coordinates</span>
          </div>
          <div className="text-sm font-black text-pink-600 font-mono mt-1">
            {formatCoordinates(userGuess.lat, userGuess.lon)}
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Equirectangular WGS84</p>
        </div>

        {/* True Coordinates */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Actual Location</span>
          </div>
          <div className="text-sm font-black text-emerald-600 font-mono mt-1">
            {formatCoordinates(place.lat, place.lon)}
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {place.country}
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span>Formula: 5000 · e^(−dist / 1500)</span>
          {isBullseye && <span className="text-emerald-600 font-black ml-1">(Bullseye ≤ 25km)</span>}
        </div>

        <button
          onClick={onNextRound}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider bg-pink-500 hover:bg-pink-600 text-white shadow-[0_4px_0_#9D174D] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <span>{isLastRound ? 'View Match Summary' : 'Next Location'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
