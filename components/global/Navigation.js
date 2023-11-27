import Link from "next/link";
import styles from './Navigation.module.scss';

const Button = ({color, href, className, children}) => {
  return (    
    <nav className={`${styles.navigation}`}>
        <ul className={`${styles.navigation_list}`}>
            <li className={`${styles.navigation_item}`}>
                <Link href="inventory">New Inventory</Link>
            </li>
            <li className={`${styles.navigation_item}`}>
                <Link href="/">Rentals </Link>
            </li>
            <li className={`${styles.navigation_item}`}>
                <Link href="/">Vehicles We Can Armor</Link>
            </li>
        </ul>
    </nav>
  );
};

export default Button;