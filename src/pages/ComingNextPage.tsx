import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Container } from '../components/Container';
import { SeoHead } from '../components/SeoHead';
import { useLang, useT } from '../i18n/context';

interface ComingNextPageProps {
  pageKey: 'services' | 'about' | 'contact';
}

export const ComingNextPage: React.FC<ComingNextPageProps> = ({ pageKey }) => {
  const { lang } = useLang();
  const t = useT();
  const location = useLocation();

  let titleKey = 'nav.services';
  let seoTitleKey = 'seo.services.title';
  let seoDescKey = 'seo.services.description';

  if (pageKey === 'about') {
    titleKey = 'about.pageTitle';
    seoTitleKey = 'seo.about.title';
    seoDescKey = 'seo.about.description';
  } else if (pageKey === 'contact') {
    titleKey = 'contact.pageTitle';
    seoTitleKey = 'seo.contact.title';
    seoDescKey = 'seo.contact.description';
  }

  const pageTitle = t(titleKey);

  return (
    <Layout>
      <SeoHead
        title={t(seoTitleKey)}
        description={t(seoDescKey)}
        canonicalPath={location.pathname}
      />
      <section className="py-section bg-surface flex-1">
        <Container className="text-center max-w-[600px] py-16">
          <h1 className="text-h1 text-ink mb-4">{pageTitle}</h1>
          <p className="text-lead text-muted">{t('comingNext.message')}</p>
        </Container>
      </section>
    </Layout>
  );
};
