// components/Turnstile.tsx
import { useEffect, useRef } from 'react';

interface TurnstileProps {
  sitekey: string;
  onVerify: (token: string) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: (error: string) => void;
        'expired-callback'?: () => void;
        'timeout-callback'?: () => void;
      }) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

const Turnstile: React.FC<TurnstileProps> = ({ sitekey, onVerify }) => {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const loadScript = () => {
      if (scriptRef.current || document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]')) {
        renderWidget(); // Script already loaded, just render
        return;
      }

      scriptRef.current = document.createElement('script');
      scriptRef.current.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      scriptRef.current.async = true;
      scriptRef.current.defer = true;
      scriptRef.current.onload = renderWidget;
      scriptRef.current.onerror = () => console.error('Failed to load Turnstile script');
      document.body.appendChild(scriptRef.current);
    };

    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey,
          callback: onVerify,
          'error-callback': (error) => {
            console.error('Turnstile error:', error);
            onVerify(''); // Clear invalid token
            if (widgetIdRef.current) window.turnstile.reset(widgetIdRef.current); // Reset on error
          },
          'expired-callback': () => {
            console.log('Turnstile token expired');
            onVerify('');
            if (widgetIdRef.current) window.turnstile.reset(widgetIdRef.current); // Auto-reset for seamless UX
          },
          'timeout-callback': () => {
            console.log('Turnstile challenge timed out');
            if (widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
          },
        });
      }
    };

    loadScript();

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [sitekey, onVerify]); // Dependencies ensure re-render only on key changes

  return <div ref={turnstileRef} />;
};

export default Turnstile;
