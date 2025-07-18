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
    {
      path: '/' + lang.armoredVehiclesForSaleURL,
      text: lang.availableNowTitle,
      pathname: '/armored-vehicles-for-sale',
    },
    {
      text: lang.vehiclesWeArmor,
      submenu: [
        {
          text: lang.all,
          path: lang.vehiclesWeArmorURL,
        },
        {
          text: lang.suvsTitleHeader,
          path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.suvsURL}`,
        },
        {
          text: lang.sedans,
          path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.sedansURL}`,
        },
        {
          text: lang.pickupTrucks,
          path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.pickupTrucksURL}`,
        },
        {
          text: lang.vansBuses,
          path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.vansURL}`,
        },
        {
          text: lang.lawEnforcement,
          path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.lawEnforcementURL}`,
        },
        {
          text: lang.CITNavigation,
          path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.citURL}`,
        },
        {
          text: lang.specialtyVehicles,
          path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.specialtyURL}`,
        },
      ],
    },
    {
      path: lang.ballisticTestingURL,
      text: lang.ballisticTestingTitle,
      pathname: '/ballistic-testing',
    },
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
                router.pathname.startsWith(link.pathname)
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
