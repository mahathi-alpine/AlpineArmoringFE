import Link from 'next/link';
import { ButtonProps } from 'types';

const Button = ({
  className,
  children,
  href,
  onClick,
  dot,
  attention,
  disabled,
  iconComponent: IconComponent,
  button,
  target,
}: ButtonProps) => {
  if (button) {
    return (
      <button
        className={`
          c-button
          ${className} 
          ${disabled ? 'disabled' : ''}
        `}
        disabled={disabled}
        onClick={onClick}
      >
        {dot ? <span className={`c-button_dot`}></span> : null}
        {attention ? (
          <>
            <span className="attention_box1"></span>
            <span className="attention_box2">
              <span></span>
            </span>
            <span className="attention_box3"></span>
            <span className="mask"></span>
          </>
        ) : null}
        <span className={`c-button_text`}>{children}</span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`c-button_wrap`}
      target={target ? '_blank' : undefined}
      rel={target ? 'noopener noreferrer' : undefined}
    >
      <span className={`c-button ${className}`}>
        {children}
        {IconComponent ? <IconComponent /> : null}
      </span>
    </Link>
  );
};

export default Button;
