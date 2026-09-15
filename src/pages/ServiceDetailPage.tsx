import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Code2,
  Headset,
  Cctv,
  Network,
  Workflow,
  Cpu,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { Container } from '../components/Container';
import { PageHero } from '../components/PageHero';
import { SeoHead } from '../components/SeoHead';
import { HowWeWork } from '../sections/home/HowWeWork';
import { PeakLines } from '../components/PeakLines';
import { Button } from '../components/Button';
import { NotFoundPage } from './NotFoundPage';
import { useLang, useT } from '../i18n/context';
import { servicesData } from '../data/services';

const iconMap = {
  Code2,
  Headset,
  Cctv,
  Network,
  Workflow,
  Cpu,
};

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isRtl } = useLang();
  const t = useT();

  const service = servicesData.find((s) => s.slug === slug);
  if (!service) {
    return <NotFoundPage />;
  }

  const IconComp = iconMap[service.iconName];
  const items = (t(`services.${service.slug}.items`) as unknown as string[]) || [];
  const otherServices = servicesData.filter((s) => s.slug !== service.slug);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: t(`services.${service.slug}.title`),
        description: t(`services.${service.slug}.short`),
        url: `https://alaryam.ly/${lang}/services/${service.slug}/`,
        provider: {
          '@type': 'Organization',
          name: 'AL-ARYAM',
          alternateName: 'الأريام',
          url: 'https://alaryam.ly',
          logo: 'https://alaryam.ly/brand/logo-full-blue.svg',
          email: 'Info@Alaryam.ly',
          areaServed: 'LY',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('nav.home'),
            item: `https://alaryam.ly/${lang}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('nav.services'),
            item: `https://alaryam.ly/${lang}/services/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: t(`services.${service.slug}.title`),
            item: `https://alaryam.ly/${lang}/services/${service.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <Layout>
      <SeoHead
        path={`/services/${service.slug}/`}
        title={`${t(`services.${service.slug}.title`)} ${t('seo.serviceSuffix')}`}
        description={t(`services.${service.slug}.short`)}
        jsonLd={jsonLd}
      />

      {/* Page Hero with 72px white tile icon */}
      <PageHero
        title={t(`services.${service.slug}.title`)}
        lead={t(`services.${service.slug}.intro`)}
        breadcrumbParent={{ label: t('nav.services'), to: `/${lang}/services/` }}
        breadcrumbCurrent={t(`services.${service.slug}.title`)}
        icon={<IconComp size={36} strokeWidth={1.75} />}
      />

      {/* What we offer: 2-column cards grid with check icons */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="max-w-[760px] mb-12">
            <h2 className="text-h2 text-ink mb-4">{t('services.whatWeOffer')}</h2>
            <p className="text-lead text-muted">{t(`services.${service.slug}.short`)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((itemText, i) => (
              <div
                key={i}
                data-reveal
                className="bg-surface rounded-card p-6 lg:p-8 border border-line flex items-start gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
              >
                <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-100/60">
                  <Check size={18} strokeWidth={2.5} />
                </span>
                <span className="text-body-custom text-ink font-semibold leading-relaxed">
                  {itemText}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How we work: 4-step sequence */}
      <HowWeWork />

      {/* Other services: compact cards with CSS scroll-snap on mobile */}
      <section className="bg-white py-16 lg:py-24 border-t border-line">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-h2 text-ink">{t('services.otherServices')}</h2>
            <Link
              to={`/${lang}/services/`}
              className="text-[15px] font-bold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1.5"
            >
              <span>{t('cta.services')}</span>
              <ArrowIcon size={16} />
            </Link>
          </div>

          <div
            data-lenis-prevent
            className="flex lg:grid lg:grid-cols-5 gap-5 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory -mx-4 px-4 lg:mx-0 lg:px-0"
          >
            {otherServices.map((other) => {
              const OtherIcon = iconMap[other.iconName];
              return (
                <Link
                  key={other.slug}
                  to={`/${lang}/services/${other.slug}/`}
                  className="card-standard min-w-[260px] lg:min-w-0 flex-1 snap-start flex flex-col justify-between group p-6 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
                >
                  <div>
                    <div className="w-[48px] h-[48px] rounded-icon bg-brand-50 flex items-center justify-center mb-4 flex-shrink-0 transition-colors group-hover:bg-brand-100">
                      <OtherIcon size={22} strokeWidth={1.75} className="text-brand-600" />
                    </div>
                    <h3 className="text-[17px] font-bold text-ink mb-2 line-clamp-2">
                      {t(`services.${other.slug}.title`)}
                    </h3>
                    <p className="text-[14px] text-muted line-clamp-3 leading-relaxed">
                      {t(`services.${other.slug}.short`)}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-line/60 flex items-center gap-1 text-[13px] font-bold text-brand-600">
                    <span>{t('cta.learnMore')}</span>
                    <ArrowIcon
                      size={14}
                      className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Service-specific CTA Band */}
      <section className="bg-white py-12 lg:py-16">
        <Container>
          <div className="relative w-full rounded-band bg-brand-600 text-white overflow-hidden py-14 lg:py-16 px-8 lg:px-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="absolute top-0 end-0 h-full flex items-center justify-end opacity-60 pointer-events-none z-0">
              <PeakLines token="brand-800" width={320} height={240} lines={5} />
            </div>

            <div className="relative z-10 max-w-[620px]">
              <h2 className="text-h2 text-white mb-3">{t('services.ctaTitle')}</h2>
              <p className="text-lead text-white/90">{t('services.ctaLead')}</p>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <Button
                to={`/${lang}/contact/?service=${service.slug}`}
                variant="secondary"
                size="default"
              >
                {t('cta.contact')}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};
