import React from 'react';
import { Link, NavLink, LinkProps, NavLinkProps } from 'react-router-dom';
import { useBladeNavigate } from '../motion/BladeTransitionContext';

export interface AppLinkProps extends LinkProps {
  useBlade?: boolean;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ useBlade = true, onClick, to, replace, ...props }, ref) => {
    const { navigateWithBlade } = useBladeNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);

      if (
        useBlade &&
        !e.defaultPrevented &&
        e.button === 0 &&
        !e.metaKey &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !props.target &&
        !props.download
      ) {
        const dest = typeof to === 'string' ? to : to.pathname || '';
        if (dest && !dest.startsWith('http') && !dest.startsWith('//') && !dest.startsWith('#')) {
          e.preventDefault();
          navigateWithBlade(dest, { replace });
        }
      }
    };

    return <Link ref={ref} to={to} replace={replace} onClick={handleClick} {...props} />;
  }
);
AppLink.displayName = 'AppLink';

export interface AppNavLinkProps extends NavLinkProps {
  useBlade?: boolean;
}

export const AppNavLink = React.forwardRef<HTMLAnchorElement, AppNavLinkProps>(
  ({ useBlade = true, onClick, to, replace, ...props }, ref) => {
    const { navigateWithBlade } = useBladeNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);

      if (
        useBlade &&
        !e.defaultPrevented &&
        e.button === 0 &&
        !e.metaKey &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !props.target &&
        !props.download
      ) {
        const dest = typeof to === 'string' ? to : to.pathname || '';
        if (dest && !dest.startsWith('http') && !dest.startsWith('//') && !dest.startsWith('#')) {
          e.preventDefault();
          navigateWithBlade(dest, { replace });
        }
      }
    };

    return <NavLink ref={ref} to={to} replace={replace} onClick={handleClick} {...props} />;
  }
);
AppNavLink.displayName = 'AppNavLink';
