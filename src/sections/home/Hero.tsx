import React, { useEffect, useRef } from 'react';
import { Container } from '../../components/Container';
import { Button } from '../../components/Button';
import { PeakLines } from '../../components/PeakLines';
import { useLang, useT } from '../../i18n/context';
import { gsap, ScrollTrigger, SplitText } from '../../motion/gsap';
import { motionTokens } from '../../motion/tokens';

export const Hero: React.FC = () => {
  const { lang, isRtl } = useLang();
  const t = useT();

  const heroRef = useRef<HTMLElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const markPathRef = useRef<SVGPathElement | null>(null);
  const ruleRef = useRef<HTMLDivElement | null>(null);
  const peaklinesRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const leadRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'brand' } });

      // 1. Initial states
      if (ruleRef.current) {
        gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'center' });
      }
      if (markPathRef.current) {
        // Outline draw setup
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

      // 2. Choreography timeline
      // 0.1s: Triangle mark outline draws in with DrawSVG
      if (markPathRef.current) {
        tl.to(
          markPathRef.current,
          {
            drawSVG: '100%',
            duration: motionTokens.durations.lg,
            ease: 'brand',
          },
          0.1
        );
        // Fill fades in, stroke fades out
        tl.to(
          markPathRef.current,
          {
            fillOpacity: 1,
            strokeOpacity: 0,
            duration: motionTokens.durations.md,
            ease: 'power2.inOut',
          },
          0.5
        );
      }

      // 0.3s: Horizontal rule grows outward from center
      if (ruleRef.current) {
        tl.to(
          ruleRef.current,
          {
            scaleX: 1,
            duration: motionTokens.durations.md,
            ease: 'brand',
          },
          0.3
        );
      }

      // 0.35s: Eyebrow fades up
      if (eyebrowRef.current) {
        tl.to(
          eyebrowRef.current,
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.durations.sm,
          },
          0.35
        );
      }

      // H1 words rise
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
          0.4
        );
      }

      // Lead text fades up
      if (leadRef.current) {
        tl.to(
          leadRef.current,
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.durations.sm,
          },
          0.65
        );
      }

      // Buttons pop in
      if (buttonsRef.current) {
        tl.to(
          buttonsRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.durations.sm,
            stagger: 0.1,
          },
          0.8
        );
      }

      // PeakLines draw in
      if (peaklinesRef.current) {
        const lines = peaklinesRef.current.querySelectorAll('.peak-line-stroke, .peak-line-base');
        if (lines.length > 0) {
          gsap.fromTo(
            lines,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              duration: motionTokens.durations.lg,
              stagger: 0.08,
              ease: 'power2.out',
            }
          );
        }
      }

      // 3. Desktop pointer parallax
      const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;
      if (isDesktop && heroRef.current && markRef.current && peaklinesRef.current) {
        const markXTo = gsap.quickTo(markRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
        const markYTo = gsap.quickTo(markRef.current, 'y', { duration: 0.8, ease: 'power2.out' });
        const bgXTo = gsap.quickTo(peaklinesRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
        const bgYTo = gsap.quickTo(peaklinesRef.current, 'y', { duration: 0.8, ease: 'power2.out' });

        const handlePointerMove = (e: MouseEvent) => {
          if (!heroRef.current) return;
          const rect = heroRef.current.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          markXTo(normX * 14);
          markYTo(normY * 14);
          bgXTo(-normX * 22);
          bgYTo(-normY * 22);
        };

        const handlePointerLeave = () => {
          markXTo(0);
          markYTo(0);
          bgXTo(0);
          bgYTo(0);
        };

        const heroEl = heroRef.current;
        heroEl.addEventListener('mousemove', handlePointerMove);
        heroEl.addEventListener('mouseleave', handlePointerLeave);
      }

      // 4. Hero scroll-out scrub
      if (heroRef.current && markRef.current && textBlockRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (markRef.current) {
              gsap.set(markRef.current, {
                yPercent: -p * 20,
                scale: 1 - p * 0.08,
              });
            }
            if (textBlockRef.current) {
              gsap.set(textBlockRef.current, {
                yPercent: -p * 12,
                opacity: 1 - p * 0.6,
              });
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

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-brand-600 text-white min-h-[580px] lg:min-h-[620px] flex items-center py-16 lg:py-24 overflow-hidden"
    >
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Start Column: Text (lg: 7 cols) */}
          <div
            ref={textBlockRef}
            className="lg:col-span-7 flex flex-col items-start text-start hero-text-block"
          >
            {/* Eyebrow */}
            <span
              ref={eyebrowRef}
              className={`text-white text-[13px] lg:text-[14px] font-bold mb-4 px-3 py-1 bg-brand-700 rounded-full inline-block hero-eyebrow ${
                !isRtl ? 'uppercase tracking-[0.08em]' : ''
              }`}
            >
              {t('home.hero.eyebrow')}
            </span>

            {/* H1 */}
            <h1
              key={lang}
              ref={headingRef}
              className="text-white text-h1 tracking-tight mb-6 hero-heading"
            >
              {t('home.hero.title')}
            </h1>

            {/* Lead */}
            <p
              ref={leadRef}
              className="text-white/90 text-lead mb-8 max-w-[620px] hero-lead"
            >
              {t('home.hero.lead')}
            </p>

            {/* Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto hero-buttons"
            >
              <Button
                to={`/${lang}/contact/`}
                variant="on-blue-primary"
                className="w-full sm:w-auto"
              >
                {t('cta.contact')}
              </Button>
              <Button
                to={`/${lang}/services/`}
                variant="on-blue-secondary"
                className="w-full sm:w-auto"
              >
                {t('cta.services')}
              </Button>
            </div>
          </div>

          {/* End Column: Visual (lg: 5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center lg:items-end hero-visual-block">
            <div className="relative w-full max-w-[380px] lg:max-w-[420px] flex flex-col items-center">
              {/* Background PeakLines in brand-800 */}
              <div
                ref={peaklinesRef}
                className="absolute -top-12 -start-6 z-0 opacity-80 pointer-events-none hero-peaklines"
              >
                <PeakLines token="brand-800" width={320} height={200} lines={5} />
              </div>

              {/* Triangle Mark standing on the 2px white rule */}
              <div
                ref={markRef}
                className="relative z-10 w-[260px] sm:w-[320px] lg:w-[360px] hero-mark flex flex-col items-center"
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
                {/* 2px horizontal rule running to edge */}
                <div ref={ruleRef} className="w-full h-[2px] bg-white mt-[-2px] hero-rule" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
