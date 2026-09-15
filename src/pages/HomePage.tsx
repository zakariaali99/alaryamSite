import React, { useRef } from 'react';
import { Layout } from '../components/Layout';
import { SeoHead } from '../components/SeoHead';
import { Hero } from '../sections/home/Hero';
import { ServicesGrid } from '../sections/home/ServicesGrid';
import { HowWeWork } from '../sections/home/HowWeWork';
import { WhoWeServe } from '../sections/home/WhoWeServe';
import { WhyUs } from '../sections/home/WhyUs';
import { CtaBand } from '../sections/home/CtaBand';
import { useT } from '../i18n/context';

export const HomePage: React.FC = () => {
  const t = useT();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AL-ARYAM',
    alternateName: 'الأريام',
    url: 'https://alaryam.ly',
    logo: 'https://alaryam.ly/brand/logo-full-blue.svg',
    email: 'Info@Alaryam.ly',
    areaServed: 'LY',
  };

  return (
    <Layout>
      <SeoHead
        path="/"
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        jsonLd={organizationJsonLd}
      />

      <div>
        <Hero />
        <ServicesGrid />
        <HowWeWork />
        <WhoWeServe />
        <WhyUs />
        <CtaBand />
      </div>
    </Layout>
  );
};
