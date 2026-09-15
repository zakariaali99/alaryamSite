import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import { I18nProvider } from './i18n/context';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { RootRedirect } from './pages/RootRedirect';
import { NotFoundPage } from './pages/NotFoundPage';

import { SmoothScroll } from './motion/SmoothScroll';

const AppRoot: React.FC = () => {
  return (
    <I18nProvider>
      <SmoothScroll>
        <Outlet />
      </SmoothScroll>
    </I18nProvider>
  );
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppRoot />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: 'ar',
        element: <HomePage />,
      },
      {
        path: 'en',
        element: <HomePage />,
      },
      {
        path: 'ar/services',
        element: <ServicesPage />,
      },
      {
        path: 'en/services',
        element: <ServicesPage />,
      },
      {
        path: 'ar/services/:slug',
        element: <ServiceDetailPage />,
      },
      {
        path: 'en/services/:slug',
        element: <ServiceDetailPage />,
      },
      {
        path: 'ar/about',
        element: <AboutPage />,
      },
      {
        path: 'en/about',
        element: <AboutPage />,
      },
      {
        path: 'ar/contact',
        element: <ContactPage />,
      },
      {
        path: 'en/contact',
        element: <ContactPage />,
      },
      {
        path: '404',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];
