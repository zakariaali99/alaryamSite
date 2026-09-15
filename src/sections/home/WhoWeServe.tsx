import React, { useEffect, useRef } from 'react';
import { Building2, Briefcase, Landmark } from 'lucide-react';
import { Container } from '../../components/Container';
import { useLang, useT } from '../../i18n/context';
import { gsap } from '../../motion/gsap';
import { motionTokens } from '../../motion/tokens';

export const WhoWeServe: React.FC = () => {
  const { isRtl } = useLang();
  const t = useT();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const items = [
    {
      icon: Building2,
      title: t('home.whoWeServe.item1.title'),
      text: t('home.whoWeServe.item1.text'),
    },
    {
      icon: Briefcase,
      title: t('home.whoWeServe.item2.title'),
      text: t('home.whoWeServe.item2.text'),
    },
    {
      icon: Landmark,
      title: t('home.whoWeServe.item3.title'),
      text: t('home.whoWeServe.item3.text'),
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined' || !cardsRef.current || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (!cards || cards.length === 0) return;

      const slideX = isRtl ? -40 : 40;

      gsap.fromTo(
        cards,
        { x: slideX, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: motionTokens.durations.md,
          stagger: motionTokens.stagger.cards,
          ease: 'brand',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isRtl]);

  return (
    <section ref={sectionRef} className="bg-white py-section overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Start side: H2 */}
          <div className="lg:col-span-3">
            <h2 className="text-h2 text-ink sticky top-28">
              {t('home.whoWeServe.title')}
            </h2>
          </div>

          {/* End side: Three cards sliding in from end side */}
          <div
            ref={cardsRef}
            className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {items.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  data-reveal
                  className="card-standard flex flex-col items-start will-change-transform"
                >
                  <div className="w-[56px] h-[56px] rounded-icon bg-brand-50 flex items-center justify-center mb-6 flex-shrink-0">
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
