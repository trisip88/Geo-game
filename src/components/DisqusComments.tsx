import React, { useEffect, useState } from 'react';
import { MessageSquare, Sparkles, Send, ThumbsUp, User, ExternalLink, RefreshCw, MessageCircle } from 'lucide-react';

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

interface CommentItem {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
  badge?: string;
}

const INITIAL_PLAYER_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: 'GeoMaster_Alex',
    text: 'Capital City Frenzy is so addictive! Got 14/15 on Europe mode today. Loving the smooth flag animations! 🌍✨',
    timestamp: '10 mins ago',
    likes: 6,
    badge: 'Pro Explorer',
  },
  {
    id: 'c2',
    author: 'Elena_Traveler',
    text: 'Great game for studying world geography! The flashcards and world map exploration helped a lot for my exams.',
    timestamp: '1 hour ago',
    likes: 9,
    badge: 'Top Scholar',
  },
  {
    id: 'c3',
    author: 'Lucas_W',
    text: 'Tip for Flag Match: Pay attention to Scandinavian cross colors and the African Pan-African colors palette!',
    timestamp: '3 hours ago',
    likes: 4,
    badge: 'Quiz Master',
  },
];

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config?: () => void }) => void;
    };
    disqus_config?: () => void;
  }
}

export const DisqusComments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'disqus' | 'community'>('community');
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(() => {
    const saved = localStorage.getItem('geofun_user_comments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PLAYER_COMMENTS;
  });

  const [reactions, setReactions] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('geo_game_disqus_reactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { upvote: 8, funny: 3, love: 19, surprised: 4, angry: 0, sad: 0 };
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

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      author: authorName.trim() || 'Geo Explorer',
      text: commentText.trim(),
      timestamp: 'Just now',
      likes: 1,
      badge: 'Player',
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem('geofun_user_comments', JSON.stringify(updated));
    setCommentText('');
  };

  const handleLike = (id: string) => {
    const updated = comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c));
    setComments(updated);
    localStorage.setItem('geofun_user_comments', JSON.stringify(updated));
  };

  const totalResponses = Object.values(reactions).reduce((acc: number, curr: number) => acc + curr, 0);

  useEffect(() => {
    // Configure Disqus config
    const pageUrl = 'https://trisip88.github.io/Geo-game';
    const pageIdentifier = 'geo-game-forum';

    window.disqus_config = function (this: any) {
      this.page.url = pageUrl;
      this.page.identifier = pageIdentifier;
      this.page.title = 'Geo Game Discussion';
    };

    // Load or Reset Disqus embed
    if (window.DISQUS) {
      try {
        window.DISQUS.reset({
          reload: true,
          config: window.disqus_config,
        });
      } catch (err) {
        console.warn('Disqus reset error:', err);
      }
    } else {
      const existing = document.getElementById('dsq-embed-scr');
      if (!existing) {
        const d = document;
        const s = d.createElement('script');
        s.id = 'dsq-embed-scr';
        s.src = 'https://geofun.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        (d.head || d.body).appendChild(s);
      }
    }
  }, []);

  return (
    <div id="disqus-container" className="w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-b-8 border-indigo-200 text-slate-800 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black shrink-0 shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Community Discussion & Reviews</span>
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Share your geography strategies, high scores, and feedback
              </p>
            </div>
          </div>

          {/* Toggle Tab */}
          <div className="flex items-center gap-2 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('community')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'community'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Live Comments ({comments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('disqus')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'disqus'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Disqus Embed</span>
            </button>
          </div>
        </div>

        {/* 1. What Do You Think? (Rate & Reactions Section) */}
        <div className="py-6 px-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-center">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-1">
            What do you think?
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-5">
            {totalResponses} {totalResponses === 1 ? 'Reaction' : 'Reactions'} from Players
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

        {/* 2. Interactive Comments Feed */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            {/* Input Form */}
            <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 space-y-3">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Join the Conversation</span>
              </h3>

              <form onSubmit={handlePostComment} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative sm:w-1/3">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Your Name / Handle"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Write your feedback, favorite country trivia, or high score..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full px-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Comment List */}
            <div className="space-y-3">
              {comments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs sm:text-sm text-slate-900">{item.author}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{item.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{item.text}</p>

                  <div className="flex items-center gap-4 pt-1 border-t border-slate-50">
                    <button
                      onClick={() => handleLike(item.id)}
                      type="button"
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.likes}</span>
                    </button>
                    <span className="text-xs text-slate-400 font-medium cursor-pointer hover:text-slate-600">
                      Reply
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Disqus Thread Tab & Embed Container */}
        {activeTab === 'disqus' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-semibold">
              <span>Disqus Live Thread (<code className="font-mono font-bold">geofun</code>)</span>
              <a
                href="https://geofun.disqus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-700 hover:underline font-bold"
              >
                <span>Open in Disqus</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Direct Disqus Iframe fallback to guarantee display in all environments */}
            <iframe
              src="https://disqus.com/embed/comments/?base=default&f=geofun&t_i=geo-game-forum&t_u=https%3A%2F%2Ftrisip88.github.io%2FGeo-game&t_d=Geo%20Game%20Community"
              title="Disqus Comments"
              className="w-full min-h-[380px] border-0 rounded-2xl bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        )}

        {/* Hidden Container for Universal Code script if needed */}
        <div id="disqus_thread" className="hidden"></div>
      </div>
    </div>
  );
};




