import React, { useEffect } from 'react';
import { MatchRecord } from '../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  RefreshCw,
  Download,
  Share2,
  CheckCircle2,
  Navigation,
  Globe2,
  Clock,
} from 'lucide-react';

interface MatchSummaryModalProps {
  matchRecord: MatchRecord;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const MatchSummaryModal: React.FC<MatchSummaryModalProps> = ({
  matchRecord,
  onPlayAgain,
}) => {
  const { score, max_possible, accuracy_pct, avg_error_km } = matchRecord.totals;

  useEffect(() => {
    // Fire confetti for impressive performance
    if (score >= 15000) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore if confetti not supported
      }
    }
  }, [score]);

  const getRank = (score: number) => {
    if (score >= 23500) return { title: 'Grand Cartographer', color: 'text-yellow-600', desc: 'Flawless geographical intuition and pin precision!' };
    if (score >= 18000) return { title: 'Master Navigator', color: 'text-emerald-600', desc: 'Outstanding world knowledge across all hemispheres!' };
    if (score >= 12000) return { title: 'Skilled Geographer', color: 'text-indigo-600', desc: 'Solid regional deduction and compass bearing.' };
    if (score >= 6000) return { title: 'Apprentice Explorer', color: 'text-sky-600', desc: 'Good broad continent recognition.' };
    return { title: 'Lost at Sea', color: 'text-slate-500', desc: 'Keep practicing your latitude and longitude readings!' };
  };

  const rank = getRank(score);

  const handleDownload = () => {
    const jsonString = JSON.stringify(matchRecord, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rgogc-match.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-scaleUp text-slate-800 my-8 border-b-8 border-indigo-200">
        {/* Header Ribbon */}
        <div className="text-center pb-6 border-b border-slate-100">
          <div className="inline-flex p-4 rounded-3xl bg-yellow-400 text-indigo-950 mb-3 shadow-md">
            <Trophy className="w-9 h-9 fill-indigo-950" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            MATCH EXPEDITION COMPLETE
          </h2>
          <div className={`text-lg font-black mt-1 uppercase tracking-wide ${rank.color}`}>
            ★ {rank.title} ★
          </div>
          <p className="text-xs font-bold text-slate-500 mt-1">{rank.desc}</p>
        </div>

        {/* Big Totals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Score</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">
              {score.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-bold">/ {max_possible.toLocaleString()}</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Accuracy</div>
            <div className="text-xl sm:text-2xl font-black text-pink-600 mt-1">
              {accuracy_pct.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400 font-bold">Precision rate</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Avg Distance</div>
            <div className="text-xl sm:text-2xl font-black text-yellow-600 mt-1">
              {avg_error_km.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-bold">kilometers</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rounds</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
              {matchRecord.rounds.length}
            </div>
            <div className="text-[10px] text-slate-400 font-bold">Locations</div>
          </div>
        </div>

        {/* Round-by-Round Breakdown Table */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden mb-6 shadow-sm">
          <div className="px-4 py-3 bg-indigo-50/70 border-b border-indigo-100 text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center justify-between">
            <span>Round Telemetry Breakdown</span>
            <span className="text-[10px] text-indigo-500">Haversine Metric</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto text-xs bg-white">
            {matchRecord.rounds.map((r) => (
              <div
                key={r.round}
                className="px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {r.round}
                  </span>
                  <div>
                    <div className="font-black text-slate-900">
                      {r.place.name}, <span className="text-slate-500 font-bold">{r.place.country}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400">
                      Off by {r.distance_km.toLocaleString()} km · {r.seconds}s elapsed
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-sm ${
                      r.points >= 4000
                        ? 'text-emerald-600'
                        : r.points >= 2000
                        ? 'text-indigo-600'
                        : 'text-amber-600'
                    }`}
                  >
                    +{r.points.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 block">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-xs font-black text-indigo-700 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Schema Log</span>
          </button>

          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-sm tracking-wide shadow-[0_4px_0_#9D174D] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
