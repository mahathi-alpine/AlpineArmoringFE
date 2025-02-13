import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useLocale from 'hooks/useLocale';
import styles from './Navigation.module.scss';
import { NavigationProps } from 'types';

const Navigation = ({ isNavOpen }: NavigationProps) => {
  const router = useRouter();
  const { lang } = useLocale();

  const links = [
    { path: lang.availableNowURL, text: lang.availableNowTitle },
    {
      text: 'Vehicles We Armor',
      submenu: [
        {
          text: 'SUVs',
          path: '/vehicles-we-armor/type/armored-suvs',
        },
        {
          text: 'Sedans',
          path: '/vehicles-we-armor/type/armored-sedans',
        },
        {
          text: 'Pickup Trucks',
          path: '/vehicles-we-armor/type/armored-pickup-trucks',
        },
        {
          text: 'Vans & Buses',
          path: '/vehicles-we-armor/type/armored-vans-and-buses',
        },
        {
          text: 'Law Enforcement',
          path: '/vehicles-we-armor/type/armored-law-enforcement',
        },
        {
          text: 'Cash-In-Transit (CIT)',
          path: '/vehicles-we-armor/type/armored-cash-in-transit-cit',
        },
        {
          text: 'Specialty Vehicles',
          path: '/vehicles-we-armor/type/armored-specialty-vehicles',
        },
      ],
    },
    { path: '/ballistic-testing', text: 'Ballistic Testing' },
  ];

  return (
    <nav
      className={`${styles.navigation} ${isNavOpen ? styles.navigation_navOpen : ''}`}
    >
      <ul className={styles.navigation_list}>
        {links.map((link, index) => (
          <li
            key={index}
            className={`
              ${styles.navigation_item} 
              ${
                router.pathname.startsWith(link.path)
                  ? `${styles.navigation_item_active}`
                  : ''
              }
              ${!link.path ? `${styles.navigation_link_disabled}` : ''}
            `}
          >
            {link.path ? (
              <Link href={link.path}>{link.text}</Link>
            ) : (
              <span>{link.text}</span>
            )}

            {link.submenu && (
              <ul className={`${styles.navigation_submenu} navigation_submenu`}>
                {link.submenu.map((submenuItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      className={styles.navigation_submenu_link}
                      href={submenuItem.path}
                    >
                      {submenuItem.text}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
