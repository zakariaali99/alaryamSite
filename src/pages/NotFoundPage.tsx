import React from 'react';
import { Layout } from '../components/Layout';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { SeoHead } from '../components/SeoHead';
import { useLang, useT } from '../i18n/context';

export const NotFoundPage: React.FC = () => {
  const { lang } = useLang();
  const t = useT();

  return (
    <Layout>
      <SeoHead
        title={`${t('notFound.title')} — ${t('company.name')}`}
        description={t('notFound.lead')}
      />
      <section className="py-section bg-surface flex-1 flex items-center justify-center min-h-[50vh]">
        <Container className="text-center max-w-[500px] py-16">
          <div className="text-[72px] lg:text-[96px] font-extrabold text-brand-600 leading-none mb-4">
            404
          </div>
          <h1 className="text-h2 text-ink mb-4">{t('notFound.title')}</h1>
          <p className="text-lead text-muted mb-8">{t('notFound.lead')}</p>
          <Button to={`/${lang}/`} variant="primary">
            {t('notFound.back')}
          </Button>
        </Container>
      </section>
    </Layout>
  );
};
