import React, { useEffect, useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

interface ReactionItem {
  id: string;
  label: string;
  emoji: string;
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
  const [reactions, setReactions] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('geo_game_disqus_reactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { upvote: 5, funny: 2, love: 12, surprised: 3, angry: 0, sad: 0 };
  });

  const [selectedReaction, setSelectedReaction] = useState<string | null>(() => {
    return localStorage.getItem('geo_game_selected_reaction') || 'love';
  });

  const handleSelectReaction = (id: string) => {
    const newReactions = { ...reactions };
    let newSelected: string | null = id;

    if (selectedReaction === id) {
      newReactions[id] = Math.max(0, (newReactions[id] || 1) - 1);
      newSelected = null;
    } else {
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
    // Embed Disqus Script
    const d = document;
    const s = d.createElement('script');
    s.src = 'https://geofun.disqus.com/embed.js';
    s.setAttribute('data-timestamp', String(+new Date()));
    (d.head || d.body).appendChild(s);
  }, []);

  return (
    <div id="disqus-container" className="w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-b-8 border-indigo-200 text-slate-800 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black shrink-0 shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Community Discussion</span>
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Share your geography strategies, high scores, and feedback
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-bold w-fit border border-indigo-100">
            Live Disqus Board
          </span>
        </div>

        {/* What Do You Think? (Reactions Section) */}
        <div className="py-6 px-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-center">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-1">
            What do you think?
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-5">
            {totalResponses} {totalResponses === 1 ? 'Reaction' : 'Reactions'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
            {REACTION_CONFIG.map((item) => {
              const isSelected = selectedReaction === item.id;
              const count = reactions[item.id] || 0;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectReaction(item.id)}
                  type="button"
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer min-w-[70px] sm:min-w-[85px] ${
                    isSelected
                      ? 'border-2 border-indigo-600 bg-white shadow-md scale-105 ring-2 ring-indigo-100'
                      : 'border-2 border-transparent hover:border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl select-none mb-1 filter drop-shadow-xs transition-transform hover:scale-110">
                    {item.emoji}
                  </span>
                  <span
                    className={`text-sm sm:text-base font-black leading-tight ${
                      isSelected ? 'text-indigo-950' : 'text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs font-bold tracking-tight mt-0.5 ${
                      isSelected ? 'text-indigo-600' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Universal Disqus Thread Container */}
        <div id="disqus_thread" className="min-h-[220px]"></div>

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" rel="nofollow" className="text-indigo-600 underline font-medium">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};



