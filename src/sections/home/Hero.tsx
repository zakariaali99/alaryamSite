import React from 'react';
import { Container } from '../../components/Container';
import { Button } from '../../components/Button';
import { PeakLines } from '../../components/PeakLines';
import { useLang, useT } from '../../i18n/context';

export const Hero: React.FC = () => {
  const { lang, isRtl } = useLang();
  const t = useT();

  return (
    <section className="relative w-full bg-brand-600 text-white min-h-[580px] lg:min-h-[620px] flex items-center py-16 lg:py-24 overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Start Column: Text (lg: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            {/* Eyebrow */}
            <span
              className={`text-white/90 text-[13px] lg:text-[14px] font-bold mb-4 px-3 py-1 bg-white/10 rounded-full inline-block ${
                !isRtl ? 'uppercase tracking-[0.08em]' : ''
              }`}
            >
              {t('home.hero.eyebrow')}
            </span>

            {/* H1 */}
            <h1 className="text-white text-h1 tracking-tight mb-6">
              {t('home.hero.title')}
            </h1>

            {/* Lead */}
            <p className="text-white/90 text-lead mb-8 max-w-[620px]">
              {t('home.hero.lead')}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
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
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center lg:items-end">
            <div className="relative w-full max-w-[380px] lg:max-w-[420px] flex flex-col items-center">
              {/* Background PeakLines in brand-800 */}
              <div className="absolute -top-12 -start-6 z-0 opacity-80 pointer-events-none">
                <PeakLines color="#070470" width={320} height={200} lines={5} />
              </div>

              {/* Triangle Mark standing on the 2px white rule */}
              <div className="relative z-10 w-[260px] sm:w-[320px] lg:w-[360px]">
                <img
                  src="/brand/mark-white.svg"
                  alt={t('company.name')}
                  className="w-full h-auto block"
                />
                {/* 2px horizontal rule running to edge */}
                <div className="w-full h-[2px] bg-white mt-[-2px]" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
