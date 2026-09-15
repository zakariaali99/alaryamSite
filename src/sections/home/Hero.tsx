import React, { useRef } from 'react';
import { Container } from '../../components/Container';
import { Button } from '../../components/Button';
import { PeakLines } from '../../components/PeakLines';
import { useLang, useT } from '../../i18n/context';
import { gsap, ScrollTrigger, SplitText } from '../../motion/gsap';
import { motionTokens, BLADE_K } from '../../motion/tokens';
import { usePageEnter } from '../../motion/usePageEnter';

export const Hero: React.FC = () => {
  const { lang, isRtl } = useLang();
  const t = useT();

  const heroRef = useRef<HTMLElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const leadRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const stripeRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const markPathRef = useRef<SVGPathElement | null>(null);
  const ruleRef = useRef<HTMLDivElement | null>(null);
  const peaklinesRef = useRef<HTMLDivElement | null>(null);

  usePageEnter(() => {
    if (typeof window === 'undefined' || !heroRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Ensure all elements are immediately visible
      if (panelRef.current) gsap.set(panelRef.current, { xPercent: 0, opacity: 1 });
      if (stripeRef.current) gsap.set(stripeRef.current, { scaleY: 1, opacity: 1 });
      if (markPathRef.current) gsap.set(markPathRef.current, { drawSVG: '100%', fillOpacity: 1 });
      if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 1 });
      if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
      if (leadRef.current) gsap.set(leadRef.current, { opacity: 1, y: 0 });
      if (buttonsRef.current) gsap.set(buttonsRef.current.children, { opacity: 1, y: 0 });
      return;
    }

    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 1024;
      const tl = gsap.timeline({ defaults: { ease: 'brand' } });

      // 1. Initial states
      if (panelRef.current) {
        gsap.set(panelRef.current, {
          xPercent: isRtl ? -100 : 100,
        });
      }
      if (stripeRef.current) {
        gsap.set(stripeRef.current, {
          scaleY: 0,
          transformOrigin: 'top center',
        });
      }
      if (ruleRef.current) {
        gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'center' });
      }
      if (markPathRef.current) {
        gsap.set(markPathRef.current, {
          drawSVG: '0%',
          stroke: 'var(--white)',
          strokeWidth: 2,
          fillOpacity: 0,
        });
      }
      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { opacity: 0, y: 16 });
      }
      if (leadRef.current) {
        gsap.set(leadRef.current, { opacity: 0, y: 20 });
      }
      if (buttonsRef.current) {
        gsap.set(buttonsRef.current.children, { opacity: 0, y: 16 });
      }

      // Split heading words (Arabic safe: WORDS ONLY)
      let headingWords: HTMLElement[] = [];
      if (headingRef.current) {
        try {
          split = new SplitText(headingRef.current, {
            type: 'words',
            wordsClass: 'inline-block overflow-hidden align-top',
          });
          split.words.forEach((w) => {
            const inner = document.createElement('span');
            inner.className = 'inline-block transform-gpu';
            inner.innerHTML = w.innerHTML;
            w.innerHTML = '';
            w.appendChild(inner);
            headingWords.push(inner);
          });
          gsap.set(headingWords, { yPercent: 110, opacity: 0 });
        } catch (e) {
          console.warn('SplitText error:', e);
        }
      }

      // 2. Choreography
      // 0s: Panel slides in from its own edge (0.9s brand)
      if (panelRef.current) {
        tl.to(
          panelRef.current,
          {
            xPercent: 0,
            duration: 0.9,
            ease: 'brand',
          },
          0
        );
      }

      // 0.12s: Ink stripe follows (scaleY 0 -> 1)
      if (stripeRef.current) {
        tl.to(
          stripeRef.current,
          {
            scaleY: 1,
            duration: 0.75,
            ease: 'brand',
          },
          0.12
        );
      }

      // 0.2s: Text eyebrow, H1 words rise
      if (eyebrowRef.current) {
        tl.to(
          eyebrowRef.current,
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.durations.sm,
          },
          0.2
        );
      }
      if (headingWords.length > 0) {
        tl.to(
          headingWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: motionTokens.durations.md,
            stagger: motionTokens.stagger.words,
            ease: 'brand',
          },
          0.2
        );
      }

      // 0.35s: Mark outline DrawSVG + fill
      if (markPathRef.current) {
        tl.to(
          markPathRef.current,
          {
            drawSVG: '100%',
            duration: 0.8,
            ease: 'brand',
          },
          0.35
        );
        tl.to(
          markPathRef.current,
          {
            fillOpacity: 1,
            strokeOpacity: 0,
            duration: motionTokens.durations.md,
            ease: 'power2.inOut',
          },
          0.7
        );
      }

      // 0.3s: Horizontal rule grows
      if (ruleRef.current) {
        tl.to(
          ruleRef.current,
          {
            scaleX: 1,
            duration: motionTokens.durations.md,
            ease: 'brand',
          },
          0.4
        );
      }

      // 0.45s: Lead fades up
      if (leadRef.current) {
        tl.to(
          leadRef.current,
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.durations.sm,
          },
          0.45
        );
      }

      // 0.6s: Buttons pop
      if (buttonsRef.current) {
        tl.to(
          buttonsRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.durations.sm,
            stagger: 0.1,
          },
          0.6
        );
      }

      // 3. Desktop pointer parallax (desktop, fine pointer)
      const isFinePointer = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;
      if (isFinePointer && heroRef.current && markRef.current && peaklinesRef.current && panelRef.current) {
        const markXTo = gsap.quickTo(markRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
        const markYTo = gsap.quickTo(markRef.current, 'y', { duration: 0.8, ease: 'power2.out' });
        const bgXTo = gsap.quickTo(peaklinesRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
        const bgYTo = gsap.quickTo(peaklinesRef.current, 'y', { duration: 0.8, ease: 'power2.out' });
        const panelXTo = gsap.quickTo(panelRef.current, 'x', { duration: 0.8, ease: 'power2.out' });

        const handlePointerMove = (e: MouseEvent) => {
          if (!heroRef.current) return;
          const rect = heroRef.current.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          markXTo(normX * 12);
          markYTo(normY * 12);
          bgXTo(-normX * 20);
          bgYTo(-normY * 20);
          panelXTo(normX * 6);
        };

        const handlePointerLeave = () => {
          markXTo(0);
          markYTo(0);
          bgXTo(0);
          bgYTo(0);
          panelXTo(0);
        };

        const heroEl = heroRef.current;
        heroEl.addEventListener('mousemove', handlePointerMove);
        heroEl.addEventListener('mouseleave', handlePointerLeave);
      }

      // 4. Scroll-out scrub (desktop and mobile)
      if (heroRef.current && textBlockRef.current && panelRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (textBlockRef.current) {
              gsap.set(textBlockRef.current, { y: -p * 30 });
            }
            if (panelRef.current) {
              gsap.set(panelRef.current, { y: -p * 80 });
            }
          },
        });
      }
    }, heroRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [lang]);

  // Slanted clip-paths based on RUN = H * 0.554
  // Desktop: H = 640px -> RUN = 355px
  // Mobile: H = 260px -> RUN = 144px
  const desktopPanelClip = isRtl
    ? 'polygon(0 0, calc(100% - 355px) 0, 100% 100%, 0 100%)'
    : 'polygon(355px 0, 100% 0, 100% 100%, 0 100%)';

  const mobilePanelClip = isRtl
    ? 'polygon(0 0, calc(100% - 144px) 0, 100% 100%, 0 100%)'
    : 'polygon(144px 0, 100% 0, 100% 100%, 0 100%)';

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-white text-body border-b border-line overflow-hidden lg:h-[640px] flex flex-col justify-center"
    >
      {/* ========================================================================= */}
      {/* DESKTOP END PANEL (>= 1024px) */}
      {/* ========================================================================= */}
      <div
        className={`hidden lg:block absolute top-0 bottom-0 ${
          isRtl ? 'left-0' : 'right-0'
        } w-[48%] h-full pointer-events-none z-0`}
      >
        {/* Parallel Ink Stripe: 10px wide, 22px away on white side */}
        <div
          ref={stripeRef}
          className={`absolute top-0 bottom-0 h-full w-[40px] bg-ink z-10 ${
            isRtl ? '-right-[22px]' : '-left-[22px]'
          }`}
          style={{
            clipPath: isRtl
              ? 'polygon(0 0, 10px 0, calc(100% - 355px + 10px) 100%, calc(100% - 355px) 100%)'
              : 'polygon(355px 0, calc(355px + 10px) 0, 10px 100%, 0 100%)',
          }}
        />

        {/* Solid brand-600 Blue Panel */}
        <div
          ref={panelRef}
          className="absolute inset-0 w-full h-full bg-brand-600 flex items-center justify-center overflow-hidden"
          style={{ clipPath: desktopPanelClip }}
        >
          {/* Background PeakLines in brand-800 */}
          <div
            ref={peaklinesRef}
            className={`absolute top-1/2 -translate-y-1/2 ${
              isRtl ? 'right-[120px]' : 'left-[120px]'
            } z-0 opacity-60 pointer-events-none`}
          >
            <PeakLines token="brand-800" width={360} height={240} lines={5} />
          </div>

          {/* Centered White Logo Mark with 2px Rule */}
          <div
            ref={markRef}
            className={`relative z-10 w-[280px] xl:w-[320px] flex flex-col items-center ${
              isRtl ? 'mr-[80px]' : 'ml-[80px]'
            }`}
          >
            <div className="w-full h-auto">
              <svg
                viewBox="0 0 3434 1900"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto block"
              >
                <g
                  transform="translate(0.000000,1900.000000) scale(0.100000,-0.100000)"
                  fill="var(--white)"
                  stroke="none"
                >
                  <path
                    ref={markPathRef}
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
            {/* 2px horizontal rule running under mark */}
            <div ref={ruleRef} className="w-full h-[2px] bg-white mt-[-2px]" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TEXT CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <Container className="relative z-10 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div
            ref={textBlockRef}
            className="lg:col-span-7 flex flex-col items-start text-start max-w-[560px]"
          >
            {/* Eyebrow Pill */}
            <span
              ref={eyebrowRef}
              className={`text-brand-700 bg-brand-50 text-[13px] lg:text-[14px] font-bold mb-4 px-3.5 py-1.5 rounded-full inline-block ${
                !isRtl ? 'uppercase tracking-[0.08em]' : ''
              }`}
            >
              {t('home.hero.eyebrow')}
            </span>

            {/* H1 Title */}
            <h1
              key={lang}
              ref={headingRef}
              className="text-ink text-h1 tracking-tight mb-6 font-extrabold hero-heading"
            >
              {t('home.hero.title')}
            </h1>

            {/* Lead */}
            <p
              ref={leadRef}
              className="text-body text-lead mb-8 max-w-[560px] hero-lead"
            >
              {t('home.hero.lead')}
            </p>

            {/* Action Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto hero-buttons"
            >
              <Button
                to={`/${lang}/contact/`}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {t('cta.contact')}
              </Button>
              <Button
                to={`/${lang}/services/`}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {t('cta.services')}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* ========================================================================= */}
      {/* TABLET / MOBILE END PANEL (< 1024px) */}
      {/* ========================================================================= */}
      <div className="block lg:hidden relative w-full h-[260px] overflow-hidden mt-6">
        {/* Ink Stripe along slanted corner */}
        <div
          className={`absolute top-0 h-full w-[30px] bg-ink z-10 ${
            isRtl ? 'right-[calc(100%-144px+16px)]' : 'left-[calc(144px-26px)]'
          }`}
          style={{
            clipPath: isRtl
              ? 'polygon(0 0, 10px 0, 100% 100%, calc(100% - 10px) 100%)'
              : 'polygon(10px 0, 20px 0, 10px 100%, 0 100%)',
          }}
        />

        {/* 260px Blue Block */}
        <div
          className="w-full h-full bg-brand-600 flex items-center justify-center relative overflow-hidden"
          style={{ clipPath: mobilePanelClip }}
        >
          {/* Mobile Centered Mark (180px) */}
          <div className="w-[180px] flex flex-col items-center">
            <svg
              viewBox="0 0 3434 1900"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto block"
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
            <div className="w-full h-[2px] bg-white mt-[-2px]" />
          </div>
        </div>
      </div>
    </section>
  );
};
