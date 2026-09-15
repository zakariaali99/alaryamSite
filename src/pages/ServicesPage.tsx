import React from 'react';
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
import { AppLink } from '../components/AppLink';
import { CtaBand } from '../sections/home/CtaBand';
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

export const ServicesPage: React.FC = () => {
  const { lang, isRtl } = useLang();
  const t = useT();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Layout>
      <SeoHead
        path="/services/"
        title={t('seo.services.title')}
        description={t('seo.services.description')}
      />

      <PageHero
        title={t('services.pageTitle')}
        lead={t('services.pageLead')}
        breadcrumbCurrent={t('nav.services')}
      />

      {/* Six large alternating rows - pb-0 so spacing before CTA band matches standard section rhythm */}
      <section className="bg-white pt-12 lg:pt-16 pb-0">
        <Container>
          <div className="flex flex-col">
            {servicesData.map((service, index) => {
              const IconComp = iconMap[service.iconName];
              const num = String(index + 1).padStart(2, '0');
              const isEven = index % 2 === 1;
              const items = (t(`services.${service.slug}.items`) as unknown as string[]) || [];
              const previewItems = items.slice(0, 3);

              return (
                <div
                  key={service.slug}
                  data-reveal
                  className="py-12 lg:py-16 border-b border-line last:border-b-0 last:pb-0 first:pt-0"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Icon Tile + Large Number Block (Side A) */}
                    <div
                      className={`lg:col-span-5 flex items-center gap-6 ${
                        isEven ? 'lg:order-2 lg:justify-end' : 'lg:order-1 lg:justify-start'
                      }`}
                    >
                      <div className="w-[96px] h-[96px] rounded-icon bg-brand-50 flex items-center justify-center flex-shrink-0 text-brand-600 shadow-sm border border-brand-100/60">
                        <IconComp size={44} strokeWidth={1.75} />
                      </div>
                      <div
                        className="font-extrabold text-[56px] lg:text-[72px] text-brand-600/25 leading-none select-none tracking-tight"
                        aria-hidden="true"
                      >
                        {num}
                      </div>
                    </div>

                    {/* Text & Checklist & Learn More (Side B) */}
                    <div
                      className={`lg:col-span-7 flex flex-col items-start ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <h2 className="text-h2 text-ink mb-3">
                        {t(`services.${service.slug}.title`)}
                      </h2>
                      <p className="text-lead text-muted mb-6">
                        {t(`services.${service.slug}.intro`)}
                      </p>

                      {/* First 3 items as a checklist */}
                      <ul className="w-full space-y-3 mb-8">
                        {previewItems.map((itemText, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check size={13} strokeWidth={2.5} />
                            </span>
                            <span className="text-body-custom text-ink font-medium">
                              {itemText}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Learn more link */}
                      <AppLink
                        to={`/${lang}/services/${service.slug}/`}
                        aria-label={`${t('cta.learnMore')} — ${t(`services.${service.slug}.title`)}`}
                        className="inline-flex items-center gap-2 text-[16px] font-bold text-brand-600 hover:text-brand-700 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 rounded-sm"
                      >
                        <span>{t('cta.learnMore')}</span>
                        <span className="sr-only">: {t(`services.${service.slug}.title`)}</span>
                        <ArrowIcon
                          size={18}
                          className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                        />
                      </AppLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Closing CTA Band */}
      <CtaBand />
    </Layout>
  );
};
