import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle, Sparkles, Send, ThumbsUp, Heart, ExternalLink, User } from 'lucide-react';

interface DisqusCommentsProps {
  url?: string;
  identifier?: string;
  title?: string;
  shortname?: string;
  className?: string;
}

interface LocalComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
  badge?: string;
}

const INITIAL_COMMENTS: LocalComment[] = [
  {
    id: '1',
    author: 'GeoMaster_Alex',
    text: 'Capital City Frenzy is so addictive! Got 14/15 on Europe mode today. Loving the smooth flag animations! 🌍✨',
    timestamp: 'Just now',
    likes: 4,
    badge: 'Pro Explorer',
  },
  {
    id: '2',
    author: 'Elena_Traveler',
    text: 'Great game for studying world geography! The flashcards and world map exploration helped a lot for my exams.',
    timestamp: '2 hours ago',
    likes: 6,
    badge: 'Top Scholar',
  },
  {
    id: '3',
    author: 'Lucas_W',
    text: 'Tip for Flag Match: Pay attention to Scandinavian cross colors and the African Pan-African colors palette!',
    timestamp: '5 hours ago',
    likes: 3,
  },
];

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

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config?: () => void }) => void;
    };
    disqus_config?: () => void;
  }
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  url,
  identifier = 'geo-game-forum',
  title = 'Geo Game Community Discussion',
  shortname = 'geofun',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [comments, setComments] = useState<LocalComment[]>(() => {
    const saved = localStorage.getItem('geo_game_user_comments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_COMMENTS;
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

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: LocalComment = {
      id: Date.now().toString(),
      author: authorName.trim() || 'Geo Explorer',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 1,
      badge: 'Player',
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem('geo_game_user_comments', JSON.stringify(updated));
    setNewCommentText('');
  };

  const handleLikeComment = (commentId: string) => {
    const updated = comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    setComments(updated);
    localStorage.setItem('geo_game_user_comments', JSON.stringify(updated));
  };

  const totalResponses = Object.values(reactions).reduce((acc: number, curr: number) => acc + curr, 0);

  useEffect(() => {
    const pageUrl = url || window.location.href;
    const pageIdentifier = identifier || 'geo-game-forum';

    // Set configuration function for Disqus
    window.disqus_config = function (this: { page: { url?: string; identifier?: string; title?: string } }) {
      this.page.url = pageUrl;
      this.page.identifier = pageIdentifier;
      if (title) {
        this.page.title = title;
      }
    };

    const existingScript = document.getElementById('dsq-embed-scr') as HTMLScriptElement | null;

    if (window.DISQUS) {
      try {
        window.DISQUS.reset({
          reload: true,
          config: function (this: { page: { url?: string; identifier?: string; title?: string } }) {
            this.page.url = pageUrl;
            this.page.identifier = pageIdentifier;
            if (title) {
              this.page.title = title;
            }
          },
        });
        setHasError(false);
      } catch (err) {
        console.warn('Disqus reset error:', err);
      }
    } else if (!existingScript) {
      try {
        const d = document;
        const s = d.createElement('script');
        s.id = 'dsq-embed-scr';
        s.src = `https://${shortname}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onerror = () => {
          setHasError(true);
        };
        (d.head || d.body).appendChild(s);
      } catch (e) {
        console.warn('Error loading Disqus script:', e);
        setHasError(true);
      }
    }
  }, [url, identifier, title, shortname]);

  return (
    <div id="disqus-container" className={`w-full ${className}`}>
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-b-8 border-indigo-200 text-slate-800 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black shrink-0 shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Community & Feedback</span>
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Share your geography high scores, feedback, and join the discussion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://geofun.disqus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition-colors"
            >
              <span>Disqus Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              Live
            </span>
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

          {/* Reaction Items */}
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

        {/* 2. Instant Community Comment Box */}
        <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Leave a Comment or Game Review</span>
          </h3>

          <form onSubmit={handlePostComment} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative sm:w-1/3">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Your Name / Nickname"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Share a thought, flag quiz tip, or score..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium text-slate-800 placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Comment Stream */}
          <div className="space-y-3 pt-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{comment.author}</span>
                    {comment.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {comment.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{comment.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{comment.text}</p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    type="button"
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likes}</span>
                  </button>
                  <span className="text-[11px] text-slate-400">· Reply</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Disqus Universal Thread */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Disqus Thread (geofun)</span>
          </div>

          {hasError ? (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2 text-slate-600">
              <AlertCircle className="w-5 h-5 mx-auto text-indigo-600" />
              <p className="text-xs font-bold text-slate-800">
                Disqus embedded sync is active. Check third-party cookie permissions if blocked by browser.
              </p>
            </div>
          ) : (
            <div id="disqus_thread" className="min-h-[180px]" />
          )}

          <noscript>
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" rel="nofollow" className="text-indigo-600 underline font-medium">
              comments powered by Disqus.
            </a>
          </noscript>
        </div>
      </div>
    </div>
  );
};


