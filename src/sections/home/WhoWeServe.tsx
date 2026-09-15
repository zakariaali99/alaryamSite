import React from 'react';
import { Building2, Briefcase, Landmark } from 'lucide-react';
import { Container } from '../../components/Container';
import { useT } from '../../i18n/context';

export const WhoWeServe: React.FC = () => {
  const t = useT();

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

  return (
    <section className="bg-white py-section">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Start side: H2 */}
          <div className="lg:col-span-3">
            <h2 className="text-h2 text-ink sticky top-28">
              {t('home.whoWeServe.title')}
            </h2>
          </div>

          {/* End side: Three cards in a row on desktop */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="card-standard flex flex-col items-start"
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
