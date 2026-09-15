import React, { useRef } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useReveal } from '../motion/useReveal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const mainRef = useRef<HTMLElement | null>(null);
  useReveal(mainRef);

  return (
    <div className="min-h-screen flex flex-col bg-white text-body font-cairo">
      <Header />
      <main ref={mainRef} className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};
