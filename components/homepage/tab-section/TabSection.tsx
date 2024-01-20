import styles from './TabSection.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ArrowIconCircle from 'components/icons/Arrow';
import TabSlider from 'components/global/tab-slider/TabSlider';
import Markdown from 'markdown-to-jsx';

const TabSection = ({ props }) => {
  // console.log(props);

  const [activeDiv, setActiveDiv] = useState('0');
  const handleTabChange = (id) => {
    setActiveDiv(id);
  };

  return (
    <section className={`${styles.tabSection} container`}>
      {/* <h3 className={`${styles.tabSection_heading} observe fade-in-up`}>
        Designed, engineered and manufactured like no OTHER armored vehicles in
        the world
      </h3> */}

      <TabSlider
        props={props}
        onTabChange={handleTabChange}
        className="fade-in-up observe"
      />

      <div className={`${styles.tabSection_content}`}>
        {props.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.tabSection_item} ${
              activeDiv == index ? styles.tabSection_item_active : ''
            }`}
          >
            {item.image.data?.attributes.url ? (
              <div
                className={`${styles.tabSection_item_image} observe fade-in-up`}
              >
                <Image
                  src={`${item.image.data.attributes.url}`}
                  alt="Description of the image"
                  width={700}
                  height={430}
                />
              </div>
            ) : null}
            <div className={`${styles.tabSection_item_content}`}>
              <h4
                className={`${styles.tabSection_item_title} observe fade-in-up`}
              >
                {item.title}
              </h4>
              {/* <p
                className={`${styles.tabSection_item_description} observe fade-in-up`}
              >
                {item.description}
              </p> */}
              {item.linkText ? (
                <Link
                  className={`${styles.tabSection_item_link} observe fade-in-up`}
                  href="/"
                >
                  <Markdown>{item.linkText}</Markdown>
                  <ArrowIconCircle />
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TabSection;