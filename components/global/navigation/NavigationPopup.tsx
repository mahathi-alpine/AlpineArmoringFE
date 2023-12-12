import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './NavigationPopup.module.scss';

interface NavigationPopupProps {
  isNavOpen? : boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavigationPopup = ({ setNavOpen, isNavOpen }: NavigationPopupProps) => {
  const router = useRouter();

  const links = [
    { path: "/inventory", text: "New Inventory" },
    { path: "/vehicles-we-armor", text: "Vehicles We Armor" },
    { path: "/ballisticchart", text: "Ballistic Chart" }
  ];

  const linksRight = [
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
    <nav className={
      `${styles.navigationPopup} ${isNavOpen ? styles.navigationPopup_open : ''}`
     }>     
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
    </nav>
  );
};

export default NavigationPopup;
