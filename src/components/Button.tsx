import React from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'on-blue-primary' | 'on-blue-secondary';
export type ButtonSize = 'default' | 'header' | 'sm';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  to,
  href,
  onClick,
  type = 'button',
  children,
  className = '',
  disabled = false,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-btn transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none text-center';

  const sizeClasses =
    size === 'header'
      ? 'h-[44px] px-5 text-[15px]'
      : size === 'sm'
      ? 'h-[40px] px-4 text-[14px]'
      : 'h-[52px] px-[28px] text-[17px]';

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800';
      break;
    case 'secondary':
      variantClasses =
        'bg-white text-ink border-[1.5px] border-line hover:bg-surface active:bg-line/40';
      break;
    case 'on-blue-primary':
      variantClasses =
        'bg-white text-brand-600 hover:bg-surface active:bg-brand-50 shadow-sm';
      break;
    case 'on-blue-secondary':
      variantClasses =
        'bg-transparent text-white border-[1.5px] border-white hover:bg-white/10 active:bg-white/20';
      break;
  }

  const combined = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combined}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combined}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combined} disabled={disabled}>
      {children}
    </button>
  );
};
