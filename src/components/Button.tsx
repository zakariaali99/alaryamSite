import React, { useRef } from 'react';
import { AppLink } from './AppLink';
import { useMagnetic } from '../motion/useMagnetic';

export type ButtonVariant = 'primary' | 'secondary' | 'on-blue-primary' | 'on-blue-secondary';
export type ButtonSize = 'default' | 'header' | 'sm';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  loadingText?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  to,
  href,
  onClick,
  type = 'button',
  loading = false,
  loadingText,
  icon,
  children,
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const elRef = useRef<any>(null);
  useMagnetic(elRef, 8);

  const baseClasses =
    'group relative overflow-hidden inline-flex items-center justify-center font-bold rounded-btn transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/35 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none text-center active:scale-[0.97] will-change-transform';

  const sizeClasses =
    size === 'header'
      ? 'h-[44px] px-5 text-[15px]'
      : size === 'sm'
      ? 'h-[40px] px-4 text-[14px]'
      : 'h-[52px] px-[28px] text-[17px]';

  let variantClasses = '';
  let fillBgClass = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-brand-600 text-white';
      fillBgClass = 'bg-brand-700';
      break;
    case 'secondary':
      variantClasses = 'bg-white text-ink border-[1.5px] border-line';
      fillBgClass = 'bg-surface';
      break;
    case 'on-blue-primary':
      variantClasses = 'bg-white text-brand-600 shadow-sm';
      fillBgClass = 'bg-brand-50';
      break;
    case 'on-blue-secondary':
      variantClasses = 'bg-transparent text-white border-[1.5px] border-white hover:text-brand-600';
      fillBgClass = 'bg-white';
      break;
  }

  const combined = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  const innerContent = (
    <>
      <span aria-hidden="true" className={`button-hover-fill ${fillBgClass}`} />
      <span className="button-content">
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-current shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </span>
    </>
  );

  if (to) {
    return (
      <AppLink
        ref={elRef}
        to={to}
        className={combined}
        aria-label={ariaLabel}
        onClick={onClick as any}
      >
        {innerContent}
      </AppLink>
    );
  }

  if (href) {
    return (
      <a
        ref={elRef}
        href={href}
        className={combined}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      ref={elRef}
      type={type}
      onClick={onClick}
      className={combined}
      disabled={disabled || loading}
      aria-label={ariaLabel}
    >
      {innerContent}
    </button>
  );
};
