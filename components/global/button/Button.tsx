// import styles from './Button.module.scss';
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
  // const classNames = className
  //   ?.split(' ')
  //   .map((name) => styles[name])
  //   .join(' ');

  if (button) {
    return (
      <button
        className={`
          c-button
          ${className} 
          ${desktopOnly ? 'desktop-only' : ''} 
          ${fadeInScale ? 'fade-in-scale' : ''} 
          ${animate ? 'animate' : ''}
          ${disabled ? 'disabled' : ''}
        `}
        disabled={disabled}
        onClick={onClick}
      >
        {dot ? <span className={`c-button_dot`}></span> : null}
        <span className={`c-button_text`}>{children}</span>
        {icon ? (
          <span className={`c-button_icon`}>
            <ArrowIcon />
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <Link href={href} className={`c-button_wrap`}>
      <span className={`c-button ${className}`}>
        {children}
        {icon ? <span></span> : null}
      </span>
    </Link>
  );
};

export default Button;
