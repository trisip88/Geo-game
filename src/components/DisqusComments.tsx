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
  const [forumShortname, setForumShortname] = useState('geo-game');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canonicalUrl =
    articleUrl ||
    (typeof window !== 'undefined'
      ? window.location.href.split('?')[0].split('#')[0]
      : 'https://github.com/trisip88/Geo-game');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    try {
      (window as any).disqus_config = function () {
        this.page.url = canonicalUrl;
        this.page.identifier = articleId;
        this.page.title = articleTitle;
        this.language = language;
      };

      if ((window as any).DISQUS) {
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
        const existingScript = document.getElementById('disqus-embed-script');
        if (existingScript) {
          existingScript.remove();
        }

        const s = document.createElement('script');
        s.id = 'disqus-embed-script';
        s.src = `https://${forumShortname}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', (+new Date()).toString());
        s.async = true;
        s.onerror = () => {
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
          }
        };
        (document.head || document.body).appendChild(s);
      }

      // Check if Disqus iframe actually rendered after timeout
      const timer = setTimeout(() => {
        if (!isMounted) return;
        setIsLoading(false);
        const threadEl = document.getElementById('disqus_thread');
        if (threadEl && (!threadEl.childNodes || threadEl.childNodes.length === 0)) {
          setHasError(true);
        }
      }, 3500);

      return () => {
        clearTimeout(timer);
      };
    } catch {
      if (isMounted) {
        setHasError(true);
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [articleId, articleTitle, canonicalUrl, language, forumShortname, loadKey]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-b-8 border-indigo-200 text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-indigo-950 flex items-center justify-center font-black shadow-sm shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
              <span>Community Discussion & Player Forum</span>
              <Sparkles className="w-4 h-4 text-pink-500" />
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Disqus Forum · shortname: <code className="text-indigo-600 font-mono font-black">{forumShortname}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {isCustomizing ? 'Done' : 'Change Forum Shortname'}
          </button>
        </div>
      </div>

      {isCustomizing && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
            Disqus Site Shortname:
          </label>
          <input
            type="text"
            value={forumShortname}
            onChange={(e) => setForumShortname(e.target.value.trim().toLowerCase())}
            placeholder="e.g. geo-game or your-site-name"
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => {
              setLoadKey((k) => k + 1);
              setIsCustomizing(false);
            }}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            Apply & Reload
          </button>
        </div>
      )}

      <div className="min-h-[200px] w-full" ref={containerRef}>
        {isLoading && !hasError && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
            <p className="text-xs font-bold">Connecting to Disqus forum...</p>
          </div>
        )}

        {hasError ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-indigo-50/80 to-white border border-indigo-100 flex flex-col items-center text-center gap-3 text-slate-700">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">Disqus Embed Notice</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                If the comments do not render, it is usually because:
              </p>
              <ul className="text-xs text-slate-600 mt-2 space-y-1 text-left list-disc list-inside max-w-md mx-auto">
                <li>An <strong>Ad-blocker / Tracking Shield</strong> (Brave, uBlock, Safari) blocked <code>*.disqus.com</code>.</li>
                <li>The shortname <code className="font-mono text-indigo-600 font-bold">{forumShortname}</code> is not registered yet on <a href="https://disqus.com/admin/create/" target="_blank" rel="noreferrer" className="underline text-indigo-600 font-bold">disqus.com</a>.</li>
                <li>The sandbox preview domain requires adding to Disqus <em>Trusted Domains</em>.</li>
              </ul>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              <button
                onClick={() => setLoadKey((k) => k + 1)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading</span>
              </button>
              <a
                href={`https://${forumShortname}.disqus.com/`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black flex items-center gap-1.5 shadow-[0_3px_0_#9D174D] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <span>Open {forumShortname} Forum</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div id="disqus_thread" className={isLoading ? 'hidden' : 'block'} />
        )}
      </div>
    </div>
  );
};
