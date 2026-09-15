import { useEffect, useRef } from 'react';

/**
 * Executes callback when the page enters:
 * - If reached via a blade transition: waits for 'alaryam:page-enter' event so the intro starts as the blade exits.
 * - On first load / direct SSG hydration / popstate: executes immediately.
 */
export function usePageEnter(callback: () => void, deps: any[] = []) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).__ALARYAM_BLADE_ACTIVE__) {
      const handler = () => {
        cbRef.current();
      };
      window.addEventListener('alaryam:page-enter', handler, { once: true });
      return () => window.removeEventListener('alaryam:page-enter', handler);
    } else {
      cbRef.current();
    }
  }, deps);
}
