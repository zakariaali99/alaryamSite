import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    entry: 'src/main.tsx',
    dirStyle: 'nested',
    formatting: 'none',
    includedRoutes(paths) {
      return [
        '/',
        '/ar',
        '/en',
        '/ar/services',
        '/en/services',
        '/ar/about',
        '/en/about',
        '/ar/contact',
        '/en/contact',
      ];
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
