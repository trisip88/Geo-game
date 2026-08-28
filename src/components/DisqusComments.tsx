import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

interface DisqusCommentsProps {
  url?: string;
  identifier?: string;
  title?: string;
  className?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  url,
  identifier = 'geo-game-forum',
  title = 'Geo Game Community Discussion',
  className = '',
}) => {
  const [loadError, setLoadError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const pageUrl = url || window.location.href;
    const pageIdentifier = identifier || 'geo-game-forum';

    // Set Disqus configuration exactly as standard universal code
    (window as any).disqus_config = function (this: any) {
      this.page.url = pageUrl;
      this.page.identifier = pageIdentifier;
      if (title) {
        this.page.title = title;
      }
    };

    // If DISQUS is already loaded on window, trigger a clean reset
    if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: (window as any).disqus_config,
        });
        setLoadError(false);
      } catch (err) {
        console.warn('Disqus reset error:', err);
        setLoadError(true);
      }
    } else {
      // Remove any existing script tag if any to avoid duplication
      const existingScript = document.getElementById('dsq-embed-scr');
      if (existingScript) {
        existingScript.remove();
      }

      try {
        const d = document;
        const s = d.createElement('script');
        s.id = 'dsq-embed-scr';
        s.src = 'https://geofun.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onerror = () => {
          setLoadError(true);
          setIsRetrying(false);
        };
        s.onload = () => {
          setLoadError(false);
          setIsRetrying(false);
        };
        (d.head || d.body).appendChild(s);
      } catch (err) {
        console.warn('Error loading Disqus script:', err);
        setLoadError(true);
        setIsRetrying(false);
      }
    }
  }, [url, identifier, title, isRetrying]);

  const handleRetry = () => {
    setIsRetrying(true);
    setLoadError(false);
  };

  return (
    <div id="community-discussion" className={`w-full ${className}`}>
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-b-8 border-indigo-200 text-slate-800 space-y-6">
        {/* Header matching the recipe app discussion style */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Community Discussion
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

        {/* Fallback / Error State if script is blocked */}
        {loadError ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800">
              Unable to load Disqus comments
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Please check your internet connection or ad-blocker settings to view the discussion.
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>Retry Loading</span>
            </button>
          </div>
        ) : (
          <div id="disqus_thread" className="min-h-[220px]"></div>
        )}

        <noscript>
          Please enable JavaScript to view the{' '}
          <a
            href="https://disqus.com/?ref_noscript"
            rel="nofollow"
            className="text-indigo-600 underline font-medium"
          >
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};

