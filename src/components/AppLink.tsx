import React from 'react';
import { Link, NavLink, LinkProps, NavLinkProps } from 'react-router-dom';

export interface AppLinkProps extends LinkProps {
  viewTransition?: boolean;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ viewTransition = true, ...props }, ref) => {
    const isClient = typeof window !== 'undefined';
    const linkProps = isClient ? { ...props, unstable_viewTransition: viewTransition } : props;
    return <Link ref={ref} {...linkProps} />;
  }
);
AppLink.displayName = 'AppLink';

export interface AppNavLinkProps extends NavLinkProps {
  viewTransition?: boolean;
}

export const AppNavLink = React.forwardRef<HTMLAnchorElement, AppNavLinkProps>(
  ({ viewTransition = true, ...props }, ref) => {
    const isClient = typeof window !== 'undefined';
    const navLinkProps = isClient ? { ...props, unstable_viewTransition: viewTransition } : props;
    return <NavLink ref={ref} {...navLinkProps} />;
  }
);
AppNavLink.displayName = 'AppNavLink';
