import React from 'react';
import {
  Globe2,
  Volume2,
  VolumeX,
  FileCode2,
  HelpCircle,
  FlaskConical,
  RefreshCw,
  Zap,
  MessageSquare,
} from 'lucide-react';

interface HeaderProps {
  round: number;
  totalRounds: number;
  totalScore: number;
  maxScore: number;
  liveFeedStatus: 'online' | 'bundled' | 'probing' | 'error';
  soundEnabled: boolean;
  onToggleSound: () => void;
  onProbeLiveFeed: () => void;
  onOpenSchema: () => void;
  onOpenAuthoring: () => void;
  onOpenHelp: () => void;
  onOpenDiscussion?: () => void;
  onResetMatch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  round,
  totalRounds,
  totalScore,
  maxScore,
  liveFeedStatus,
  soundEnabled,
  onToggleSound,
  onProbeLiveFeed,
  onOpenSchema,
  onOpenAuthoring,
  onOpenHelp,
  onOpenDiscussion,
  onResetMatch,
}) => {
  return (
    <header className="sticky top-0 z-30 px-3 sm:px-6 pt-3 sm:pt-5 pb-2">
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl px-4 sm:px-7 py-3 sm:py-4 border border-white/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 sm:p-2.5 rounded-xl text-indigo-950 shadow-md flex items-center justify-center font-black">
              <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                  GEOQUEST
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-yellow-400 text-indigo-950 tracking-wider shadow-sm">
                  RGOGC
                </span>
              </div>
              <p className="text-[11px] font-bold text-indigo-200 tracking-wide mt-0.5 hidden sm:block">
                Open-Data Geography Guessing Engine
              </p>
            </div>
          </div>

          {/* Live Feed Status Pill */}
          <button
            onClick={onProbeLiveFeed}
            title="Probe open keyless APIs (Wikipedia REST, Openverse, OpenLibrary)"
            className="flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-all shadow-sm active:scale-95"
          >
            {liveFeedStatus === 'probing' ? (
              <>
                <RefreshCw className="w-3 h-3 text-yellow-300 animate-spin" />
                <span className="text-yellow-300 text-[11px]">Probing...</span>
              </>
            ) : liveFeedStatus === 'online' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                <span className="text-emerald-300 text-[11px]">Live APIs</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-300 text-[11px]">Bundled</span>
              </>
            )}
          </button>
        </div>

        {/* Live Score and Round Stats */}
        <div className="flex items-center justify-around md:justify-center gap-4 sm:gap-8 w-full md:w-auto bg-black/10 md:bg-transparent rounded-xl p-2 md:p-0">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest">
              Round
            </p>
            <p className="text-xl sm:text-2xl font-black text-pink-400 leading-tight">
              {Math.min(round, totalRounds)}<span className="text-indigo-200 text-sm font-bold">/{totalRounds}</span>
            </p>
          </div>

          <div className="h-7 w-px bg-white/20" />

          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest">
              Current Score
            </p>
            <p className="text-xl sm:text-2xl font-black text-yellow-400 leading-tight flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400 hidden sm:inline" />
              {totalScore.toLocaleString()}
            </p>
          </div>

          <div className="h-7 w-px bg-white/20" />

          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest">
              Data Feed
            </p>
            <button
              onClick={onProbeLiveFeed}
              title="Click to probe live endpoints"
              className="text-xs sm:text-sm font-black text-emerald-400 leading-tight flex items-center justify-center gap-1 hover:text-emerald-300 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>{liveFeedStatus === 'online' ? 'Connected' : liveFeedStatus === 'probing' ? 'Probing...' : 'Bundled'}</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-pink-300" />}
          </button>

          <button
            onClick={onOpenAuthoring}
            title="Open Place Authoring Lab & API Tester"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <FlaskConical className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">API Lab</span>
          </button>

          <button
            onClick={onOpenSchema}
            title="Inspect JSON Schema & Match Payload"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <FileCode2 className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden sm:inline">Schema</span>
          </button>

          <button
            onClick={onOpenHelp}
            title="How to play and scoring guide"
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {onOpenDiscussion && (
            <button
              onClick={onOpenDiscussion}
              title="Community Discussions & Comments"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">Forum</span>
            </button>
          )}

          <button
            onClick={onResetMatch}
            title="Start new game match"
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-pink-500 hover:bg-pink-600 text-white shadow-[0_3px_0_#9D174D] active:translate-y-0.5 active:shadow-none transition-all tracking-tight"
          >
            New Game
          </button>
        </div>
      </div>
    </header>
  );
};
