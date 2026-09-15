import React from 'react';
import { Head } from 'vite-react-ssg';
import { useLang, useT } from '../i18n/context';

interface SeoHeadProps {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  path = '/',
  noindex = false,
  jsonLd,
}) => {
  const { lang, dir } = useLang();
  const t = useT();

  const pageTitle = title || t('seo.home.title');
  const pageDesc = description || t('seo.home.description');

  const origin = 'https://alaryam.ly';
  // Normalize path: ensures leading slash and trailing slash unless empty/root
  let normPath = path;
  if (!normPath.startsWith('/')) normPath = '/' + normPath;
  if (normPath !== '/' && !normPath.endsWith('/')) normPath = normPath + '/';

  const canonicalUrl = `${origin}/${lang}${normPath === '/' ? '/' : normPath}`;
  const arUrl = `${origin}/ar${normPath === '/' ? '/' : normPath}`;
  const enUrl = `${origin}/en${normPath === '/' ? '/' : normPath}`;

  const currentLocale = lang === 'ar' ? 'ar_LY' : 'en_US';
  const alternateLocale = lang === 'ar' ? 'en_US' : 'ar_LY';

  return (
    <Head>
      <html lang={lang} dir={dir} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang alternates: each page points to its localized counterpart */}
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
      <meta property="og:locale" content={currentLocale} />
      <meta property="og:locale:alternate" content={alternateLocale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={`${origin}/og-image.png`} />

      {/* JSON-LD Schema Markup */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Head>
  );
};
