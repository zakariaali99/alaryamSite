import React, { useEffect, useRef } from 'react';
import { useBladeNavigate, BladeOverlayHandle } from './BladeTransitionContext';
import { gsap } from './gsap';
import { BLADE_K } from './tokens';

export const BladeTransition: React.FC = () => {
  const { overlayRef, isTransitioning } = useBladeNavigate();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const bladeRef = useRef<HTMLDivElement | null>(null);
  const stripeRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handle: BladeOverlayHandle = {
      cover: (direction: 'ltr' | 'rtl') => {
        return new Promise<void>((resolve) => {
          if (!containerRef.current || !rigRef.current || !bladeRef.current || !stripeRef.current) {
            resolve();
            return;
          }

          const container = containerRef.current;
          const rig = rigRef.current;
          const blade = bladeRef.current;
          const stripe = stripeRef.current;
          const mark = markRef.current;

          container.style.visibility = 'visible';
          container.style.pointerEvents = 'auto';

          const H = window.innerHeight;
          const W = window.innerWidth;
          const RUN = H * BLADE_K;
          const bladeWidth = W + RUN * 2 + 80;

          blade.style.width = `${bladeWidth}px`;
          blade.style.height = `${H}px`;
          stripe.style.height = `${H}px`;

          let startX = 0;
          let coveredX = 0;

          if (direction === 'ltr') {
            // Blade moves Left -> Right
            // Slant: top is shifted right relative to bottom
            blade.style.clipPath = `polygon(${RUN}px 0, 100% 0, calc(100% - ${RUN}px) 100%, 0 100%)`;

            // Leading stripe (14px wide, 8px gap ahead of blade right edge)
            stripe.style.width = `${14 + RUN}px`;
            stripe.style.left = `${bladeWidth + 8}px`;
            stripe.style.clipPath = `polygon(${RUN}px 0, 100% 0, calc(100% - ${RUN}px) 100%, 0 100%)`;

            // Start off-screen to the left: rightmost point is bladeWidth + 8 + 14 + RUN
            const totalRigWidth = bladeWidth + 30 + RUN;
            startX = -totalRigWidth - 20;
            // Fully covering position: left edge must be <= 0 everywhere
            coveredX = -RUN - 10;
          } else {
            // Blade moves Right -> Left
            // Slant: mirrored for RTL
            blade.style.clipPath = `polygon(0 0, calc(100% - ${RUN}px) 0, 100% 100%, ${RUN}px 100%)`;

            // Leading stripe (14px wide, 8px gap ahead of blade left edge)
            stripe.style.width = `${14 + RUN}px`;
            stripe.style.left = `${-22 - RUN}px`;
            stripe.style.clipPath = `polygon(0 0, calc(100% - ${RUN}px) 0, 100% 100%, ${RUN}px 100%)`;

            // Start off-screen to the right
            startX = W + 40 + RUN;
            // Fully covering position
            coveredX = W - bladeWidth + RUN + 10;
          }

          // Initial positions
          gsap.set(rig, { x: startX });
          if (mark) {
            gsap.set(mark, { opacity: 0, scale: 0.85 });
          }

          const tl = gsap.timeline({
            onComplete: () => resolve(),
          });

          // 1. Cover (0.36s brandInOut)
          tl.to(rig, {
            x: coveredX,
            duration: 0.36,
            ease: 'brandInOut',
          });

          // 2. Hold (~0.16s) with Mark scale and fade in
          if (mark) {
            tl.to(
              mark,
              {
                opacity: 1,
                scale: 1,
                duration: 0.16,
                ease: 'power2.out',
              },
              '-=0.04'
            );
          }
        });
      },

      reveal: (direction: 'ltr' | 'rtl') => {
        return new Promise<void>((resolve) => {
          if (!containerRef.current || !rigRef.current) {
            resolve();
            return;
          }

          const container = containerRef.current;
          const rig = rigRef.current;
          const mark = markRef.current;
          const W = window.innerWidth;
          const H = window.innerHeight;
          const RUN = H * BLADE_K;
          const bladeWidth = W + RUN * 2 + 80;

          let exitX = 0;
          if (direction === 'ltr') {
            // Exit off-screen to the right
            exitX = W + 40 + RUN;
          } else {
            // Exit off-screen to the left
            const totalRigWidth = bladeWidth + 30 + RUN;
            exitX = -totalRigWidth - 40;
          }

          const tl = gsap.timeline({
            onComplete: () => {
              container.style.visibility = 'hidden';
              container.style.pointerEvents = 'none';
              resolve();
            },
          });

          // Fade out mark quickly
          if (mark) {
            tl.to(mark, {
              opacity: 0,
              duration: 0.1,
              ease: 'power2.in',
            });
          }

          // Continue blade exit (0.42s brand)
          tl.to(
            rig,
            {
              x: exitX,
              duration: 0.42,
              ease: 'brand',
            },
            mark ? '-=0.06' : 0
          );
        });
      },
    };

    if (overlayRef) {
      (overlayRef as React.MutableRefObject<BladeOverlayHandle | null>).current = handle;
    }

    return () => {
      if (overlayRef) {
        (overlayRef as React.MutableRefObject<BladeOverlayHandle | null>).current = null;
      }
    };
  }, [overlayRef]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
      style={{ visibility: 'hidden' }}
    >
      {/* Moving Rig containing Blade and Leading Stripe */}
      <div
        ref={rigRef}
        className="absolute top-0 left-0 h-full will-change-transform transform-gpu"
      >
        {/* Solid brand-600 Blade */}
        <div
          ref={bladeRef}
          className="absolute top-0 left-0 bg-brand-600 shadow-2xl"
          style={{ width: '120vw', height: '100vh' }}
        />

        {/* Solid ink 14px Leading Stripe */}
        <div
          ref={stripeRef}
          className="absolute top-0 bg-ink shadow-lg"
          style={{ width: '200px', height: '100vh' }}
        />
      </div>

      {/* Centered White Logo Mark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={markRef}
          className="w-[112px] h-[62px] will-change-transform transform-gpu opacity-0"
        >
          <svg
            viewBox="0 0 3434 1900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block"
          >
            <g
              transform="translate(0.000000,1900.000000) scale(0.100000,-0.100000)"
              fill="var(--white)"
              stroke="none"
            >
              <path
                d="M17181 18640 c-1 -3 431 -1714 958 -3803 l959 -3798 2822 -5132
c1552 -2823 2825 -5135 2829 -5140 4 -4 546 -6 1204 -5 l1196 3 -4970 8915
c-2734 4903 -4977 8926 -4984 8940 -8 14 -14 23 -14 20z M12185 9718 c-2733 -4902 -4975 -8923 -4983 -8936 l-14 -22 1203 2
1203 3 2824 5135 2825 5135 958 3795 c527 2087 957 3796 955 3797 -2 2 -2239
-4007 -4971 -8909z M18980 10400 c0 -3 233 -935 519 -2072 l518 -2066 226 -414 226 -413
-42 -7 c-23 -3 -284 -7 -579 -7 l-538 -1 -14 -22 c-8 -13 -17 -33 -21 -45 l-6
-23 628 0 629 0 1279 -2340 1279 -2340 648 0 c356 0 648 2 648 4 0 4 -5330
9630 -5391 9736 -5 8 -8 13 -9 10z M12684 5572 c-1467 -2649 -2681 -4841 -2697 -4870 l-29 -52 652 2
651 3 1277 2337 1277 2338 625 -3 625 -2 1040 -2182 c572 -1200 1041 -2180
1043 -2178 2 1 -85 414 -194 916 l-197 914 -596 1268 -596 1267 -253 0 -252 0
-22 45 -22 45 -545 1 c-301 1 -558 4 -572 8 -26 6 -25 8 199 416 l225 410 518
2064 c285 1136 517 2066 515 2068 -1 2 -1204 -2165 -2672 -4815z M18162 4067 l-594 -1262 -199 -919 c-109 -506 -197 -921 -196 -923 2
-1 462 959 1022 2135 560 1175 1029 2158 1042 2185 l23 47 -252 0 -253 -1
-593 -1262z M660 564 l0 -205 503 6 c276 3 1699 15 3162 26 2199 16 2662 22 2675
33 12 11 175 15 885 20 479 3 1116 9 1417 12 l548 7 50 90 c27 49 50 91 50 93
0 2 -634 4 -1410 4 -775 0 -1410 2 -1410 4 0 2 12 25 26 50 15 26 25 48 23 50
-2 2 -1470 6 -3261 9 l-3258 6 0 -205z M29423 763 c-1245 -2 -2263 -6 -2263 -11 0 -4 12 -25 25 -47 14 -22
25 -43 25 -47 0 -5 -635 -8 -1411 -8 l-1410 0 43 -78 c24 -42 48 -85 53 -94
10 -16 103 -18 1425 -29 1162 -9 1418 -14 1430 -25 13 -11 478 -17 2680 -33
1466 -11 2889 -23 3163 -26 l497 -6 0 206 0 205 -997 -2 c-549 -2 -2016 -4
-3260 -5z"
                fillRule="evenodd"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
