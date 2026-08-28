import React, { useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    // Run Disqus universal embed code exactly as provided
    (function () {
      const d = document;
      const existing = document.getElementById('disqus-embed-script');
      if (existing) {
        existing.remove();
      }
      const s = d.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://geo-game.disqus.com/embed.js';
      s.setAttribute('data-timestamp', (+new Date()).toString());
      s.onerror = () => {
        // Suppress unhandled third-party script failure
      };
      (d.head || d.body).appendChild(s);
    })();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-b-8 border-indigo-200 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
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
      </div>

      <div className="min-h-[250px] w-full">
        {/* Exact standard Disqus Thread */}
        <div id="disqus_thread"></div>
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
