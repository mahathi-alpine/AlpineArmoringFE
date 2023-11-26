import styles from './Button.module.scss';
import Link from "next/link";

const Button = ({desktopOnly, href, className, children}) => {
  const classNames = className.split(' ').map(name => styles[name]).join(' ');
  return (
    <Link href={href}>
        <div className={`${styles.button} ${classNames} ${desktopOnly ? 'desktop-only' : ''}`}>
            {children}
        </div>
    </Link>
  );
};

export default Button;