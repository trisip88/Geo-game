import React, { useEffect, useState } from 'react';
import { ThumbsUp, Heart, Sparkles, ExternalLink, AlertCircle, MonitorUp, Trophy, Flame } from 'lucide-react';

export const DisqusComments: React.FC = () => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [reactions, setReactions] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('geo_game_reactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { thumbsUp: 24, love: 18, fire: 31, trophy: 15 };
  });

  const [userVoted, setUserVoted] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('geo_game_user_voted');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  const handleReaction = (type: string) => {
    const nextVoted = { ...userVoted, [type]: !userVoted[type] };
    const diff = userVoted[type] ? -1 : 1;
    const nextReactions = { ...reactions, [type]: Math.max(0, (reactions[type] || 0) + diff) };
    
    setUserVoted(nextVoted);
    setReactions(nextReactions);
    localStorage.setItem('geo_game_reactions', JSON.stringify(nextReactions));
    localStorage.setItem('geo_game_user_voted', JSON.stringify(nextVoted));
  };

  useEffect(() => {
    // Check if running inside an iframe (like AI Studio preview)
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Set Disqus configuration for gracelin
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
      s.src = 'https://gracelin.disqus.com/embed.js';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-indigo-950 flex items-center justify-center font-black shadow-sm shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
              <span>Player Ratings & Thumbs Up</span>
              <Sparkles className="w-4 h-4 text-pink-500" />
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Disqus Forum · shortname: <code className="text-indigo-600 font-mono font-black">gracelin</code>
            </p>
          </div>
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
            href="https://gracelin.disqus.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-[0_2px_0_#9D174D]"
          >
            <span>Disqus Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 1-Click Instant Reaction Bar */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
          Leave quick player feedback (1-Click Thumbs Up):
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleReaction('thumbsUp')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all border-2 active:scale-95 ${
              userVoted.thumbsUp
                ? 'bg-indigo-600 border-indigo-700 text-white shadow-md'
                : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700 hover:bg-indigo-50/50'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${userVoted.thumbsUp ? 'text-yellow-300' : 'text-indigo-600'}`} />
            <span>Thumbs Up</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${userVoted.thumbsUp ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {reactions.thumbsUp}
            </span>
          </button>

          <button
            onClick={() => handleReaction('love')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all border-2 active:scale-95 ${
              userVoted.love
                ? 'bg-rose-500 border-rose-600 text-white shadow-md'
                : 'bg-white border-slate-200 hover:border-rose-300 text-slate-700 hover:bg-rose-50/50'
            }`}
          >
            <Heart className={`w-4 h-4 ${userVoted.love ? 'text-white' : 'text-rose-500'}`} />
            <span>Love It</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${userVoted.love ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {reactions.love}
            </span>
          </button>

          <button
            onClick={() => handleReaction('fire')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all border-2 active:scale-95 ${
              userVoted.fire
                ? 'bg-amber-500 border-amber-600 text-white shadow-md'
                : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700 hover:bg-amber-50/50'
            }`}
          >
            <Flame className={`w-4 h-4 ${userVoted.fire ? 'text-yellow-200' : 'text-amber-500'}`} />
            <span>Addictive</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${userVoted.fire ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {reactions.fire}
            </span>
          </button>

          <button
            onClick={() => handleReaction('trophy')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all border-2 active:scale-95 ${
              userVoted.trophy
                ? 'bg-yellow-500 border-yellow-600 text-slate-950 shadow-md'
                : 'bg-white border-slate-200 hover:border-yellow-300 text-slate-700 hover:bg-yellow-50/50'
            }`}
          >
            <Trophy className={`w-4 h-4 ${userVoted.trophy ? 'text-slate-950' : 'text-yellow-500'}`} />
            <span>Geo Master</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${userVoted.trophy ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {reactions.trophy}
            </span>
          </button>
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

