import React, { useEffect, useState } from 'react';
import { MessageSquare, Sparkles, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';

const DISQUS_SHORTNAME = 'geofun';
const DISQUS_IDENTIFIER = 'geo-game-forum';
const DISQUS_TITLE = 'Geography Guessing Game Community Discussion';
const DISQUS_SCRIPT_ID = 'dsq-embed-scr';

interface DisqusPage {
  page: { url?: string; identifier?: string; title?: string };
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config?: (this: DisqusPage) => void }) => void;
    };
    disqus_config?: (this: DisqusPage) => void;
  }
}

export const DisqusComments: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'blocked'>('loading');

  useEffect(() => {
    // Canonical, query/hash-free URL so every visitor resolves to the same thread
    // instead of Disqus creating a new one per URL variant.
    const pageUrl = window.location.origin + window.location.pathname;

    window.disqus_config = function (this: DisqusPage) {
      this.page.url = pageUrl;
      this.page.identifier = DISQUS_IDENTIFIER;
      this.page.title = DISQUS_TITLE;
    };

    let timeout = 0;
    const startWatchdog = () => {
      timeout = window.setTimeout(() => {
        setStatus((prev) => (window.DISQUS ? 'ready' : prev === 'loading' ? 'blocked' : prev));
      }, 8000);
    };

    if (window.DISQUS) {
      // embed.js already loaded (remount, or StrictMode's second pass) — the script
      // only renders the thread once, so a remount needs an explicit reset.
      window.DISQUS.reset({ reload: true, config: window.disqus_config });
      setStatus('ready');
    } else if (document.getElementById(DISQUS_SCRIPT_ID)) {
      startWatchdog();
    } else {
      const s = document.createElement('script');
      s.id = DISQUS_SCRIPT_ID;
      s.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
      s.setAttribute('data-timestamp', String(+new Date()));
      s.async = true;
      s.onload = () => setStatus('ready');
      s.onerror = () => setStatus('blocked');
      (document.head || document.body).appendChild(s);
      startWatchdog();
    }

    return () => {
      window.clearTimeout(timeout);
      // Disqus injects iframes into #disqus_thread that React does not own, so they
      // survive unmount and block the next render. Clear them; the next mount resets.
      const thread = document.getElementById('disqus_thread');
      if (thread) thread.innerHTML = '';
    };
  }, []);

  return (
    <div id="disqus-container" className="w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-b-8 border-indigo-200 text-slate-800 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
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
          <div className="flex items-center gap-2">
            <a
              href={`https://${DISQUS_SHORTNAME}.disqus.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition-colors"
            >
              <span>Disqus Board</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {status === 'loading' && (
          <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading comments…</span>
          </div>
        )}

        {status === 'blocked' && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
              Comments could not load — an ad blocker or privacy extension may be blocking Disqus. You
              can still join the conversation on the{' '}
              <a
                href={`https://${DISQUS_SHORTNAME}.disqus.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold"
              >
                Disqus board
              </a>
              .
            </p>
          </div>
        )}

        {/* The real Disqus thread — this is the comment section. */}
        <div id="disqus_thread" className="min-h-[200px] w-full" />

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
