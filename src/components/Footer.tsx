import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Container } from './Container';
import { Logo } from './Logo';
import { PeakLines } from './PeakLines';
import { useLang, useT } from '../i18n/context';
import { servicesData } from '../data/services';
import { gsap } from '../motion/gsap';

export const Footer: React.FC = () => {
  const { lang } = useLang();
  const t = useT();
  const currentYear = new Date().getFullYear();

  const footerRef = useRef<HTMLElement | null>(null);
  const peaklinesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !footerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // PeakLines DrawSVG when footer enters viewport
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
                trigger: footerRef.current,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      }

      // Staggered column reveals
      const cols = footerRef.current?.querySelectorAll('[data-reveal]');
      if (cols && cols.length > 0) {
        gsap.fromTo(
          cols,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'brand',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, footerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-ink text-white pt-12 pb-10 overflow-hidden">
      {/* PeakLines decoration along top edge in brand-800 */}
      <div
        ref={peaklinesRef}
        className="absolute top-0 start-0 w-full overflow-hidden flex justify-start opacity-70 pointer-events-none footer-peaklines"
      >
        <PeakLines token="brand-800" width={320} height={70} lines={5} />
      </div>

      <Container className="relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand & Blurb (lg: 4 cols) */}
          <div data-reveal className="lg:col-span-4 flex flex-col items-start gap-4 will-change-transform">
            <Logo variant="full" color="white" heightClass="h-[72px] lg:h-[96px]" />
            <p className="text-white/75 text-[15px] leading-relaxed max-w-[340px] pt-1">
              {t('footer.blurb')}
            </p>
          </div>

          {/* Services Column (lg: 4 cols) */}
          <div data-reveal className="lg:col-span-4 flex flex-col gap-3 will-change-transform">
            <h3 className="text-[17px] font-bold text-white mb-1">
              {t('nav.services')}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {servicesData.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/${lang}/services/${s.slug}/`}
                    className="text-white/70 hover:text-white transition-colors text-[15px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
                  >
                    {t(`services.${s.slug}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column (lg: 2 cols) */}
          <div data-reveal className="lg:col-span-2 flex flex-col gap-3 will-change-transform">
            <h3 className="text-[17px] font-bold text-white mb-1">
              {t('about.pageTitle')}
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  to={`/${lang}/about/`}
                  className="text-white/70 hover:text-white transition-colors text-[15px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/contact/`}
                  className="text-white/70 hover:text-white transition-colors text-[15px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column (lg: 2 cols) */}
          <div data-reveal className="lg:col-span-2 flex flex-col gap-3 will-change-transform">
            <h3 className="text-[17px] font-bold text-white mb-1">
              {t('contact.emailLabel')}
            </h3>
            <a
              href="mailto:Info@Alaryam.ly"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[15px] font-medium break-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
            >
              <Mail size={18} strokeWidth={1.75} className="flex-shrink-0 text-brand-100" />
              <span>Info@Alaryam.ly</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-white/60">
          <p>{t('footer.rights', { year: currentYear })}</p>
          <p className="font-semibold text-white/75">{t('company.tagline')}</p>
        </div>
      </Container>
    </footer>
  );
};
