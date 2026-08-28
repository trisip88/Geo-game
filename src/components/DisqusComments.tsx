import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface DisqusCommentsProps {
  articleId?: string;
  articleTitle?: string;
  articleUrl?: string;
  language?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  articleId = 'geography-game-main-hub',
  articleTitle = 'Geography Guessing Game: Discussion & Leaderboard',
  articleUrl,
  language = 'zh_TW',
}) => {
  const [loadKey, setLoadKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canonicalUrl =
    articleUrl ||
    (typeof window !== 'undefined'
      ? window.location.href.split('?')[0].split('#')[0]
      : 'https://github.com/trisip88/Geo-game');

  useEffect(() => {
    let isMounted = true;
    setHasError(false);

    try {
      // Define window.disqus_config
      (window as any).disqus_config = function () {
        this.page.url = canonicalUrl;
        this.page.identifier = articleId;
        this.page.title = articleTitle;
        this.language = language;
      };

      if ((window as any).DISQUS) {
        // If DISQUS is already present on the page, reset it with current configuration
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
        } catch (e) {
          console.warn('Disqus reset error:', e);
        }
      } else {
        // Insert Disqus embed script
        const existingScript = document.getElementById('disqus-embed-script');
        if (!existingScript) {
          const s = document.createElement('script');
          s.id = 'disqus-embed-script';
          s.src = 'https://geo-game.disqus.com/embed.js';
          s.setAttribute('data-timestamp', (+new Date()).toString());
          s.async = true;
          s.onerror = () => {
            if (isMounted) setHasError(true);
          };
          (document.head || document.body).appendChild(s);
        }
      }
    } catch {
      if (isMounted) setHasError(true);
    }

    return () => {
      isMounted = false;
    };
  }, [articleId, articleTitle, canonicalUrl, language, loadKey]);

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

      <div className="min-h-[200px] w-full" ref={containerRef}>
        {hasError ? (
          <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col items-center text-center gap-3 text-slate-700">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">Disqus Discussion Channel</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Disqus comments can be accessed directly on the forum channel or reloaded below.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setLoadKey((k) => k + 1)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Embed</span>
              </button>
              <a
                href="https://disqus.com/home/forums/geo-game/"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black flex items-center gap-1.5 shadow-[0_3px_0_#9D174D] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <span>Open Geo-Game Forum</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div id="disqus_thread" />
        )}
      </div>
    </div>
  );
};
