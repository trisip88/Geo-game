import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against third-party cross-origin script errors (e.g. Disqus / ad-trackers / browser extensions)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // If message is generic "Script error." or from external domains, prevent bubbling
    if (
      event.message === 'Script error.' ||
      (event.filename && !event.filename.includes(window.location.host))
    ) {
      event.preventDefault();
      console.warn('Suppressed third-party script error:', event.message, event.filename);
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason?.message || event.reason || '');
    if (reasonStr.includes('Disqus') || reasonStr.includes('disqus') || reasonStr.includes('Script error')) {
      event.preventDefault();
      console.warn('Suppressed third-party promise rejection:', reasonStr);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
