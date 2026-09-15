import React, { useEffect, useRef } from 'react';
import { AppLink } from './AppLink';
import { Container } from './Container';
import { PeakLines } from './PeakLines';
import { useLang, useT } from '../i18n/context';
import { gsap, SplitText } from '../motion/gsap';
import { motionTokens } from '../motion/tokens';

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
  const breadcrumbRef = useRef<HTMLElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const leadRef = useRef<HTMLParagraphElement | null>(null);
  const peaklinesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'brand' } });

      // PeakLines DrawSVG
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

      // Breadcrumbs fade in
      if (breadcrumbRef.current) {
        tl.fromTo(
          breadcrumbRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: motionTokens.durations.sm },
          0.1
        );
      }

      // Icon tile clip/fade in
      if (iconRef.current) {
        tl.fromTo(
          iconRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: motionTokens.durations.sm },
          0.15
        );
      }

      // H1 words rise
      let words: HTMLElement[] = [];
      if (headingRef.current) {
        try {
          const split = new SplitText(headingRef.current, {
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
        } catch (e) {
          console.warn('SplitText error:', e);
        }
      }

      // Lead fades up
      if (leadRef.current) {
        tl.fromTo(
          leadRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: motionTokens.durations.sm },
          0.45
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [title]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-brand-600 text-white min-h-[280px] lg:min-h-[360px] flex items-center py-12 lg:py-16 overflow-hidden"
    >
      {/* End side PeakLines in brand-800 */}
      <div
        ref={peaklinesRef}
        className="absolute top-0 end-0 h-full flex items-center justify-end opacity-75 pointer-events-none z-0 page-hero-peaklines"
      >
        <PeakLines token="brand-800" width={340} height={260} lines={5} />
      </div>

      <Container className="relative z-10">
        <div className="max-w-[760px] flex flex-col items-start text-start">
          {/* Breadcrumbs */}
          <nav
            ref={breadcrumbRef}
            className="flex items-center gap-2 text-[14px] text-white/80 font-medium mb-4 breadcrumbs-nav"
            aria-label="Breadcrumb"
          >
            <AppLink to={`/${lang}/`} className="hover:text-white transition-colors">
              {t('nav.home')}
            </AppLink>
            <span className="opacity-60">{separator}</span>
            {breadcrumbParent && (
              <>
                <AppLink to={breadcrumbParent.to} className="hover:text-white transition-colors">
                  {breadcrumbParent.label}
                </AppLink>
                <span className="opacity-60">{separator}</span>
              </>
            )}
            <span className="text-white font-semibold" aria-current="page">
              {breadcrumbCurrent}
            </span>
          </nav>

          {/* Optional Service Icon Tile (72px white tile with brand-600 icon) */}
          {icon && (
            <div
              ref={iconRef}
              className="w-[72px] h-[72px] rounded-icon bg-white flex items-center justify-center mb-6 text-brand-600 shadow-md"
            >
              {icon}
            </div>
          )}

          {/* H1 Title */}
          <h1
            ref={headingRef}
            className="text-white text-h1 tracking-tight mb-4 page-hero-title"
          >
            {title}
          </h1>

          {/* Lead */}
          {lead && (
            <p
              ref={leadRef}
              className="text-white/90 text-lead max-w-[680px] page-hero-lead"
            >
              {lead}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};
