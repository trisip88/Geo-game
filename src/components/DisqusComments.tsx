import React from 'react';
import { DiscussionEmbed } from 'disqus-react';
import { MessageSquare, Sparkles } from 'lucide-react';

interface DisqusCommentsProps {
  articleId?: string;
  articleTitle?: string;
  articleUrl?: string;
  language?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  articleId = 'geo-game-community',
  articleTitle = 'Geo-Game: Open Geography Challenge',
  articleUrl,
  language = 'en',
}) => {
  // Use current window location if available, with a fallback
  const disqusUrl =
    articleUrl ||
    (typeof window !== 'undefined'
      ? window.location.href.split('?')[0].split('#')[0]
      : 'https://github.com/trisip88/Geo-game');

  const disqusConfig = {
    url: disqusUrl,
    identifier: articleId,
    title: articleTitle,
    language: language,
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-b-8 border-indigo-200 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-indigo-950 flex items-center justify-center font-black shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
              <span>Community Discussion & Player Forum</span>
              <Sparkles className="w-4 h-4 text-pink-500" />
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Share coordinates tips, landmark insights, and high scores via Disqus
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[300px] w-full">
        <DiscussionEmbed shortname="geo-game" config={disqusConfig} />
      </div>
    </div>
  );
};
