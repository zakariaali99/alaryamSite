import React, { useEffect, useRef } from 'react';
import { Container } from '../../components/Container';
import { useLang, useT } from '../../i18n/context';
import { gsap, ScrollTrigger } from '../../motion/gsap';
import { useCountUp } from '../../motion/useCountUp';

const StepNumber: React.FC<{ num: number; formatted: string }> = ({ num, formatted }) => {
  const numRef = useRef<HTMLDivElement | null>(null);
  useCountUp(numRef, num);

  return (
    <div
      ref={numRef}
      className="inline-flex items-center justify-center font-extrabold text-[36px] lg:text-[40px] text-brand-600 mb-4 bg-surface lg:bg-transparent px-2 -ms-2 select-none"
    >
      {formatted}
    </div>
  );
};

export const HowWeWork: React.FC = () => {
  const { isRtl } = useLang();
  const t = useT();
  const sectionRef = useRef<HTMLElement | null>(null);
  const desktopLineRef = useRef<HTMLDivElement | null>(null);
  const mobileLineRef = useRef<HTMLDivElement | null>(null);

  const steps = [
    {
      num: 1,
      formatted: '01',
      title: t('home.howWeWork.step1.title'),
      text: t('home.howWeWork.step1.text'),
    },
    {
      num: 2,
      formatted: '02',
      title: t('home.howWeWork.step2.title'),
      text: t('home.howWeWork.step2.text'),
    },
    {
      num: 3,
      formatted: '03',
      title: t('home.howWeWork.step3.title'),
      text: t('home.howWeWork.step3.text'),
    },
    {
      num: 4,
      formatted: '04',
      title: t('home.howWeWork.step4.title'),
      text: t('home.howWeWork.step4.text'),
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Desktop connector line draw with scroll
      if (desktopLineRef.current && sectionRef.current) {
        const origin = isRtl ? 'right center' : 'left center';
        gsap.set(desktopLineRef.current, { scaleX: 0, transformOrigin: origin });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 0.5,
          animation: gsap.to(desktopLineRef.current, {
            scaleX: 1,
            ease: 'none',
          }),
        });
      }

      // Mobile vertical connector line
      if (mobileLineRef.current && sectionRef.current) {
        gsap.set(mobileLineRef.current, { scaleY: 0, transformOrigin: 'top center' });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 85%',
          scrub: 0.5,
          animation: gsap.to(mobileLineRef.current, {
            scaleY: 1,
            ease: 'none',
          }),
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isRtl]);

  return (
    <section ref={sectionRef} className="bg-surface py-section relative overflow-hidden">
      <Container>
        {/* Centered Header */}
        <div className="text-center max-w-[720px] mx-auto mb-16">
          <h2 className="text-h2 text-ink mb-4">{t('home.howWeWork.title')}</h2>
          <p className="text-lead text-muted">{t('home.howWeWork.lead')}</p>
        </div>

        {/* 4 Steps Row Desktop / 2x2 Tablet / Vertical Mobile */}
        <div className="relative">
          {/* Thin 2px solid line connector on desktop across steps */}
          <div
            ref={desktopLineRef}
            className="hidden lg:block absolute top-[28px] start-[10%] end-[10%] h-[2px] bg-line z-0 will-change-transform"
            aria-hidden="true"
          />

          {/* Mobile vertical line along start edge */}
          <div
            ref={mobileLineRef}
            className="block lg:hidden absolute top-4 bottom-4 start-4 w-[2px] bg-line z-0 will-change-transform"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div
                key={step.formatted}
                data-reveal
                className="flex flex-col items-start bg-white lg:bg-transparent p-6 lg:p-0 rounded-card lg:rounded-none border border-line lg:border-none shadow-xs lg:shadow-none"
              >
                {/* Number Badge */}
                <StepNumber num={step.num} formatted={step.formatted} />

                {/* H3 Title */}
                <h3 className="text-h3 text-ink mb-3">{step.title}</h3>

                {/* Step Text */}
                <p className="text-body-custom text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
