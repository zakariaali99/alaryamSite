import { useEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from './gsap';
import { motionTokens } from './tokens';

export function useCountUp(elRef: RefObject<HTMLElement | null>, targetValue: number) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      elRef.current.textContent = String(targetValue).padStart(2, '0');
      return;
    }

    const obj = { val: 0 };
    const el = elRef.current;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: targetValue,
          duration: motionTokens.durations.md,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val)).padStart(2, '0');
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [elRef, targetValue]);
}
