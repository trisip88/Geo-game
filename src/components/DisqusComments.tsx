import React, { useEffect, useState } from 'react';
import { Sparkles, ExternalLink, AlertCircle, MonitorUp } from 'lucide-react';

interface ReactionItem {
  id: string;
  label: string;
  emoji: string;
  svgFallback?: string;
}

const REACTION_CONFIG: ReactionItem[] = [
  { id: 'upvote', label: 'Upvote', emoji: '👍' },
  { id: 'funny', label: 'Funny', emoji: '😆' },
  { id: 'love', label: 'Love', emoji: '😍' },
  { id: 'surprised', label: 'Surprised', emoji: '😮' },
  { id: 'angry', label: 'Angry', emoji: '😤' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
];

export const DisqusComments: React.FC = () => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [reactions, setReactions] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('geo_game_disqus_reactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { upvote: 0, funny: 0, love: 1, surprised: 0, angry: 0, sad: 0 };
  });

  const [selectedReaction, setSelectedReaction] = useState<string | null>(() => {
    return localStorage.getItem('geo_game_selected_reaction') || 'love';
  });

  const handleSelectReaction = (id: string) => {
    const newReactions = { ...reactions };
    let newSelected: string | null = id;

    if (selectedReaction === id) {
      // Toggle off
      newReactions[id] = Math.max(0, (newReactions[id] || 1) - 1);
      newSelected = null;
    } else {
      // Toggle on, decrement previous if any
      if (selectedReaction && newReactions[selectedReaction] !== undefined) {
        newReactions[selectedReaction] = Math.max(0, newReactions[selectedReaction] - 1);
      }
      newReactions[id] = (newReactions[id] || 0) + 1;
    }

    setReactions(newReactions);
    setSelectedReaction(newSelected);
    localStorage.setItem('geo_game_disqus_reactions', JSON.stringify(newReactions));
    if (newSelected) {
      localStorage.setItem('geo_game_selected_reaction', newSelected);
    } else {
      localStorage.removeItem('geo_game_selected_reaction');
    }
  };

  const totalResponses = Object.values(reactions).reduce((acc: number, curr: number) => acc + curr, 0);

  useEffect(() => {
    // Check if running inside an iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Set Disqus configuration for geofun
    (window as any).disqus_config = function (this: any) {
      this.page.url = window.location.href.split('#')[0];
      this.page.identifier = 'geo-game-forum';
      this.page.title = 'Geo Game Discussion';
    };

    // Load or reset Disqus
    if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: (window as any).disqus_config,
        });
      } catch (e) {
        console.warn('Disqus reset error:', e);
      }
    } else {
      const existing = document.getElementById('disqus-embed-script');
      if (existing) {
        existing.remove();
      }
      const s = document.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://geofun.disqus.com/embed.js';
      s.setAttribute('data-timestamp', (+new Date()).toString());
      s.async = true;
      (document.head || document.body).appendChild(s);
    }
  }, []);

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-b-8 border-indigo-200 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
            <span>Community Reactions & Forum</span>
            <Sparkles className="w-4 h-4 text-pink-500" />
          </h3>
          <p className="text-xs font-bold text-slate-400">
            Disqus Forum · shortname: <code className="text-indigo-600 font-mono font-black">geofun</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isInIframe && (
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors border border-indigo-200"
              title="Open app in a standalone tab"
            >
              <MonitorUp className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </button>
          )}
          <a
            href="https://geofun.disqus.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-[0_2px_0_#9D174D]"
          >
            <span>Disqus Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Disqus "What do you think?" Reactions Widget */}
      <div className="py-6 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 text-center">
        <h4 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-1">
          What do you think?
        </h4>
        <p className="text-sm font-semibold text-slate-500 mb-6">
          {totalResponses} {totalResponses === 1 ? 'Response' : 'Responses'}
        </p>

        {/* Reaction Options Grid / Flex Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
          {REACTION_CONFIG.map((item) => {
            const isSelected = selectedReaction === item.id;
            const count = reactions[item.id] || 0;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectReaction(item.id)}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer min-w-[70px] sm:min-w-[90px] ${
                  isSelected
                    ? 'border-2 border-slate-900 bg-white shadow-md scale-105'
                    : 'border-2 border-transparent hover:border-slate-200 hover:bg-slate-50/80'
                }`}
              >
                {/* Emoji Icon */}
                <span className="text-3xl sm:text-4xl select-none mb-1.5 filter drop-shadow-sm transition-transform hover:scale-110">
                  {item.emoji}
                </span>

                {/* Response Count */}
                <span className={`text-base sm:text-lg font-black leading-tight ${isSelected ? 'text-slate-950' : 'text-slate-700'}`}>
                  {count}
                </span>

                {/* Label */}
                <span className={`text-xs sm:text-sm font-bold tracking-tight mt-0.5 ${isSelected ? 'text-slate-950' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notice for preview iframe / ad-blocker environments */}
      {isInIframe && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Running inside AI Studio Preview iframe</p>
              <p className="text-amber-700 mt-0.5 leading-relaxed">
                Modern browsers block third-party cookies inside preview iframes. Click <strong>Open in New Tab</strong> to view the live Disqus thread.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenNewTab}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors"
          >
            Launch Standalone Tab
          </button>
        </div>
      )}

      <div className="min-h-[250px] w-full relative">
        {/* Standard Disqus Thread Container */}
        <div id="disqus_thread" className="min-h-[200px]"></div>

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-indigo-600 underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};

