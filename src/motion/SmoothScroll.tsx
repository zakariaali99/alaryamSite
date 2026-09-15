import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only run on desktop fine-pointer with no reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;

    if (prefersReducedMotion || !isDesktop) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      autoResize: true,
      prevent: (node) => {
        return node?.hasAttribute('data-lenis-prevent') || !!node?.closest('[data-lenis-prevent]');
      },
    });
    lenisRef.current = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Watch body overflow style to pause Lenis when mobile drawer is open
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === 'hidden') {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      observer.disconnect();
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    // Refresh ScrollTrigger so trigger positions match the newly loaded page
    ScrollTrigger.refresh();
  }, [location.pathname]);

  return <>{children}</>;
};
