import React from 'react';
import { ShieldCheck, Layers, LifeBuoy, BadgeCheck } from 'lucide-react';
import { Container } from '../../components/Container';
import { useT } from '../../i18n/context';

export const WhyUs: React.FC = () => {
  const t = useT();

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

  return (
    <section className="bg-brand-50 py-section">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Start side: H2 */}
          <div className="lg:col-span-4">
            <h2 className="text-h2 text-ink sticky top-28">
              {t('home.whyUs.title')}
            </h2>
          </div>

          {/* End side: 2x2 grid of four items */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-card p-8 border border-brand-100/80 shadow-sm flex flex-col items-start transition-transform duration-200 hover:-translate-y-1 hover:shadow-card"
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
