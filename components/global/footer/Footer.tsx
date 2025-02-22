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
import useLocale from 'hooks/useLocale';

const Footer = (props) => {
  const router = useRouter();
  const currentRoute = router.asPath;
  const { lang } = useLocale();

  const links = [
    { path: lang.aboutURL, text: lang.aboutTitle },
    { path: lang.ballisticTestingURL, text: lang.ballisticTestingTitle },
    { path: lang.newsURL, text: lang.footerNewsTitle },
    { path: lang.ballisticChartURL, text: lang.ballisticChartTitle },
    { path: lang.blogsURL, text: lang.blogsTitle },
    { path: lang.becomeADealerURL, text: lang.becomeADealerTitle },
    { path: lang.faqsURL, text: lang.footerFaqsTitle },
    { path: lang.locationsWeServeURL, text: lang.locationsWeServeTitle },
    { path: lang.downloadsURL, text: lang.downloadsTitle },
    { path: lang.contactURL, text: lang.footerContactTitle },
  ];
  const links2 = [
    { path: lang.availableNowURL, text: lang.footerAvailableNowTitle },
    {
      path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.pickupTrucksURL}`,
      text: lang.footerPickupTrucksTitle,
    },
    {
      path: `${lang.availableNowURL}/${lang.type}/${lang.preOwnedURL}`,
      text: lang.footerPreOwnedTitle,
    },
    {
      path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.lawEnforcementURL}`,
      text: lang.footerLawEnforcementTitle,
    },
    {
      path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.suvsURL}`,
      text: lang.footerSuvsTitle,
    },
    {
      path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.vansURL}`,
      text: lang.vansAndBussesTitle,
    },
    {
      path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.sedansURL}`,
      text: lang.footerSedansTitle,
    },
    {
      path: `${lang.vehiclesWeArmorURL}/${lang.type}/${lang.citURL}`,
      text: lang.footerCitTitle,
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
                {`"${lang.noOneProtectsBetter}" ®`}
              </h3>
            </div>
            {(currentRoute === '/about-us' ||
              currentRoute === lang.availableNowURL ||
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
              <h3 className={`${styles.footer_column_title}`}>
                {lang.contactUs}
              </h3>
              <ul className={`${styles.footer_column_list}`}>
                <li>
                  <Link
                    href="tel:+17034710002"
                    className={`${styles.footer_column_list_item}`}
                    rel="nofollow noreferrer noopener"
                  >
                    <PhoneIcon color="#2d2d27" />
                    1.703.471.0002
                  </Link>
                </li>
                <li>
                  <Link
                    href="tel:+18009927667"
                    className={`${styles.footer_column_list_item}`}
                    rel="nofollow noreferrer noopener"
                  >
                    <PhoneIcon color="#2d2d27" />
                    1.800.99ARMOR
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:sales@alpineco.com"
                    className={`${styles.footer_column_list_item}`}
                    rel="nofollow noreferrer noopener"
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
              <h3 className={`${styles.footer_column_title}`}>
                {lang.followUs}
              </h3>
              <ul className={`${styles.footer_socials}`}>
                <li className={`${styles.footer_socials_item}`}>
                  <Link
                    href="https://www.youtube.com/c/AlpineArmoring"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <YoutubeIcon />
                  </Link>
                </li>
                <li className={`${styles.footer_socials_item}`}>
                  <Link
                    href="https://www.instagram.com/alpinearmoring/"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <InstagramIcon />
                  </Link>
                </li>
                <li
                  className={`${styles.footer_socials_item} ${styles.footer_socials_item_x}`}
                >
                  <Link
                    href="https://x.com/AlpineArmoring"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <XIcon />
                  </Link>
                </li>
                <li className={`${styles.footer_socials_item}`}>
                  <Link
                    href="https://www.facebook.com/AlpineArmoring/"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
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
                    rel="nofollow noreferrer noopener"
                  >
                    <TiktokIcon />
                  </Link>
                </li>
                <li className={`${styles.footer_socials_item}`}>
                  <Link
                    href="https://www.linkedin.com/company/alpinearmoring/"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
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
                    rel="nofollow noreferrer noopener"
                  >
                    <ThreadsIcon />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={`${styles.footer_column_wrap}`}>
            <div className={`${styles.footer_column}`}>
              <h3 className={`${styles.footer_column_title}`}>
                {lang.mostPopularServices}
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

            <div className={`${styles.footer_column}`}>
              <h3 className={`${styles.footer_column_title}`}>
                {lang.quickLinks}
              </h3>
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
          </div>
        </div>

        <div className={`${styles.footer_bottom}`}>
          <ul className={`${styles.footer_bottom_nav}`}>
            <li className={`${styles.footer_bottom_nav_item}`}>
              <Link href={lang.privacyPolicyURL}>{lang.privacyPolicy}</Link>
            </li>
          </ul>

          <p className={`${styles.footer_bottom_copy}`}>
            ©1997-{new Date().getFullYear()}. Alpine Armoring Inc.{' '}
            <span>{lang.allRightsReserved}</span>
          </p>

          <div
            className={`${styles.footer_flag} ${
              currentRoute === '/manufacturing' ||
              currentRoute === '/ballistic-testing'
                ? styles.footer_flag_dark
                : styles.footer_flag_light
            }`}
          >
            <Image
              src="/assets/footer-american-flag.gif"
              alt="armored vehicles"
              fill
              unoptimized
            />
            <Link href="/" className={`${styles.footer_flag_wrap}`}>
              {lang.homeOfArmoredVehicles}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
