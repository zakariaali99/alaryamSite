import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import { I18nProvider } from './i18n/context';
import { HomePage } from './pages/HomePage';
import { ComingNextPage } from './pages/ComingNextPage';
import { RootRedirect } from './pages/RootRedirect';
import { NotFoundPage } from './pages/NotFoundPage';

const AppRoot: React.FC = () => {
  return (
    <I18nProvider>
      <Outlet />
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
        element: <ComingNextPage pageKey="services" />,
      },
      {
        path: 'en/services',
        element: <ComingNextPage pageKey="services" />,
      },
      {
        path: 'ar/about',
        element: <ComingNextPage pageKey="about" />,
      },
      {
        path: 'en/about',
        element: <ComingNextPage pageKey="about" />,
      },
      {
        path: 'ar/contact',
        element: <ComingNextPage pageKey="contact" />,
      },
      {
        path: 'en/contact',
        element: <ComingNextPage pageKey="contact" />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];
