import React from 'react';
import { Link } from 'react-router-dom';
import { useLang, useT } from '../i18n/context';

interface LogoProps {
  variant?: 'full' | 'mark';
  color?: 'blue' | 'white';
  className?: string;
  heightClass?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  color = 'blue',
  className = '',
  heightClass,
}) => {
  const { lang } = useLang();
  const t = useT();
  const fullName = t('company.fullName');

  let src = '/brand/logo-full-blue.svg';
  if (variant === 'full') {
    src = color === 'white' ? '/brand/logo-full-white.svg' : '/brand/logo-full-blue.svg';
  } else {
    src = color === 'white' ? '/brand/mark-white.svg' : '/brand/mark-blue.svg';
  }

  const defaultHeight = variant === 'full' 
    ? (heightClass || 'h-[48px] lg:h-[60px]')
    : (heightClass || 'h-[48px] lg:h-[60px]');

  return (
    <Link
      to={`/${lang}/`}
      className={`inline-flex items-center flex-shrink-0 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35 focus-visible:ring-offset-2 ${className}`}
      aria-label={fullName}
    >
      <img
        src={src}
        alt={fullName}
        className={`${defaultHeight} w-auto object-contain block`}
      />
    </Link>
  );
};
