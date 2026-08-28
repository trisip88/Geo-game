import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

interface DisqusCommentsProps {
  url?: string;
  identifier?: string;
  title?: string;
  shortname?: string;
  className?: string;
}

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
      // If Disqus is already loaded, reset for the current page/thread
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
      // Only inject the script if it hasn't been added yet (prevents StrictMode duplicate script tag race)
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-b-8 border-indigo-200 text-slate-800 space-y-6">
        {/* Section Header */}
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

        {hasError ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2 text-slate-600">
            <AlertCircle className="w-6 h-6 mx-auto text-indigo-600" />
            <p className="text-sm font-bold text-slate-800">Comments widget could not be loaded</p>
            <p className="text-xs">
              Please check your internet connection or ad-blocker settings to view the discussion.
            </p>
          </div>
        ) : (
          <div id="disqus_thread" className="min-h-[220px]" />
        )}

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

