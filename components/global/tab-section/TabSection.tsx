import styles from './TabSection.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import ArrowIcon from '../../icons/Arrow';
import { API_URL } from 'config/index';


const TabSection = ({ props }) => {
    const [activeDiv, setActiveDiv] = useState(props[0]?.id);
    const handleClick = (id) => {
        setActiveDiv(id);
    };

  return (
    <section className={`${styles.tabSection} container`}>
        <h3 className={`${styles.tabSection_heading} observe fade-in-up`}>Designed, engineered and manufactured like no OTHER armored vehicles in the world</h3>
        <div className={`${styles.tabSection_nav_wrap} observe fade-in-up`}>
            <ul className={`${styles.tabSection_nav}`}>
                {props.map((item) => (
                    <li 
                        className={`${styles.tabSection_nav_item} ${activeDiv === item.id ? styles.tabSection_nav_item_active: ''}`} 
                        key={item.id}
                        onClick={() => handleClick(item.id)}
                    >
                        { item.titleNav }
                    </li>
                ))}
            </ul>
        </div>

        <div className={`${styles.tabSection_content}`}>
            {props.map((item) => (
                <div 
                    key={item.id} 
                    className={`${styles.tabSection_item} ${activeDiv === item.id ? styles.tabSection_item_active: ''}`}
                >
                    {item.image.data?.attributes.url ? <Image
                        src={`${API_URL}${item.image.data.attributes.url}`}
                        alt="Description of the image"
                        width={530}
                        height={405}
                        className={`${styles.tabSection_item_image} observe fade-in`}
                    /> : null} 
                    <div className={`${styles.tabSection_item_content}`}>
                        <h4 className={`${styles.tabSection_item_title} observe fade-in-up`}>{item.title}</h4>
                        <p className={`${styles.tabSection_item_description} observe fade-in-up`}>{item.description}</p>
                        <Link 
                            className={`${styles.tabSection_item_link} observe fade-in-up`} 
                            href="/"
                        >
                            Learn more
                            <ArrowIcon />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
};

export default TabSection;
