import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';
import { Logo } from './Logo';
import { Button } from './Button';
import { useLang, useT } from '../i18n/context';

export const Header: React.FC = () => {
  const { lang, switchLangUrl } = useLang();
  const t = useT();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Monitor scroll for shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Handle ESC key and focus trap for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
        toggleBtnRef.current?.focus();
      }
    };
    if (mobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItems = [
    { to: `/${lang}/`, label: t('nav.home'), exact: true },
    { to: `/${lang}/services/`, label: t('nav.services'), exact: false },
    { to: `/${lang}/about/`, label: t('nav.about'), exact: false },
    { to: `/${lang}/contact/`, label: t('nav.contact'), exact: false },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white border-b border-line transition-shadow duration-200 ${
        scrolled ? 'shadow-header' : ''
      }`}
    >
      <Container className="flex items-center justify-between h-[72px] lg:h-[88px]">
        {/* Start side: Logo */}
        <div className="flex items-center">
          <Logo variant="full" color="blue" heightClass="h-[48px] lg:h-[60px]" />
        </div>

        {/* Center / Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-8 xl:gap-10 h-full"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `inline-flex items-center h-full text-[16px] font-semibold transition-colors duration-150 py-2 border-b-2 -mb-[1px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35 ${
                  isActive
                    ? 'text-brand-600 border-brand-600'
                    : 'text-body border-transparent hover:text-brand-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* End side: Lang switch + CTA button (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            to={switchLangUrl}
            className="text-[15px] font-bold text-body hover:text-brand-600 transition-colors py-1.5 px-2 rounded focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
            aria-label="Switch Language"
          >
            {t('nav.langSwitch')}
          </Link>

          <Button to={`/${lang}/contact/`} size="header" variant="primary">
            {t('cta.contact')}
          </Button>
        </div>

        {/* Mobile controls: Lang switch + Hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <Link
            to={switchLangUrl}
            className="text-[14px] font-bold text-body hover:text-brand-600 px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
            aria-label="Switch Language"
          >
            {t('nav.langSwitch')}
          </Link>

          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 inline-flex items-center justify-center rounded-btn text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileOpen ? <X size={24} strokeWidth={1.75} /> : <Menu size={24} strokeWidth={1.75} />}
          </button>
        </div>
      </Container>

      {/* Mobile Sliding Menu Panel */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="lg:hidden absolute top-full start-0 w-full bg-white border-b border-line shadow-card transition-all duration-200"
        >
          <Container className="py-6 flex flex-col gap-4">
            <nav className="flex flex-col" aria-label="Mobile Navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `py-3 text-[18px] font-bold border-b border-line/60 transition-colors ${
                      isActive ? 'text-brand-600' : 'text-body hover:text-brand-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 flex flex-col gap-3">
              <Button to={`/${lang}/contact/`} variant="primary" className="w-full">
                {t('cta.contact')}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
};
