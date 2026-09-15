import React from 'react';
import {
  Compass,
  Target,
  Cpu,
  Wrench,
  Check,
  ShieldCheck,
  Layers,
  LifeBuoy,
  BadgeCheck,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { Container } from '../components/Container';
import { PageHero } from '../components/PageHero';
import { SeoHead } from '../components/SeoHead';
import { CtaBand } from '../sections/home/CtaBand';
import { PeakLines } from '../components/PeakLines';
import { useT } from '../i18n/context';

export const AboutPage: React.FC = () => {
  const t = useT();

  const techBullets = (t('about.capabilities.tech.text') as string)
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);

  const engBullets = (t('about.capabilities.eng.text') as string)
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);

  const values = [
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
    <Layout>
      <SeoHead
        path="/about/"
        title={t('seo.about.title')}
        description={t('seo.about.description')}
      />

      <PageHero
        title={t('about.pageTitle')}
        lead={t('about.intro')}
        breadcrumbCurrent={t('nav.about')}
      />

      {/* Vision & Mission: Two large side-by-side blocks */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision Block: brand-600 background, white text */}
            <div
              data-reveal
              className="relative bg-brand-600 text-white rounded-card p-8 lg:p-12 overflow-hidden shadow-card flex flex-col justify-between"
            >
              <div className="absolute top-0 end-0 opacity-40 pointer-events-none">
                <PeakLines token="brand-800" width={260} height={180} lines={4} />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-icon bg-white/10 flex items-center justify-center mb-6 text-white">
                  <Compass size={30} strokeWidth={1.75} />
                </div>
                <div className="text-[15px] font-bold uppercase tracking-wider text-brand-100 mb-3">
                  {t('about.vision.label')}
                </div>
                <p className="text-lead font-semibold text-white leading-relaxed">
                  {t('about.vision.text')}
                </p>
              </div>
            </div>

            {/* Mission Block: ink background, white text */}
            <div
              data-reveal
              className="relative bg-ink text-white rounded-card p-8 lg:p-12 overflow-hidden shadow-card flex flex-col justify-between"
            >
              <div className="absolute top-0 end-0 opacity-20 pointer-events-none">
                <PeakLines token="brand-800" width={260} height={180} lines={4} />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-icon bg-white/10 flex items-center justify-center mb-6 text-white">
                  <Target size={30} strokeWidth={1.75} />
                </div>
                <div className="text-[15px] font-bold uppercase tracking-wider text-white/70 mb-3">
                  {t('about.mission.label')}
                </div>
                <p className="text-lead font-semibold text-white leading-relaxed">
                  {t('about.mission.text')}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Capabilities: Two capability blocks on surface */}
      <section className="bg-surface py-16 lg:py-24 border-y border-line">
        <Container>
          <div className="max-w-[720px] mb-14">
            <h2 className="text-h2 text-ink mb-4">{t('home.services.title')}</h2>
            <p className="text-lead text-muted">{t('about.intro')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tech Capabilities */}
            <div
              data-reveal
              className="bg-white rounded-card p-8 lg:p-10 border border-line shadow-sm flex flex-col"
            >
              <div className="w-12 h-12 rounded-icon bg-brand-50 flex items-center justify-center mb-6 text-brand-600">
                <Cpu size={26} strokeWidth={1.75} />
              </div>
              <h3 className="text-h3 text-ink mb-6">{t('about.capabilities.tech.title')}</h3>
              <ul className="space-y-4 flex-1">
                {techBullets.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span className="text-body-custom text-ink font-medium leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Engineering Capabilities */}
            <div
              data-reveal
              className="bg-white rounded-card p-8 lg:p-10 border border-line shadow-sm flex flex-col"
            >
              <div className="w-12 h-12 rounded-icon bg-brand-50 flex items-center justify-center mb-6 text-brand-600">
                <Wrench size={26} strokeWidth={1.75} />
              </div>
              <h3 className="text-h3 text-ink mb-6">{t('about.capabilities.eng.title')}</h3>
              <ul className="space-y-4 flex-1">
                {engBullets.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span className="text-body-custom text-ink font-medium leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Values: 2x2 grid */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <h2 className="text-h2 text-ink sticky top-28">
                {t('about.values.title')}
              </h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, i) => {
                const IconComp = v.icon;
                return (
                  <div
                    key={i}
                    data-reveal
                    className="bg-surface rounded-card p-8 border border-line shadow-sm flex flex-col items-start transition-transform duration-200 hover:-translate-y-1 hover:shadow-card"
                  >
                    <div className="w-14 h-14 rounded-icon bg-brand-50 flex items-center justify-center mb-6 text-brand-600">
                      <IconComp size={26} strokeWidth={1.75} />
                    </div>
                    <h3 className="text-h3 text-ink mb-3">{v.title}</h3>
                    <p className="text-body-custom text-muted">{v.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <CtaBand />
    </Layout>
  );
};
