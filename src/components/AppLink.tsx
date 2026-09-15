import React from 'react';
import { Link, NavLink, LinkProps, NavLinkProps } from 'react-router-dom';

export interface AppLinkProps extends LinkProps {
  viewTransition?: boolean;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ viewTransition = true, ...props }, ref) => (
    <Link ref={ref} viewTransition={viewTransition} {...props} />
  )
);
AppLink.displayName = 'AppLink';

export interface AppNavLinkProps extends NavLinkProps {
  viewTransition?: boolean;
}

export const AppNavLink = React.forwardRef<HTMLAnchorElement, AppNavLinkProps>(
  ({ viewTransition = true, ...props }, ref) => (
    <NavLink ref={ref} viewTransition={viewTransition} {...props} />
  )
);
AppNavLink.displayName = 'AppNavLink';
