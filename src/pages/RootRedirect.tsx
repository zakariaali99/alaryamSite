import React, { useEffect } from 'react';
import { Head } from 'vite-react-ssg';

export const RootRedirect: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/ar/');
    }
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/ar/" />
        <link rel="canonical" href="https://alaryam.ly/ar/" />
        <title>شركة الأريام — الشريك التقني الآمن</title>
      </Head>
      <div className="p-8 text-center font-cairo">
        <p className="text-muted">جاري التحويل... / Redirecting...</p>
      </div>
    </>
  );
};
