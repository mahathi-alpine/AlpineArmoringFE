import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationProps } from 'types';
import styles from './NavigationPopup.module.scss';
import dynamic from 'next/dynamic';
import useLocale from 'hooks/useLocale';

import ArrowIcon from 'components/icons/Arrow';
import FacebookIcon from 'components/icons/Facebook';
import TiktokIcon from 'components/icons/Tiktok';
import XIcon from 'components/icons/X';
import InstagramIcon from 'components/icons/Instagram';
import YoutubeIcon from 'components/icons/Youtube';
import LinkedinIcon from 'components/icons/Linkedin';
import MailIcon from 'components/icons/Mail';
import MapIcon from 'components/icons/Map';
import PhoneIcon from 'components/icons/Phone';
import ThreadsIcon from 'components/icons/Threads';
const LanguageSwitcher = dynamic(
  () => import('components/global/lang-switcher/LangSwitcher')
);

const NavigationPopup = ({ isNavOpen, setNavOpen }: NavigationProps) => {
  const router = useRouter();
  const { lang } = useLocale();
  const [activeSubmenu, setActiveSubmenu] = useState<
    { text: string; path: string }[] | null
  >(null);

  const links = [
    { path: '/' + lang.availableNowURL, text: lang.availableNowTitle },
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
    { path: lang.ballisticTestingURL, text: lang.ballisticTestingTitle },
  ];

  const linksRight = [
    {
      path: `/${lang.availableNowURL}/${lang.type}/${lang.armoredRentalURL}`,
      text: lang.rentalVehicles,
    },
    { path: lang.aboutURL, text: lang.aboutUs },
    { path: lang.ballisticChartURL, text: lang.ballisticChartTitle },
    { path: lang.designEngineeringURL, text: lang.designEngineering },
    { path: lang.manufacturingURL, text: lang.manufacturing },
    { path: lang.shippingLogisticsURL, text: lang.shippingLogistics },
    { path: lang.mediaURL, text: lang.headerMediaTitle },
    { path: lang.contactURL, text: lang.contact },
  ];

  const showSubmenu = (
    submenu: { text: string; path: string }[] | undefined
  ) => {
    if (submenu) {
      setActiveSubmenu(submenu);
    } else {
      setActiveSubmenu(null);
    }
  };

  const closeNavAndSubmenu = () => {
    setNavOpen(false);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    if (!isNavOpen) {
      setActiveSubmenu(null);
    }
  }, [isNavOpen]);

  const handleBackClick = () => {
    setActiveSubmenu(null);
  };

  return (
    <nav
      className={`${styles.navigationPopup} ${
        isNavOpen ? styles.navigationPopup_open : ''
      }`}
      id="navigationPopup"
    >
      <div className={`${styles.navigationPopup_inner} container`}>
        <div className={`${styles.navigationPopup_nav}`}>
          {!activeSubmenu && (
            <>
              <ul
                className={`${styles.navigationPopup_list_left} ${styles.navigationPopup_list}`}
              >
                {links.map((link, index) => (
                  <li
                    key={index}
                    className={`
                      ${styles.navigationPopup_item} 
                      ${
                        router.asPath === link.path
                          ? `${styles.navigationPopup_item_active}`
                          : ''
                      }`}
                    onClick={() =>
                      link.path ? setNavOpen(false) : showSubmenu(link.submenu)
                    }
                  >
                    {link.path ? (
                      <Link
                        className={`${styles.navigationPopup_link}`}
                        href={link.path}
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <span className={`${styles.navigationPopup_link}`}>
                        {link.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <ul
                className={`${styles.navigationPopup_list_right} ${styles.navigationPopup_list}`}
              >
                {linksRight.map((link, index) => (
                  <li
                    key={index}
                    className={`
                      ${styles.navigationPopup_item} 
                      ${
                        router.asPath === link.path
                          ? `${styles.navigationPopup_item_active}`
                          : ''
                      }`}
                    onClick={closeNavAndSubmenu}
                  >
                    <Link
                      className={`${styles.navigationPopup_link}`}
                      href={link.path}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeSubmenu && (
            <ul className={`${styles.navigationPopup_submenu}`}>
              <div
                className={`${styles.navigationPopup_submenu_back}`}
                onClick={handleBackClick}
              >
                <ArrowIcon />
              </div>
              {activeSubmenu.map((item, index) => (
                <li
                  key={index}
                  className={`
                    ${styles.navigationPopup_item} 
                    ${
                      router.asPath === item.path
                        ? `${styles.navigationPopup_item_active}`
                        : ''
                    }`}
                >
                  <Link
                    href={item.path}
                    className={`${styles.navigationPopup_link}`}
                    onClick={closeNavAndSubmenu}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.navigationPopup_info}`}>
          <div className={`${styles.navigationPopup_contact}`}>
            <Link
              href="tel:+17034710002"
              className={`${styles.navigationPopup_contact_item}`}
              rel="nofollow noreferrer noopener"
            >
              <PhoneIcon />
              1.703.471.0002
            </Link>
            <Link
              href="mailto:sales@alpineco.com"
              className={`${styles.navigationPopup_contact_item}`}
              rel="nofollow noreferrer noopener"
            >
              <MailIcon />
              Sales@AlpineCo.com
            </Link>

            <div className={`${styles.navigationPopup_contact_item}`}>
              <MapIcon />
              Chantilly, Virginia, USA
            </div>
          </div>

          <ul className={`${styles.navigationPopup_socials}`}>
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.youtube.com/c/AlpineArmoring"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <YoutubeIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.instagram.com/alpinearmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <InstagramIcon color="white" />
              </Link>
            </li>
            <li
              className={`${styles.navigationPopup_socials_item} ${styles.navigationPopup_socials_item_x}`}
            >
              <Link
                href="https://x.com/AlpineArmoring"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <XIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.facebook.com/AlpineArmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <FacebookIcon color="white" />
              </Link>
            </li>
            <li
              className={`${styles.navigationPopup_socials_item} ${styles.navigationPopup_socials_item_tiktok}`}
            >
              <Link
                href="https://www.tiktok.com/@alpinearmoring"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <TiktokIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.linkedin.com/company/alpinearmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <LinkedinIcon color="white" />
              </Link>
            </li>
            <li
              className={`${styles.navigationPopup_socials_item} ${styles.navigationPopup_socials_item_threads}`}
            >
              <Link
                href="https://www.threads.net/@alpinearmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <ThreadsIcon color="white" />
              </Link>
            </li>
          </ul>
        </div>

        <div className={`${styles.navigationPopup_bottom} mobile-only`}>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default NavigationPopup;
