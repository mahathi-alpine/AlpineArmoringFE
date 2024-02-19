import React from 'react';
import styles from './Footer.module.scss';
import FacebookIcon from 'components/icons/Facebook';
import TiktokIcon from 'components/icons/Tiktok';
import XIcon from 'components/icons/X';
import InstagramIcon from 'components/icons/Instagram';
import YoutubeIcon from 'components/icons/Youtube';
import LinkedinIcon from 'components/icons/Linkedin';
import MapIcon from 'components/icons/Map';
import PhoneIcon from 'components/icons/Phone';
import MailIcon from 'components/icons/Mail';
import Link from 'next/link';

const Footer = (isDarkMode) => {
  const links = [
    { path: '/', text: 'Home' },
    { path: '/vehicles-we-armor', text: 'Makes & Models We Armor' },
    { path: '/ballisticchart', text: 'Ballistic Chart' },
    { path: '/available-now/type/armored-rental', text: 'Rentals & Lease' },
    { path: '/become-a-dealer', text: 'Become a Dealer' },
    {
      path: '/available-now/',
      text: 'Stock Vehicles (New)',
    },
    // { path: '/news', text: 'News' },
    { path: '/media', text: 'News & Media' },
    { path: '/available-now/type/armored-rental', text: 'Pre-owned' },
    // { path: '/special-of-the-month', text: 'Special of the Month' },
    { path: '/faqs', text: 'FAQs' },
    { path: '/contact', text: 'Contact Us' },
  ];

  return (
    <footer
      className={`
        ${styles.footer} 
        ${isDarkMode.isDarkMode ? styles.footer_dark : ''}        
      `}
    >
      <div className={`${styles.footer_inner} container`}>
        <div className={`${styles.footer_top}`}>
          <h2 className={`${styles.footer_top_heading}`}>Alpine Armoring</h2>
          <h3 className={`${styles.footer_top_subheading}`}>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            "no one protects you better" ®
          </h3>
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
                    1.800.99.ARMOR
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
                <li>
                  <Link
                    href="https://maps.app.goo.gl/H49yxzm1B3ZMRqLbA"
                    target="_blank"
                    className={`${styles.footer_column_list_item}`}
                  >
                    <MapIcon color="#2d2d27" />
                    Chantilly, Virginia, USA
                  </Link>
                </li>
              </ul>
            </div>

            <div className={`${styles.footer_column}`}>
              <h3 className={`${styles.footer_column_title}`}>
                FOLLOW US ON SOCIALS
              </h3>
              <ul className={`${styles.footer_socials}`}>
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
                <li
                  className={`${styles.footer_socials_item} ${styles.footer_socials_item_x}`}
                >
                  <Link
                    href="https://twitter.com/AlpineArmoring"
                    target="_blank"
                  >
                    <XIcon />
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
                    href="https://www.linkedin.com/company/alpinearmoring/"
                    target="_blank"
                  >
                    <LinkedinIcon />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={`${styles.footer_column}`}>
            <h3 className={`${styles.footer_column_title}`}>QUICK LINKS</h3>
            <ul className={`${styles.footer_column_list} ${styles.footer_nav}`}>
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
        </div>

        <div className={`${styles.footer_bottom}`}>
          <ul className={`${styles.footer_bottom_nav}`}>
            <li className={`${styles.footer_bottom_nav_item}`}>
              <Link href="/">About</Link>
            </li>
            <li className={`${styles.footer_bottom_nav_item}`}>
              <Link href="/">Privacy Policy</Link>
            </li>
            <li className={`${styles.footer_bottom_nav_item}`}>
              <Link href="/">FAQ</Link>
            </li>
            <li className={`${styles.footer_bottom_nav_item}`}>
              <Link href="/">Sitemap</Link>
            </li>
          </ul>

          <p className={`${styles.footer_bottom_copy}`}>
            ©1993-2024. Alpine Armoring Inc. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
