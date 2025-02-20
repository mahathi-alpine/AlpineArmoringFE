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
      text: lang.vehiclesWeArmor,
      submenu: [
        {
          text: lang.all,
          path: lang.vehiclesWeArmorURL,
        },
        {
          text: lang.suvsTitleHeader,
          path: lang.suvsURL,
        },
        {
          text: lang.sedans,
          path: lang.sedansURL,
        },
        {
          text: lang.pickupTrucks,
          path: lang.pickupTrucksURL,
        },
        {
          text: lang.vansBuses,
          path: lang.vansURL,
        },
        {
          text: lang.lawEnforcement,
          path: lang.lawEnforcementURL,
        },
        {
          text: lang.CITNavigation,
          path: lang.citURL,
        },
        {
          text: lang.specialtyVehicles,
          path: lang.specialtyURL,
        },
      ],
    },
    { path: lang.ballisticTestingURL, text: lang.ballisticTestingTitle },
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
