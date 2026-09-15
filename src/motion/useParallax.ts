import { useEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from './gsap';

export function useScrollParallax(elRef: RefObject<HTMLElement | null>, yRange = 15) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = elRef.current;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const yPercent = (self.progress - 0.5) * yRange * 2;
        gsap.set(el, { yPercent });
      },
    });

    return () => {
      trigger.kill();
      gsap.set(el, { yPercent: 0 });
    };
  }, [elRef, yRange]);
}

export function usePointerParallax(
  containerRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  maxShift = 12
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || !targetRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;
    if (prefersReducedMotion || !isDesktop) return;

    const container = containerRef.current;
    const target = targetRef.current;

    const xTo = gsap.quickTo(target, 'x', { duration: 0.8, ease: 'power2.out' });
    const yTo = gsap.quickTo(target, 'y', { duration: 0.8, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * maxShift * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * maxShift * 2;

      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(target, { x: 0, y: 0 });
    };
  }, [containerRef, targetRef, maxShift]);
}
