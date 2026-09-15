import React from 'react';
import { Container } from '../../components/Container';
import { Button } from '../../components/Button';
import { PeakLines } from '../../components/PeakLines';
import { useLang, useT } from '../../i18n/context';

export const CtaBand: React.FC = () => {
  const { lang } = useLang();
  const t = useT();

  return (
    <section className="bg-white py-section">
      <Container>
        <div className="relative bg-ink text-white rounded-cta p-10 lg:p-16 overflow-hidden">
          {/* PeakLines in brand-600 on the end side */}
          <div className="absolute top-0 end-0 h-full flex items-center justify-end opacity-80 pointer-events-none z-0">
            <PeakLines color="#0D07AD" width={320} height={240} lines={5} />
          </div>

          <div className="relative z-10 max-w-[700px] flex flex-col items-start text-start">
            <h2 className="text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-white leading-tight mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-lead text-white/85 mb-8">
              {t('home.cta.lead')}
            </p>
            <Button to={`/${lang}/contact/`} variant="primary">
              {t('cta.contact')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
