import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger } from './gsap';

export interface BladeNavigateOptions {
  replace?: boolean;
}

interface BladeContextValue {
  navigateWithBlade: (to: string, options?: BladeNavigateOptions) => Promise<void>;
  isTransitioning: boolean;
  activeDirection: 'ltr' | 'rtl';
  overlayRef: React.RefObject<BladeOverlayHandle | null>;
}

export interface BladeOverlayHandle {
  cover: (direction: 'ltr' | 'rtl') => Promise<void>;
  reveal: (direction: 'ltr' | 'rtl') => Promise<void>;
}

const BladeContext = createContext<BladeContextValue | null>(null);

export const BladeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeDirection, setActiveDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const overlayRef = useRef<BladeOverlayHandle | null>(null);
  const isNavigatingRef = useRef(false);

  // Handle browser back / forward (popstate) without blade overlay
  useEffect(() => {
    const handlePopState = () => {
      (window as any).__ALARYAM_BLADE_ACTIVE__ = false;
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      setTimeout(() => {
        ScrollTrigger.refresh();
        window.dispatchEvent(new CustomEvent('alaryam:page-enter'));
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateWithBlade = useCallback(
    async (to: string, options?: BladeNavigateOptions) => {
      // 1. Skip blade if target is hash, external, or same route
      if (!to || to.startsWith('#')) return;
      if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('//')) {
        window.location.href = to;
        return;
      }

      const currentPath = location.pathname.replace(/\/+$/, '') || '/';
      const targetPath = to.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

      if (targetPath === currentPath) {
        if ((window as any).__lenis) {
          (window as any).__lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
        return;
      }

      // Check reduced motion
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        navigate(to, options);
        window.scrollTo(0, 0);
        window.dispatchEvent(new CustomEvent('alaryam:page-enter'));
        return;
      }

      // Ignore if transition already running
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      // Reading direction of the page being LEFT (current language)
      const currentDir: 'ltr' | 'rtl' = location.pathname.startsWith('/ar') ? 'rtl' : 'ltr';
      setActiveDirection(currentDir);

      // Increment behavioral audit counter
      (window as any).__blade = ((window as any).__blade || 0) + 1;
      (window as any).__ALARYAM_BLADE_ACTIVE__ = true;

      // Stop Lenis during transition
      if ((window as any).__lenis) {
        (window as any).__lenis.stop();
      }

      setIsTransitioning(true);

      try {
        // Step 1 & 2: Cover (0.36s brandInOut) + Hold (0.16s mark scale/fade)
        if (overlayRef.current) {
          await overlayRef.current.cover(currentDir);
        }

        // Step 3: While fully covered: navigate and scroll to top
        navigate(to, options);
        if ((window as any).__lenis) {
          (window as any).__lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }

        // Wait for new route to commit and fonts to load
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => setTimeout(resolve, 60));
        if (document.fonts) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 300)),
          ]);
        }

        // Refresh ScrollTrigger and trigger page enter
        ScrollTrigger.refresh();
        window.dispatchEvent(new CustomEvent('alaryam:page-enter'));

        // Step 4: Reveal (0.42s brand)
        if (overlayRef.current) {
          await overlayRef.current.reveal(currentDir);
        }

        // Move focus to <h1> of new page
        const h1 = document.querySelector('h1');
        if (h1) {
          h1.setAttribute('tabindex', '-1');
          h1.focus({ preventScroll: true });
        }

        // Announce title for screen readers
        if (document.title) {
          setLiveAnnouncement(document.title);
        }
      } catch (err) {
        console.error('Blade transition error:', err);
      } finally {
        (window as any).__ALARYAM_BLADE_ACTIVE__ = false;
        setIsTransitioning(false);
        isNavigatingRef.current = false;

        // Restart Lenis
        if ((window as any).__lenis) {
          (window as any).__lenis.start();
        }
      }
    },
    [location.pathname, navigate]
  );

  return (
    <BladeContext.Provider
      value={{
        navigateWithBlade,
        isTransitioning,
        activeDirection,
        overlayRef,
      }}
    >
      {children}
      {/* Live region for accessibility announcement on route change */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only pointer-events-none"
      >
        {liveAnnouncement}
      </div>
    </BladeContext.Provider>
  );
};

export function useBladeNavigate() {
  const ctx = useContext(BladeContext);
  if (!ctx) {
    const navigate = useNavigate();
    return {
      navigateWithBlade: async (to: string, options?: BladeNavigateOptions) => {
        navigate(to, options);
      },
      isTransitioning: false,
    };
  }
  return ctx;
}
