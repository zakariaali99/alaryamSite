import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Headset,
  Cctv,
  Network,
  Workflow,
  Cpu,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Container } from '../../components/Container';
import { useLang, useT } from '../../i18n/context';
import { servicesData } from '../../data/services';

const iconMap = {
  Code2,
  Headset,
  Cctv,
  Network,
  Workflow,
  Cpu,
};

export const ServicesGrid: React.FC = () => {
  const { lang, isRtl } = useLang();
  const t = useT();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-white py-section">
      <Container>
        {/* Centered Section Header */}
        <div className="text-center max-w-[720px] mx-auto mb-14 lg:mb-16">
          <h2 className="text-h2 text-ink mb-4">{t('home.services.title')}</h2>
          <p className="text-lead text-muted">{t('home.services.lead')}</p>
        </div>

        {/* 3x2 Grid Desktop, 2 Tablet, 1 Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => {
            const IconComponent = iconMap[service.iconName];
            return (
              <Link
                key={service.slug}
                to={`/${lang}/services/${service.slug}/`}
                className="card-standard group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
              >
                <div>
                  {/* Icon Tile: 56px, brand-50 bg, brand-600 icon 26px */}
                  <div className="w-[56px] h-[56px] rounded-icon bg-brand-50 flex items-center justify-center mb-6 flex-shrink-0 transition-colors group-hover:bg-brand-100">
                    <IconComponent
                      size={26}
                      strokeWidth={1.75}
                      className="text-brand-600"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-h3 text-ink mb-3 transition-colors group-hover:text-brand-600">
                    {t(`services.${service.slug}.title`)}
                  </h3>

                  {/* Short description */}
                  <p className="text-body-custom text-muted mb-6">
                    {t(`services.${service.slug}.short`)}
                  </p>
                </div>

                {/* Learn More link with arrow */}
                <div className="inline-flex items-center gap-2 text-[15px] font-bold text-brand-600 pt-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <span>{t('cta.learnMore')}</span>
                  <ArrowIcon size={18} strokeWidth={1.75} />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
