import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const serviceSlugs = [
  'software-development',
  'technical-support',
  'security-surveillance',
  'networks-infrastructure',
  'project-management',
  'iot',
];

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    entry: 'src/main.tsx',
    dirStyle: 'nested',
    formatting: 'none',
    includedRoutes(paths) {
      const localized = ['ar', 'en'].flatMap((lang) => [
        `/${lang}`,
        `/${lang}/services`,
        ...serviceSlugs.map((slug) => `/${lang}/services/${slug}`),
        `/${lang}/about`,
        `/${lang}/contact`,
      ]);

      return ['/', ...localized, '/404'];
    },
    onPageRendered(route, renderedHTML) {
      // Ensure html lang and dir attributes match route
      if (route.startsWith('/en')) {
        return renderedHTML
          .replace('<html lang="ar" dir="rtl">', '<html lang="en" dir="ltr">')
          .replace('<html>', '<html lang="en" dir="ltr">');
      } else {
        return renderedHTML
          .replace('<html lang="en" dir="ltr">', '<html lang="ar" dir="rtl">')
          .replace('<html>', '<html lang="ar" dir="rtl">');
      }
    },
  },
});
