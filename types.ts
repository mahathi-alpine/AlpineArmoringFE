import { ReactNode } from 'react';

export interface IconProps {
  className?: string;
  color?: string;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
}

export interface ButtonProps {
  desktopOnly?: boolean;
  animate?: boolean;
  fadeInScale?: boolean;
  icon?: boolean;
  href?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
}

export interface HeaderProps {
  isNavOpen?: boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NavigationProps {
  isNavOpen?: boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
