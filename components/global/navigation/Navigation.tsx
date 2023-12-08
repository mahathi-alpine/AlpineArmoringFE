import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Navigation.module.scss';

// const Button = ({ color, href, className, children }) => {
const Button = () => {
  const router = useRouter();

  return (
    <nav className={`${styles.navigation}`}>
      <ul className={`${styles.navigation_list}`}>
        <li
          className={`${styles.navigation_item} ${
            router.pathname === '/inventory'
              ? `${styles.navigation_item_active}`
              : ''
          }`}
        >
          <Link href="/inventory">New Inventory</Link>
        </li>
        <li className={`${styles.navigation_item}`}>
          <Link className={router.pathname === '/' ? 'active' : ''} href="/">
            Vehicles We Armor
          </Link>
        </li>
        <li className={`${styles.navigation_item}`}>
          <Link className={router.pathname === '/' ? 'active' : ''} href="/">
            Ballistic Chart
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Button;
