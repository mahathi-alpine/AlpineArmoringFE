import styles from './Button.module.scss';
import Link from "next/link";

const Button = ({desktopOnly, icon, href, className, children}) => {
  const classNames = className?.split(' ').map(name => styles[name]).join(' ');
  return (
    <Link href={href} className={`${styles.button_wrap}`}>
      <div className={`${styles.button} ${classNames} ${desktopOnly ? 'desktop-only' : ''}`}>
        {children}
        {icon ? <span></span>: null }
      </div>
    </Link>
  );
};

export default Button;