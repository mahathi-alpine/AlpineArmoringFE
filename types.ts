import { ReactNode } from 'react';

export interface HPBannerProps {
  props: {
    title: string;
    description: string;
  };
  error?: Error;
  // languageCookie?: string;
}

export interface BannerProps {
  props: any;
  shape?: string;
  small?: boolean;
  center?: boolean;
}

export interface IconProps {
  className?: string;
  color?: string;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onClick?: () => void;
}

export interface ButtonProps {
  href?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  button?: boolean;
  // icon?: boolean;
  dot?: boolean;
  attention?: boolean;
  onClick?: () => void;
  iconComponent?: React.ElementType;
}

export interface HeaderProps {
  isNavOpen?: boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode?: boolean;
  isNotSticky?: boolean;
  isHomepage?: boolean;
  openSearchPopup?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NavigationProps {
  isNavOpen?: boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  openSearchPopup?: React.Dispatch<React.SetStateAction<boolean>>;
}

// export interface SearchResult {
//   title: string,
//   content: string,
//   url: string,
//   objectID: string
// }
