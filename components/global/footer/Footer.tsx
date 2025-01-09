import React from 'react';
import styles from './Footer.module.scss';
import FacebookIcon from 'components/icons/Facebook';
import TiktokIcon from 'components/icons/Tiktok';
import XIcon from 'components/icons/X';
import InstagramIcon from 'components/icons/Instagram';
import YoutubeIcon from 'components/icons/Youtube';
import LinkedinIcon from 'components/icons/Linkedin';
import ThreadsIcon from 'components/icons/Threads';
import MapIcon from 'components/icons/Map';
import PhoneIcon from 'components/icons/Phone';
import MailIcon from 'components/icons/Mail';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Footer = (props) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const links = [
    { path: '/ballistic-chart', text: 'Ballistic Chart' },
    { path: '/ballistic-testing', text: 'Ballistic Testing' },
    { path: '/news', text: 'News On Armored Vehicles' },
    { path: '/become-a-dealer', text: 'Become a Dealer' },
    { path: '/faqs', text: 'Frequently Asked Questions' },
    { path: '/about-us', text: 'About Us' },
    { path: '/all-downloads', text: 'All Downloads' },
    { path: '/locations-we-serve', text: 'Locations We Serve' },
    { path: '/contact', text: 'Contact Alpine Armoring' },
  ];
  const links2 = [
    { path: '/vehicles-we-armor/type/armored-suvs', text: 'Armoring SUVs' },
    { path: '/vehicles-we-armor/type/armored-sedans', text: 'Armoring Sedans' },
    {
      path: '/vehicles-we-armor/type/armored-pickup-trucks',
      text: 'Armoring Pickup Trucks',
    },
    {
      path: '/vehicles-we-armor/type/vans-and-buses',
      text: 'Armoring Vans & Buses',
    },
    {
      path: '/vehicles-we-armor/type/armored-law-enforcement',
      text: 'Armoring Law Enforcement Vehicles',
    },
    {
      path: '/vehicles-we-armor/type/armored-cash-in-transit-cit',
      text: 'Armoring Cash In Transit Vehicles',
    },
    { path: '/available-now', text: 'Armored Vehicles for Sale' },
    {
      path: '/available-now/type/armored-pre-owned',
      text: 'Pre-owned Armored Cars for Sale',
    },
  ];

  return (
    <footer
      className={`
        ${styles.footer} 
        ${props.isDarkMode ? styles.footer_dark : ''}    
        ${props.isFooterPadding0 ? styles.footer_topPadding0 : ''}      
      `}
    >
      <div className={`${styles.footer_inner} container`}>
        <div className={`${styles.footer_top}`}>
          <div className={styles.footer_content}>
            <div className={styles.footer_text}>
              <h2 className={styles.footer_top_heading}>Alpine Armoring</h2>
              <h3 className={styles.footer_top_subheading}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                "no one protects you better" ®
              </h3>
            </div>
            {(currentRoute === '/about-us' ||
              currentRoute === '/available-now' ||
              currentRoute.includes('/countries-we-service')) && (
              <div className={styles.footer_image}>
                <Image
                  src="/assets/armored-vehicles.png"
                  alt="armored vehicles"
                  fill
                  objectPosition="right"
                />
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.footer_middle}`}>
          <div className={`${styles.footer_middle_info}`}>
            <div className={`${styles.footer_column}`}>
              <h3 className={`${styles.footer_column_title}`}>Contact Us</h3>
              <ul className={`${styles.footer_column_list}`}>
                <li>
                  <Link
                    href="tel:+17034710002"
                    className={`${styles.footer_column_list_item}`}
                  >
                    <PhoneIcon color="#2d2d27" />
                    1.703.471.0002
                  </Link>
                </li>
                <li>
                  <Link
                    href="tel:+18009927667"
                    className={`${styles.footer_column_list_item}`}
                  >
                    <PhoneIcon color="#2d2d27" />
                    1.800.99ARMOR
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:sales@alpineco.com"
                    className={`${styles.footer_column_list_item}`}
                  >
                    <MailIcon color="#2d2d27" />
                    Sales@AlpineCo.com
                  </Link>
                </li>
                <li className={`${styles.footer_column_list_item}`}>
                  <MapIcon color="#2d2d27" />
                  Chantilly, Virginia, USA
                </li>
              </ul>
            </div>

            <div className={`${styles.footer_column_social}`}>
              <h3 className={`${styles.footer_column_title}`}>FOLLOW US ON</h3>
              <ul className={`${styles.footer_socials}`}>
                <li className={`${styles.footer_socials_item}`}>
                  <Link
                    href="https://www.youtube.com/c/AlpineArmoring"
                    target="_blank"
                  >
                    <YoutubeIcon />
                  </Link>
                </li>
                <li className={`${styles.footer_socials_item}`}>
                  <Link
                    href="https://www.instagram.com/alpinearmoring/"
                    target="_blank"
                  >
                    <InstagramIcon />
                  </Link>
                </li>
                <li
                  className={`${styles.footer_socials_item} ${styles.footer_socials_item_x}`}
                >
                  <Link href="https://x.com/AlpineArmoring" target="_blank">
                    <XIcon />
                  </Link>
                </li>
                <li className={`${styles.footer_socials_item}`}>
                  <Link
                    href="https://www.facebook.com/AlpineArmoring/"
                    target="_blank"
                  >
                    <FacebookIcon />
                  </Link>
                </li>
                <li
                  className={`${styles.footer_socials_item} ${styles.footer_socials_item_tiktok}`}
                >
                  <Link
                    href="https://www.tiktok.com/@alpinearmoring"
                    target="_blank"
                  >
                    <TiktokIcon />
                  </Link>
                </li>
                <li className={`${styles.footer_socials_item}`}>
                  <Link
                    href="https://www.linkedin.com/company/alpinearmoring/"
                    target="_blank"
                  >
                    <LinkedinIcon />
                  </Link>
                </li>
                <li
                  className={`${styles.footer_socials_item} ${styles.footer_socials_item_threads}`}
                >
                  <Link
                    href="https://www.threads.net/@alpinearmoring/"
                    target="_blank"
                  >
                    <ThreadsIcon />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={`${styles.footer_column_wrap}`}>
            <div className={`${styles.footer_column}`}>
              <h3 className={`${styles.footer_column_title}`}>QUICK LINKS</h3>
              <ul
                className={`${styles.footer_column_list} ${styles.footer_nav}`}
              >
                {links.map((link, index) => (
                  <li className={`${styles.footer_nav_item}`} key={index}>
                    <Link
                      href={link.path}
                      className={`${styles.footer_nav_link}`}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.footer_column}`}>
              <h3 className={`${styles.footer_column_title}`}>
                Most Popular Services
              </h3>
              <ul
                className={`${styles.footer_column_list} ${styles.footer_nav}`}
              >
                {links2.map((link, index) => (
                  <li className={`${styles.footer_nav_item}`} key={index}>
                    <Link
                      href={link.path}
                      className={`${styles.footer_nav_link}`}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={`${styles.footer_bottom}`}>
          <ul className={`${styles.footer_bottom_nav}`}>
            <li className={`${styles.footer_bottom_nav_item}`}>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>

          <p className={`${styles.footer_bottom_copy}`}>
            ©1997-2024. Alpine Armoring Inc. <span>All Rights Reserved</span>
          </p>

          <p
            className={`${styles.footer_bottom_flag} ${
              currentRoute === '/manufacturing' ||
              currentRoute === '/ballistic-testing'
                ? styles.footer_bottom_flag_dark
                : styles.footer_bottom_flag_light
            }`}
          >
            <Image
              src="/assets/footer-american-flag.gif"
              alt="armored vehicles"
              fill
              unoptimized
            />
            <span className={`${styles.footer_bottom_flag_wrap}`}>
              The Home of{' '}
              <Link href="/" className={`${styles.footer_bottom_copy_middle}`}>
                ArmoredVehicles.com
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
