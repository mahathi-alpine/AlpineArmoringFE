import styles from './Button.module.scss';
import Link from 'next/link';
import { ButtonProps } from 'types';

const Button = ({
  desktopOnly,
  animate,
  fadeInScale,
  icon,
  href,
  className,
  children,
  disabled
}: ButtonProps) => {  
  const classNames = className
    ?.split(' ')
    .map((name) => styles[name])
    .join(' ');

  if (disabled){
    return <button disabled={disabled} className={`${styles.button_wrap} ${styles.button_disabled}`}>
      <span
        className={`
          ${styles.button} 
          ${classNames} 
          ${desktopOnly ? 'desktop-only' : ''} 
          ${fadeInScale ? 'fade-in-scale' : ''} 
          ${animate ? 'animate' : ''}`}
      >
        {children}
        {icon ? <span></span> : null}
      </span>
    </button>;
  }

  return (
    <Link href={href} className={`${styles.button_wrap}`}>
      <span
        className={`
          ${styles.button} 
          ${classNames} 
          ${desktopOnly ? 'desktop-only' : ''} 
          ${fadeInScale ? 'fade-in-scale' : ''} 
          ${animate ? 'animate' : ''}`}
      >
        {children}
        {icon ? <span></span> : null}
      </span>
    </Link>
  );
};

export default Button;
