import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component className={`w-full max-w-[1200px] mx-auto px-5 sm:px-6 ${className}`}>
      {children}
    </Component>
  );
};
