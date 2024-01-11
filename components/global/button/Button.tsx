import styles from './Button.module.scss';
import Link from 'next/link';
import { ButtonProps } from 'types';
import ArrowIcon from 'components/icons/Arrow';

const Button = ({
  className,
  children,
  href,
  desktopOnly,
  animate,
  fadeInScale,
  onClick,
  icon,
  dot,
  disabled,
  button,
}: ButtonProps) => {
  const classNames = className
    ?.split(' ')
    .map((name) => styles[name])
    .join(' ');

  if (button) {
    return (
      <button
        className={`${styles.button_wrap} ${
          disabled ? styles.button_disabled : ''
        }`}
        disabled={disabled}
        onClick={onClick}
      >
        <span
          className={`
            ${styles.button} 
            ${classNames} 
            ${desktopOnly ? 'desktop-only' : ''} 
            ${fadeInScale ? 'fade-in-scale' : ''} 
            ${animate ? 'animate' : ''}
          `}
        >
          {dot ? <span className={`${styles.button_dot}`}></span> : null}
          <span className={`${styles.button_text}`}>{children}</span>
          {icon ? (
            <span className={`${styles.button_icon}`}>
              <ArrowIcon />
            </span>
          ) : null}
        </span>
      </button>
    );
  }

  return (
    <Link href={href} className={`${styles.button_wrap}`}>
      <span
        className={`
          ${styles.button} 
          ${classNames} 
          ${desktopOnly ? 'desktop-only' : ''} 
          ${fadeInScale ? 'fade-in-scale' : ''} 
          ${animate ? 'animate' : ''}
        `}
      >
        {children}
        {icon ? <span></span> : null}
      </span>
    </Link>
  );
};

export default Button;
