import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Layers, LifeBuoy, BadgeCheck } from 'lucide-react';
import { Container } from '../../components/Container';
import { useT } from '../../i18n/context';
import { gsap, ScrollTrigger } from '../../motion/gsap';
import { motionTokens } from '../../motion/tokens';

export const WhyUs: React.FC = () => {
  const t = useT();
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingColRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);

  const items = [
    {
      icon: ShieldCheck,
      title: t('home.whyUs.item1.title'),
      text: t('home.whyUs.item1.text'),
    },
    {
      icon: Layers,
      title: t('home.whyUs.item2.title'),
      text: t('home.whyUs.item2.text'),
    },
    {
      icon: LifeBuoy,
      title: t('home.whyUs.item3.title'),
      text: t('home.whyUs.item3.text'),
    },
    {
      icon: BadgeCheck,
      title: t('home.whyUs.item4.title'),
      text: t('home.whyUs.item4.text'),
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

      // Pin H2 column on desktop while items scroll
      if (isDesktop && headingColRef.current && sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          pin: headingColRef.current,
          start: 'top 120px',
          end: 'bottom bottom',
          pinSpacing: false,
        });
      }

      // Icon tiles rotate in from -12deg to 0deg and settle
      if (itemsRef.current) {
        const icons = itemsRef.current.querySelectorAll('.why-us-icon');
        icons.forEach((icon) => {
          gsap.fromTo(
            icon,
            { rotation: -12, opacity: 0.5 },
            {
              rotation: 0,
              opacity: 1,
              duration: motionTokens.durations.md,
              ease: 'brand',
              scrollTrigger: {
                trigger: icon,
                start: 'top 88%',
                once: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-brand-50 py-section relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Start side: H2 */}
          <div ref={headingColRef} className="lg:col-span-4">
            <h2 className="text-h2 text-ink">
              {t('home.whyUs.title')}
            </h2>
          </div>

          {/* End side: 2x2 grid of four items */}
          <div
            ref={itemsRef}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {items.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  data-reveal
                  className="bg-white rounded-card p-8 border border-brand-100/80 shadow-sm flex flex-col items-start transition-transform duration-200 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="why-us-icon w-[56px] h-[56px] rounded-icon bg-brand-50 flex items-center justify-center mb-6 flex-shrink-0 will-change-transform">
                    <IconComp size={26} strokeWidth={1.75} className="text-brand-600" />
                  </div>
                  <h3 className="text-h3 text-ink mb-3">{item.title}</h3>
                  <p className="text-body-custom text-muted">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
