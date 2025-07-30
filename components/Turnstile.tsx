import { useEffect, useRef } from 'react';

interface TurnstileProps {
  sitekey: string;
  onVerify: (token: string) => void;
}

// Extend window for Turnstile API
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: (error: string) => void;
        'expired-callback'?: () => void;
        'timeout-callback'?: () => void;
      }) => string; // Returns widget ID
      remove: (widgetId: string | HTMLElement) => void;
      reset: (widgetId: string | HTMLElement) => void;
    };
  }
}

const Turnstile: React.FC<TurnstileProps> = ({ sitekey, onVerify }) => {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Prevent multiple script loads
    if (scriptLoadedRef.current) return;

    const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]');
    let script: HTMLScriptElement | null = null;

    const loadScript = () => {
      if (!existingScript) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
            // Render widget only if not already rendered
            widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
              sitekey,
              callback: onVerify,
              'error-callback': (error) => console.error('Turnstile error:', error),
              'expired-callback': () => {
                console.log('Turnstile token expired');
                onVerify(''); // Clear token on expiration
              },
              'timeout-callback': () => console.log('Turnstile challenge timed out'),
            });
            console.log('Turnstile rendered, widget ID:', widgetIdRef.current);
          }
        };
        script.onerror = () => console.error('Failed to load Turnstile script');
        document.body.appendChild(script);
        scriptLoadedRef.current = true;
      } else if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        // Render immediately if script is already loaded
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey,
          callback: onVerify,
          'error-callback': (error) => console.error('Turnstile error:', error),
          'expired-callback': () => {
            console.log('Turnstile token expired');
            onVerify(''); // Clear token on expiration
          },
          'timeout-callback': () => console.log('Turnstile challenge timed out'),
        });
        console.log('Turnstile rendered (existing script), widget ID:', widgetIdRef.current);
      }
    };

    loadScript();

    // Cleanup on unmount or re-render
    return () => {
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          console.log('Turnstile widget removed:', widgetIdRef.current);
        } catch (error) {
          console.error('Error removing Turnstile widget:', error);
        }
        widgetIdRef.current = null;
      }
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
        scriptLoadedRef.current = false;
      }
    };
  }, [sitekey, onVerify]);

  return <div ref={turnstileRef} />;
};

export default Turnstile;