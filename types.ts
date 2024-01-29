import { ReactNode } from 'react';

export interface BannerProps {
  props: any;
  shape?: string;
  small?: boolean;
}

export interface IconProps {
  className?: string;
  color?: string;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onClick?: () => void;
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
  isNotSticky?: boolean;
}

export interface NavigationProps {
  isNavOpen?: boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
