import { useEffect, RefObject } from 'react';
import { gsap } from './gsap';

export function useTilt(cardRef: RefObject<HTMLElement | null>, maxAngle = 5) {
  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;
    if (prefersReducedMotion || !isDesktop) return;

    const el = cardRef.current;
    const isRtl = document.documentElement.dir === 'rtl';

    gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });

    const rotateXTo = gsap.quickTo(el, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    const rotateYTo = gsap.quickTo(el, 'rotateY', { duration: 0.35, ease: 'power2.out' });

    const iconEl = el.querySelector<HTMLElement>('.rounded-icon');
    const arrowEl = el.querySelector<HTMLElement>('svg.transition-transform');

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      rotateXTo(-y * maxAngle * 2);
      rotateYTo(x * maxAngle * 2);

      if (iconEl) {
        gsap.to(iconEl, { y: -6, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }
      if (arrowEl) {
        const arrowX = isRtl ? -6 : 6;
        gsap.to(arrowEl, { x: arrowX, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }
    };

    const handleMouseLeave = () => {
      rotateXTo(0);
      rotateYTo(0);

      if (iconEl) {
        gsap.to(iconEl, { y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }
      if (arrowEl) {
        gsap.to(arrowEl, { x: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { rotateX: 0, rotateY: 0 });
      if (iconEl) gsap.set(iconEl, { y: 0 });
      if (arrowEl) gsap.set(arrowEl, { x: 0 });
    };
  }, [cardRef, maxAngle]);
}
