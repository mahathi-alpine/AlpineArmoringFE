import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './NavigationPopup.module.scss';

import FacebookIcon from '../../icons/Facebook';
import TiktokIcon from '../../icons/Tiktok';
import XIcon from '../../icons/X';
import InstagramIcon from '../../icons/Instagram';
import YoutubeIcon from '../../icons/Youtube';
import MailIcon from '../../icons/Mail';
import MapIcon from '../../icons/Map';
import PhoneIcon from '../../icons/Phone';

interface NavigationPopupProps {
  isNavOpen? : boolean;
}

const NavigationPopup = ({ isNavOpen }: NavigationPopupProps) => {
  const router = useRouter();

  const links = [
    { path: "/about", text: "About Us" },
    { path: "/inventory", text: "New Inventory" },
    { path: "/vehicles-we-armor", text: "Vehicles We Armor" }
  ];

  const linksRight = [
    { path: "/ballisticchart", text: "Ballistic Chart" },
    { path: "/inventory", text: "Rental vehicles" },
    { path: "/vehicles-we-armor", text: "Design and Engineering" },
    { path: "/ballisticchart", text: "Manufacturing" },
    { path: "/ballisticchart", text: "Shipping and Logistics" },
    { path: "/ballisticchart", text: "Parts and Accessories" },
    { path: "/ballisticchart", text: "Careers" },
    { path: "/ballisticchart", text: "Become a Dealer" },
    { path: "/ballisticchart", text: "FAQs" }
  ];

  return (
    <nav className={`${styles.navigationPopup} ${isNavOpen ? styles.navigationPopup_open : ''}`}>   

      <div className={`${styles.navigationPopup_inner}`}>
        <div className={`${styles.navigationPopup_nav}`}>
          <ul className={`${styles.navigationPopup_list_left} ${styles.navigationPopup_list}`}>
              {links.map((link, index) => (
                <li key={index} className={`
                  ${styles.navigationPopup_item} 
                  ${router.pathname === link.path ? `${styles.navigationPopup_item_active}` : ''}`}
                >
                  <Link 
                    className={`${styles.navigationPopup_link}`}
                    href={link.path}  
                  >{link.text}</Link>
                </li>
              ))}
          </ul>

          <ul className={`${styles.navigationPopup_list_right} ${styles.navigationPopup_list}`}>
            {linksRight.map((link, index) => (
              <li key={index} className={`
                ${styles.navigationPopup_item} 
                ${router.pathname === link.path ? `${styles.navigationPopup_item_active}` : ''}`}
              >
                <Link 
                  className={`${styles.navigationPopup_link}`}
                  href={link.path}  
                >{link.text}</Link>
              </li>
            ))}
          </ul>   
        </div>

        <div className={`${styles.navigationPopup_bottom}`}>
          <div className={`${styles.navigationPopup_contact}`}>
            <Link href="/" className={`${styles.navigationPopup_contact_item}`}>
              <PhoneIcon />
              1.703.471.0002
            </Link>
            <Link href="/" className={`${styles.navigationPopup_contact_item}`}>
              <MailIcon />
              sales@AlpineCo.com
            </Link>
            <Link href="/" className={`${styles.navigationPopup_contact_item}`}>
              <MapIcon />
              Chantilly, Virginia, USA
            </Link>
          </div>
          <ul className={`${styles.navigationPopup_socials}`}>
            <li className={`${styles.footer_socials_item}`}>
              <Link href="/">
                <FacebookIcon color='white' />
              </Link>
            </li>
            <li className={`${styles.footer_socials_item}`}>
              <Link href="/">
                <TiktokIcon color='white' />
              </Link>
            </li>
            <li className={`${styles.footer_socials_item}`}>
              <Link href="/">
                <XIcon color='white' />
              </Link>
            </li>
            <li className={`${styles.footer_socials_item}`}>
              <Link href="/">
                <InstagramIcon color='white' />
              </Link>
            </li>
            <li className={`${styles.footer_socials_item}`}>
              <Link href="/">
                <YoutubeIcon color='white' />
              </Link>
            </li>
          </ul>
        </div>
      </div>  
    </nav>
  );
};

export default NavigationPopup;
