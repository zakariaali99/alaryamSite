import React, { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { SeoHead } from '../components/SeoHead';
import { Hero } from '../sections/home/Hero';
import { ServicesGrid } from '../sections/home/ServicesGrid';
import { HowWeWork } from '../sections/home/HowWeWork';
import { WhoWeServe } from '../sections/home/WhoWeServe';
import { WhyUs } from '../sections/home/WhyUs';
import { CtaBand } from '../sections/home/CtaBand';
import { useLang, useT } from '../i18n/context';

export const HomePage: React.FC = () => {
  const { lang } = useLang();
  const t = useT();

  // Scroll reveal setup
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <SeoHead
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        canonicalPath={`/${lang}/`}
      />

      <div>
        <Hero />
        <div className="reveal-on-scroll reveal-init">
          <ServicesGrid />
        </div>
        <div className="reveal-on-scroll reveal-init">
          <HowWeWork />
        </div>
        <div className="reveal-on-scroll reveal-init">
          <WhoWeServe />
        </div>
        <div className="reveal-on-scroll reveal-init">
          <WhyUs />
        </div>
        <div className="reveal-on-scroll reveal-init">
          <CtaBand />
        </div>
      </div>
    </Layout>
  );
};
