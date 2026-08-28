import React, { useEffect, useState } from 'react';
import { MessageSquare, Sparkles, ExternalLink, AlertCircle, MonitorUp } from 'lucide-react';

export const DisqusComments: React.FC = () => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Check if running inside an iframe (like AI Studio preview)
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Set Disqus configuration
    (window as any).disqus_config = function (this: any) {
      this.page.url = window.location.href.split('#')[0];
      this.page.identifier = 'geo-game-forum';
      this.page.title = 'Geo Game Discussion';
    };

    // Load or reset Disqus
    if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: (window as any).disqus_config,
        });
      } catch (e) {
        console.warn('Disqus reset error:', e);
      }
    } else {
      const existing = document.getElementById('disqus-embed-script');
      if (existing) {
        existing.remove();
      }
      const s = document.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://geo-game.disqus.com/embed.js';
      s.setAttribute('data-timestamp', (+new Date()).toString());
      s.async = true;
      (document.head || document.body).appendChild(s);
    }

    // Check if Disqus iframe rendered inside the container
    const checkInterval = setInterval(() => {
      const threadEl = document.getElementById('disqus_thread');
      if (threadEl && threadEl.querySelector('iframe')) {
        setIsRendered(true);
        clearInterval(checkInterval);
      }
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
    }, 6000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

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
              Disqus Forum · shortname: <code className="text-indigo-600 font-mono font-black">geo-game</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInIframe && (
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors border border-indigo-200"
              title="Open app in a standalone tab"
            >
              <MonitorUp className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </button>
          )}
          <a
            href="https://geo-game.disqus.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-[0_2px_0_#9D174D]"
          >
            <span>Disqus Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Notice for preview iframe / ad-blocker environments */}
      {isInIframe && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Running inside AI Studio Preview iframe</p>
              <p className="text-amber-700 mt-0.5 leading-relaxed">
                Modern browsers (Chrome, Safari, Brave) block third-party cookies and script embeddings inside nested iframes. Click <strong>Open in New Tab</strong> to view the full live game with Disqus enabled.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenNewTab}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors"
          >
            Launch Standalone Tab
          </button>
        </div>
      )}

      <div className="min-h-[280px] w-full relative">
        {/* Standard Disqus Thread Container */}
        <div id="disqus_thread" className="min-h-[200px]"></div>

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-indigo-600 underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};

