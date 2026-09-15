import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, X, Languages } from 'lucide-react';
import gsap from 'gsap';
import { Container } from './Container';
import { Logo } from './Logo';
import { Button } from './Button';
import { AppLink, AppNavLink } from './AppLink';
import { PeakLines } from './PeakLines';
import { useLang, useT } from '../i18n/context';

export const Header: React.FC = () => {
  const { lang, isRtl, switchLangUrl } = useLang();
  const t = useT();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLDivElement>(null);

  // Pointer swipe state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const currentTranslateXRef = useRef<number>(0);

  const navItems = [
    { to: `/${lang}/`, label: t('nav.home'), exact: true },
    { to: `/${lang}/services/`, label: t('nav.services'), exact: false },
    { to: `/${lang}/about/`, label: t('nav.about'), exact: false },
    { to: `/${lang}/contact/`, label: t('nav.contact'), exact: false },
  ];

  // 1. Scroll progress bar & header show/hide on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

      // Progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      // Header hide/reveal
      if (headerRef.current && !drawerOpen) {
        if (currentScrollY > 120 && currentScrollY > lastScrollY + 5) {
          // Scrolling down
          gsap.to(headerRef.current, {
            yPercent: -100,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        } else if (currentScrollY < lastScrollY - 5) {
          // Scrolling up
          gsap.to(headerRef.current, {
            yPercent: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }

        // Shadow after 8px
        if (currentScrollY > 8) {
          headerRef.current.classList.add('shadow-header');
        } else {
          headerRef.current.classList.remove('shadow-header');
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [drawerOpen]);

  // 2. Route change & resize listener
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawerOpen]);

  // 3. Open/Close Drawer Animation
  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;

    const hiddenX = isRtl ? '100%' : '-100%';

    if (drawerOpen) {
      // Lock body scroll and set drawer accessible
      document.body.style.overflow = 'hidden';
      (window as any).__ALARYAM_DRAWER_OPEN__ = true;

      gsap.killTweensOf([drawer, backdrop]);

      // Backdrop fade in
      gsap.to(backdrop, {
        opacity: 0.55,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => {
          backdrop.style.pointerEvents = 'auto';
          backdrop.style.visibility = 'visible';
        },
      });

      // Drawer slide in horizontally from inline-start edge
      drawer.style.visibility = 'visible';
      gsap.fromTo(
        drawer,
        { x: hiddenX },
        {
          x: '0%',
          duration: 0.55,
          ease: 'expo.out',
        }
      );

      // Stagger nav links
      if (navListRef.current) {
        const links = navListRef.current.querySelectorAll('.drawer-nav-item');
        gsap.fromTo(
          links,
          {
            x: isRtl ? 24 : -24,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.06,
            delay: 0.12,
          }
        );
      }

      // Focus trap
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      (window as any).__ALARYAM_DRAWER_OPEN__ = false;

      gsap.killTweensOf([drawer, backdrop]);

      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          backdrop.style.pointerEvents = 'none';
          backdrop.style.visibility = 'hidden';
        },
      });

      gsap.to(drawer, {
        x: hiddenX,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          drawer.style.visibility = 'hidden';
        },
      });

      hamburgerBtnRef.current?.focus();
    }
  }, [drawerOpen, isRtl]);

  // 4. Focus trapping & Esc key
  useEffect(() => {
    if (!drawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // 5. Swipe to close drawer
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartRef.current = { x: e.clientX, y: e.clientY };
    currentTranslateXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchStartRef.current || !drawerRef.current) return;
    const deltaX = e.clientX - touchStartRef.current.x;
    // In RTL, dragging right (deltaX > 0) closes. In LTR, dragging left (deltaX < 0) closes.
    const isClosingDrag = isRtl ? deltaX > 0 : deltaX < 0;
    if (isClosingDrag) {
      drawerRef.current.style.transform = `translateX(${deltaX}px)`;
      currentTranslateXRef.current = deltaX;
    }
  };

  const handlePointerUp = () => {
    if (!touchStartRef.current) return;
    const distance = Math.abs(currentTranslateXRef.current);
    if (distance > 80) {
      setDrawerOpen(false);
    } else if (drawerRef.current) {
      gsap.to(drawerRef.current, { x: '0%', duration: 0.2, ease: 'power2.out' });
    }
    touchStartRef.current = null;
    currentTranslateXRef.current = 0;
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 w-full bg-white border-b border-line transition-all duration-200"
      >
        {/* Scroll Progress Bar at very top */}
        <div
          ref={progressBarRef}
          className="absolute top-0 start-0 h-[2px] w-full bg-brand-600 pointer-events-none"
          style={{
            transform: 'scaleX(0)',
            transformOrigin: isRtl ? 'right' : 'left',
          }}
          aria-hidden="true"
        />

        <Container className="flex items-center justify-between h-[72px] lg:h-[88px]">
          {/* Start side: Logo */}
          <div className="flex items-center">
            <Logo variant="full" color="blue" heightClass="h-[48px] lg:h-[60px]" />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-8 xl:gap-10 h-full"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => (
              <AppNavLink
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
              </AppNavLink>
            ))}
          </nav>

          {/* Desktop Lang Switch + CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <AppLink
              to={switchLangUrl}
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-body hover:text-brand-600 transition-colors py-1.5 px-2 rounded focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
              aria-label="Switch Language"
            >
              <Languages size={18} strokeWidth={1.75} className="text-brand-600 flex-shrink-0" />
              <span>{t('nav.langSwitch')}</span>
            </AppLink>

            <Button to={`/${lang}/contact/`} size="header" variant="primary" className="magnetic-btn">
              {t('cta.contact')}
            </Button>
          </div>

          {/* Mobile controls: Lang switch + 44x44 Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <AppLink
              to={switchLangUrl}
              className="inline-flex items-center gap-1 text-[14px] font-bold text-body hover:text-brand-600 px-2 py-1.5 rounded focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
              aria-label="Switch Language"
            >
              <Languages size={16} strokeWidth={1.75} className="text-brand-600 flex-shrink-0" />
              <span>{t('nav.langSwitch')}</span>
            </AppLink>

            <button
              ref={hamburgerBtnRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-[44px] h-[44px] inline-flex items-center justify-center rounded-btn text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-label="Open Navigation Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between" aria-hidden="true">
                <span className="w-full h-[2px] bg-ink rounded-full transition-transform" />
                <span className="w-full h-[2px] bg-ink rounded-full transition-transform" />
                <span className="w-full h-[2px] bg-ink rounded-full transition-transform" />
              </div>
            </button>
          </div>
        </Container>
      </header>

      {/* Backdrop: Full screen ink at 55% */}
      <div
        ref={backdropRef}
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 bg-ink z-50 transition-opacity"
        style={{
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Side Drawer: Fixed to inline-start edge (Right in AR, Left in EN) */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.home')}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="fixed top-0 bottom-0 z-50 bg-white flex flex-col justify-between shadow-2xl overflow-y-auto"
        style={{
          insetInlineStart: 0,
          width: 'min(85vw, 360px)',
          height: '100dvh',
          visibility: 'hidden',
          borderInlineEnd: '1px solid var(--line)',
          transform: isRtl ? 'translateX(100%)' : 'translateX(-100%)',
        }}
      >
        <div className="flex flex-col flex-1">
          {/* Drawer Header (72px): Logo 44px + Close button */}
          <div className="h-[72px] px-5 flex items-center justify-between border-b border-line flex-shrink-0">
            <Logo variant="full" color="blue" heightClass="h-[44px]" />
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="w-10 h-10 inline-flex items-center justify-center rounded-btn text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35"
              aria-label="Close Navigation Menu"
            >
              <X size={24} strokeWidth={1.75} />
            </button>
          </div>

          {/* Nav Links: 22px/700, 64px rows with active indicator */}
          <div ref={navListRef} className="flex flex-col py-2">
            {navItems.map((item) => (
              <AppNavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  `drawer-nav-item relative h-[64px] px-6 flex items-center text-[22px] font-bold transition-colors border-b border-line/40 ${
                    isActive
                      ? 'text-brand-600 bg-brand-50/50'
                      : 'text-ink hover:text-brand-600 hover:bg-surface'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Start edge active bar */}
                    {isActive && (
                      <span
                        className="absolute inset-y-0 start-0 w-[4px] bg-brand-600"
                        aria-hidden="true"
                      />
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </AppNavLink>
            ))}
          </div>

          {/* Action section: Lang switch + Full-width Contact button */}
          <div className="p-6 flex flex-col gap-4 border-t border-line/60">
            <AppLink
              to={switchLangUrl}
              onClick={() => setDrawerOpen(false)}
              className="text-[16px] font-bold text-body hover:text-brand-600 py-1 inline-flex items-center gap-2"
              aria-label="Switch Language"
            >
              <Languages size={18} strokeWidth={1.75} className="text-brand-600 flex-shrink-0" />
              <span>{t('nav.langSwitch')}</span>
            </AppLink>

            <Button
              to={`/${lang}/contact/`}
              variant="primary"
              className="w-full"
              onClick={() => setDrawerOpen(false)}
            >
              {t('cta.contact')}
            </Button>
          </div>
        </div>

        {/* Drawer Bottom: Info@Alaryam.ly mailto + PeakLines in brand-50 */}
        <div className="p-6 pt-4 border-t border-line bg-surface flex flex-col gap-3 relative overflow-hidden">
          <a
            href="mailto:Info@Alaryam.ly"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-body hover:text-brand-600 transition-colors z-10"
          >
            <Mail size={18} strokeWidth={1.75} className="text-brand-600 flex-shrink-0" />
            <span>Info@Alaryam.ly</span>
          </a>

          <div className="absolute -bottom-4 -end-4 opacity-50 pointer-events-none z-0">
            <PeakLines token="brand-50" width={160} height={80} lines={4} />
          </div>
        </div>
      </div>
    </>
  );
};
