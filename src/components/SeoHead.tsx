import React from 'react';
import { Head } from 'vite-react-ssg';
import { useLang, useT } from '../i18n/context';

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath,
}) => {
  const { lang, dir } = useLang();
  const t = useT();

  const defaultTitle = t('seo.home.title');
  const defaultDesc = t('seo.home.description');

  const pageTitle = title || defaultTitle;
  const pageDesc = description || defaultDesc;

  const origin = 'https://alaryam.ly';
  const currentPath = canonicalPath || (lang === 'ar' ? '/ar/' : '/en/');
  const canonicalUrl = `${origin}${currentPath}`;
  const arUrl = `${origin}/ar/`;
  const enUrl = `${origin}/en/`;

  return (
    <Head>
      <html lang={lang} dir={dir} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang alternates */}
      <link rel="alternate" hrefLang="ar" href={arUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={arUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${origin}/og-image.png`} />
      <meta property="og:site_name" content={t('company.name')} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={`${origin}/og-image.png`} />
    </Head>
  );
};
