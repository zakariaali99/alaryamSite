import { useEffect, RefObject } from 'react';
import { gsap, SplitText, ScrollTrigger } from './gsap';
import { motionTokens } from './tokens';

export function useSplitHeading(headingRef: RefObject<HTMLElement | null>, triggerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined' || !headingRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targetEl = headingRef.current;
    let split: SplitText | null = null;
    let trigger: ScrollTrigger | null = null;

    try {
      // Split words only — NEVER characters, to preserve Arabic cursive ligatures
      split = new SplitText(targetEl, {
        type: 'words',
        wordsClass: 'inline-block transform-gpu will-change-transform align-top overflow-hidden',
      });

      // Wrap each word inner for masking
      split.words.forEach((word) => {
        const inner = document.createElement('span');
        inner.className = 'inline-block will-change-transform';
        inner.innerHTML = word.innerHTML;
        word.innerHTML = '';
        word.appendChild(inner);
      });

      const inners = targetEl.querySelectorAll('.inline-block > span');

      gsap.set(inners, { yPercent: 110, opacity: 0 });

      trigger = ScrollTrigger.create({
        trigger: triggerRef?.current || targetEl,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(inners, {
            yPercent: 0,
            opacity: 1,
            duration: motionTokens.durations.lg,
            stagger: motionTokens.stagger.words,
            ease: 'brand',
          });
        },
      });
    } catch (e) {
      console.warn('SplitText error:', e);
    }

    return () => {
      trigger?.kill();
      split?.revert();
    };
  }, [headingRef, triggerRef]);
}
