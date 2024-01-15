import { ReactNode } from 'react';

export interface IconProps {
  className?: string;
  color?: string;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
}

export interface ButtonProps {
  icon?: boolean;
  href?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  button?: boolean;
  dot?: boolean;
  attention?: boolean;
  onClick?: () => void;
}

export interface HeaderProps {
  isNavOpen?: boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode?: boolean;
  isDarkHeader?: boolean;
}

export interface NavigationProps {
  isNavOpen?: boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
