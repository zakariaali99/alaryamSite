import React, { useEffect, useRef } from 'react';
import { Container } from '../../components/Container';
import { Button } from '../../components/Button';
import { PeakLines } from '../../components/PeakLines';
import { useLang, useT } from '../../i18n/context';
import { gsap } from '../../motion/gsap';

export const CtaBand: React.FC = () => {
  const { lang } = useLang();
  const t = useT();
  const sectionRef = useRef<HTMLElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const peaklinesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !bandRef.current || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Scale from 0.94 -> 1 and corner radius eases from 48px -> 24px as it enters (scrub)
      gsap.fromTo(
        bandRef.current,
        {
          scale: 0.94,
          borderRadius: 48,
        },
        {
          scale: 1,
          borderRadius: 24,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            end: 'center 60%',
            scrub: 0.5,
          },
        }
      );

      // PeakLines draw in when CTA enters
      if (peaklinesRef.current) {
        const lines = peaklinesRef.current.querySelectorAll('.peak-line-stroke, .peak-line-base');
        if (lines.length > 0) {
          gsap.fromTo(
            lines,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              duration: 0.8,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-section overflow-hidden">
      <Container>
        <div
          ref={bandRef}
          data-reveal
          className="relative bg-ink text-white rounded-cta p-10 lg:p-16 overflow-hidden cta-band-box will-change-transform"
        >
          {/* PeakLines in brand-600 on the end side */}
          <div
            ref={peaklinesRef}
            className="absolute top-0 end-0 h-full flex items-center justify-end opacity-80 pointer-events-none z-0 cta-peaklines"
          >
            <PeakLines token="brand-600" width={320} height={240} lines={5} />
          </div>

          <div className="relative z-10 max-w-[700px] flex flex-col items-start text-start">
            <h2 className="text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-white leading-tight mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-lead text-white/85 mb-8">
              {t('home.cta.lead')}
            </p>
            <Button to={`/${lang}/contact/`} variant="primary" className="magnetic-btn">
              {t('cta.contact')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
