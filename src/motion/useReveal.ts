import { useEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from './gsap';
import { motionTokens } from './tokens';

export function useReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 1024;
      const distance = isMobile
        ? motionTokens.revealDistance.mobile
        : motionTokens.revealDistance.desktop;

      const elements = containerRef.current?.querySelectorAll('[data-reveal]');
      if (!elements || elements.length === 0) return;

      ScrollTrigger.batch(elements, {
        start: 'top bottom-=10%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: distance },
            {
              opacity: 1,
              y: 0,
              duration: motionTokens.durations.md,
              stagger: motionTokens.stagger.cards,
              ease: 'brand',
              overwrite: 'auto',
            }
          );
        },
      });

      if (document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [containerRef]);
}
