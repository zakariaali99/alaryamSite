import React, { useEffect, useRef, useState } from 'react';
import { AppLink } from './AppLink';
import { Container } from './Container';
import { PeakLines } from './PeakLines';
import { useLang, useT } from '../i18n/context';
import { gsap, SplitText } from '../motion/gsap';
import { motionTokens, BLADE_K } from '../motion/tokens';
import { usePageEnter } from '../motion/usePageEnter';

interface PageHeroProps {
  title: string;
  lead?: string;
  breadcrumbCurrent: string;
  breadcrumbParent?: { label: string; to: string };
  icon?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  lead,
  breadcrumbCurrent,
  breadcrumbParent,
  icon,
}) => {
  const { lang, isRtl } = useLang();
  const t = useT();
  const separator = isRtl ? '‹' : '›';

  const sectionRef = useRef<HTMLElement | null>(null);
  const slabRef = useRef<HTMLDivElement | null>(null);
  const stripeRef = useRef<HTMLDivElement | null>(null);
  const breadcrumbRef = useRef<HTMLElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const leadRef = useRef<HTMLParagraphElement | null>(null);
  const peaklinesRef = useRef<HTMLDivElement | null>(null);

  const [bladeRun, setBladeRun] = useState(188);

  // Measure exact section height to set blade run: RUN = H * 0.554
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        if (h > 0) {
          const run = Math.round(h * BLADE_K);
          setBladeRun(run);
          sectionRef.current?.style.setProperty('--hero-blade-run', `${run}px`);
        }
      }
    });

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  usePageEnter(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (slabRef.current) gsap.set(slabRef.current, { xPercent: 0, opacity: 1 });
      if (stripeRef.current) gsap.set(stripeRef.current, { scaleY: 1, opacity: 1 });
      if (breadcrumbRef.current) gsap.set(breadcrumbRef.current, { opacity: 1, y: 0 });
      if (iconRef.current) gsap.set(iconRef.current, { opacity: 1, scale: 1 });
      if (leadRef.current) gsap.set(leadRef.current, { opacity: 1, y: 0 });
      return;
    }

    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'brand' } });

      // 1. Initial States
      if (slabRef.current) {
        gsap.set(slabRef.current, {
          xPercent: isRtl ? -100 : 100,
        });
      }
      if (stripeRef.current) {
        gsap.set(stripeRef.current, {
          scaleY: 0,
          transformOrigin: 'top center',
        });
      }
      if (breadcrumbRef.current) {
        gsap.set(breadcrumbRef.current, { opacity: 0, y: 10 });
      }
      if (iconRef.current) {
        gsap.set(iconRef.current, { opacity: 0, scale: 0.8 });
      }
      if (leadRef.current) {
        gsap.set(leadRef.current, { opacity: 0, y: 16 });
      }

      // Split heading words
      let words: HTMLElement[] = [];
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
            words.push(inner);
          });
          gsap.set(words, { yPercent: 110, opacity: 0 });
        } catch (e) {
          console.warn('SplitText error:', e);
        }
      }

      // 2. Timeline
      // 0s: Slab slides in from edge (0.7s brand)
      if (slabRef.current) {
        tl.to(
          slabRef.current,
          {
            xPercent: 0,
            duration: 0.7,
            ease: 'brand',
          },
          0
        );
      }

      // 0.12s: Stripe follows
      if (stripeRef.current) {
        tl.to(
          stripeRef.current,
          {
            scaleY: 1,
            duration: 0.65,
            ease: 'brand',
          },
          0.12
        );
      }

      // 0.1s: Breadcrumbs fade in
      if (breadcrumbRef.current) {
        tl.to(
          breadcrumbRef.current,
          { opacity: 1, y: 0, duration: motionTokens.durations.sm },
          0.1
        );
      }

      // 0.15s: Icon tile pops in
      if (iconRef.current) {
        tl.to(
          iconRef.current,
          { opacity: 1, scale: 1, duration: motionTokens.durations.sm },
          0.15
        );
      }

      // 0.2s: H1 words rise
      if (words.length > 0) {
        tl.to(
          words,
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

      // 0.4s: Lead fades up
      if (leadRef.current) {
        tl.to(
          leadRef.current,
          { opacity: 1, y: 0, duration: motionTokens.durations.sm },
          0.4
        );
      }

      // PeakLines DrawSVG inside slab
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
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [lang, title]);

  // Desktop clip path: 22% slab slanted at 61 degrees
  const desktopSlabClip = isRtl
    ? `polygon(0 0, calc(100% - ${bladeRun}px) 0, 100% 100%, 0 100%)`
    : `polygon(${bladeRun}px 0, 100% 0, 100% 100%, 0 100%)`;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-surface text-body border-b border-line min-h-[340px] flex items-center py-12 lg:py-16 overflow-hidden"
      style={{ '--hero-blade-run': `${bladeRun}px` } as React.CSSProperties}
    >
      {/* ========================================================================= */}
      {/* END-SIDE BLUE BLADE SLAB (DESKTOP >= 768px: 22% width, MOBILE < 768px: 40px strip) */}
      {/* ========================================================================= */}
      <div
        className={`absolute top-0 bottom-0 ${
          isRtl ? 'left-0' : 'right-0'
        } h-full w-[40px] md:w-[22%] md:min-w-[180px] pointer-events-none z-0`}
      >
        {/* Parallel Ink Stripe: 8px wide, 18px away (hidden on mobile < 768px) */}
        <div
          ref={stripeRef}
          className={`hidden md:block absolute top-0 bottom-0 h-full w-[30px] bg-ink z-10 ${
            isRtl ? '-right-[18px]' : '-left-[18px]'
          }`}
          style={{
            clipPath: isRtl
              ? `polygon(0 0, 8px 0, calc(100% - ${bladeRun}px + 8px) 100%, calc(100% - ${bladeRun}px) 100%)`
              : `polygon(${bladeRun}px 0, calc(${bladeRun}px + 8px) 0, 8px 100%, 0 100%)`,
          }}
        />

        {/* Solid brand-600 Slab */}
        <div
          ref={slabRef}
          className="absolute inset-0 w-full h-full bg-brand-600 flex items-center justify-end overflow-hidden"
          style={{ clipPath: desktopSlabClip }}
        >
          {/* Subtle PeakLines in brand-800 inside slab (desktop only) */}
          <div
            ref={peaklinesRef}
            className="hidden lg:block absolute -top-8 -end-4 z-0 opacity-70 pointer-events-none"
          >
            <PeakLines token="brand-800" width={260} height={200} lines={4} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TEXT CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <Container className="relative z-10">
        <div className="max-w-[720px] flex flex-col items-start text-start">
          {/* Breadcrumbs */}
          <nav
            ref={breadcrumbRef}
            className="flex items-center gap-2 text-[14px] text-muted font-medium mb-4 breadcrumbs-nav"
            aria-label="Breadcrumb"
          >
            <AppLink to={`/${lang}/`} className="hover:text-ink transition-colors">
              {t('nav.home')}
            </AppLink>
            <span className="text-muted/60">{separator}</span>
            {breadcrumbParent && (
              <>
                <AppLink to={breadcrumbParent.to} className="hover:text-ink transition-colors">
                  {breadcrumbParent.label}
                </AppLink>
                <span className="text-muted/60">{separator}</span>
              </>
            )}
            <span className="text-ink font-semibold" aria-current="page">
              {breadcrumbCurrent}
            </span>
          </nav>

          {/* Service Icon Tile (72px brand-600 tile with white icon) */}
          {icon && (
            <div
              ref={iconRef}
              className="w-[72px] h-[72px] rounded-icon bg-brand-600 flex items-center justify-center mb-6 text-white shadow-md"
            >
              {icon}
            </div>
          )}

          {/* H1 Title */}
          <h1
            key={`${lang}-${title}`}
            ref={headingRef}
            className="text-ink text-h1 tracking-tight mb-4 font-extrabold page-hero-title"
          >
            {title}
          </h1>

          {/* Lead */}
          {lead && (
            <p
              ref={leadRef}
              className="text-body text-lead max-w-[720px] page-hero-lead"
            >
              {lead}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};
