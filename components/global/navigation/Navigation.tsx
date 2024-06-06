import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Navigation.module.scss';
import { NavigationProps } from 'types';

const Navigation = ({ isNavOpen }: NavigationProps) => {
  const router = useRouter();

  const links = [
    { path: '/available-now', text: 'Available Now' },
    { path: '/vehicles-we-armor', text: 'Vehicles We Armor' },
    { path: '#', text: 'Ballistic Testing' },
  ];

  return (
    <nav
      className={`${styles.navigation} ${
        isNavOpen ? styles.navigation_navOpen : ''
      }`}
    >
      <ul className={`${styles.navigation_list}`}>
        {links.map((link, index) => (
          <li
            key={index}
            className={`
            ${styles.navigation_item} 
            ${
              router.pathname.startsWith(link.path)
                ? `${styles.navigation_item_active}`
                : ''
            }`}
          >
            <Link className={`${styles.navigationPopup_link}`} href={link.path}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
