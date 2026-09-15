import React from 'react';
import { Container } from '../../components/Container';
import { useT } from '../../i18n/context';

export const HowWeWork: React.FC = () => {
  const t = useT();

  const steps = [
    {
      num: '01',
      title: t('home.howWeWork.step1.title'),
      text: t('home.howWeWork.step1.text'),
    },
    {
      num: '02',
      title: t('home.howWeWork.step2.title'),
      text: t('home.howWeWork.step2.text'),
    },
    {
      num: '03',
      title: t('home.howWeWork.step3.title'),
      text: t('home.howWeWork.step3.text'),
    },
    {
      num: '04',
      title: t('home.howWeWork.step4.title'),
      text: t('home.howWeWork.step4.text'),
    },
  ];

  return (
    <section className="bg-surface py-section relative">
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
            className="hidden lg:block absolute top-[28px] start-[10%] end-[10%] h-[2px] bg-line z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col items-start bg-white lg:bg-transparent p-6 lg:p-0 rounded-card lg:rounded-none border border-line lg:border-none"
              >
                {/* Number Badge: 40px/800 brand-600 */}
                <div className="inline-flex items-center justify-center font-extrabold text-[36px] lg:text-[40px] text-brand-600 mb-4 bg-surface lg:bg-transparent px-2 -ms-2">
                  {step.num}
                </div>

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
