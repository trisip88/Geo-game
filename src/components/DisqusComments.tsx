import React, { useEffect, useState } from 'react';
import { MessageSquare, Sparkles, AlertCircle } from 'lucide-react';

interface DisqusCommentsProps {
  articleId?: string;
  articleTitle?: string;
  articleUrl?: string;
  language?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  articleId = 'geo-game-main-hub',
  articleTitle = 'Geo-Game: Open Geography Challenge',
  articleUrl,
  language = 'zh_TW',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      const canonicalUrl =
        articleUrl ||
        (typeof window !== 'undefined'
          ? window.location.href.split('?')[0].split('#')[0]
          : 'https://github.com/trisip88/Geo-game');

      // Setup window.disqus_config
      (window as any).disqus_config = function () {
        this.page.url = canonicalUrl;
        this.page.identifier = articleId;
        this.page.title = articleTitle;
        this.language = language;
      };

      // Check if script already exists
      const existingScript = document.getElementById('disqus-embed-script');
      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.id = 'disqus-embed-script';
        s.src = 'https://geo-game.disqus.com/embed.js';
        s.setAttribute('data-timestamp', (+new Date()).toString());
        s.async = true;
        s.onerror = () => {
          setHasError(true);
        };
        (d.head || d.body).appendChild(s);
      } else if ((window as any).DISQUS) {
        // If already loaded, reset for new identifier/url
        try {
          (window as any).DISQUS.reset({
            reload: true,
            config: function () {
              this.page.url = canonicalUrl;
              this.page.identifier = articleId;
              this.page.title = articleTitle;
              this.language = language;
            },
          });
        } catch {
          // Ignore reset errors during unmounts
        }
      }
    } catch {
      setHasError(true);
    }
  }, [articleId, articleTitle, articleUrl, language]);

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
              Disqus Forum · shortname: <code className="text-indigo-600 font-mono">geo-game</code>
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[220px] w-full">
        {hasError ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-600 text-xs font-medium">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span>
              Disqus embed could not be loaded directly (may be blocked by browser privacy/ad-block settings). You can also participate directly on the{' '}
              <a
                href="https://disqus.com/home/forums/geo-game/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 underline font-bold"
              >
                geo-game forum channel
              </a>
              .
            </span>
          </div>
        ) : (
          <div id="disqus_thread" />
        )}
      </div>
    </div>
  );
};
