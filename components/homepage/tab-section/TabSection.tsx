import styles from './TabSection.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ArrowIcon from 'components/icons/Arrow';
import TabSlider from 'components/global/tab-slider/TabSlider';

const TabSection = ({ props }) => {
  const [activeDiv, setActiveDiv] = useState('0');
  const handleTabChange = (id) => {
    setActiveDiv(id);
  };

  const sliderProps = props.map((item) => {
    const newItem = {};
    ['id', 'titleNav'].forEach((field) => {
      newItem[field] = item[field];
    });
    return newItem;
  });

  return (
    <section className={`${styles.tabSection} container`}>
      <TabSlider
        props={sliderProps}
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
                {item.image.data.attributes.mime.startsWith('image/') ? (
                  <Image
                    src={`${item.image.data.attributes.url}`}
                    alt={
                      item.image.data.attributes.alternativeText ||
                      'Alpine Armoring'
                    }
                    width={620}
                    height={430}
                  />
                ) : item.image.data.attributes.mime.startsWith('video/') ? (
                  <video
                    preload="none"
                    autoPlay
                    muted
                    loop
                    width={620}
                    height={430}
                  >
                    <source
                      src={`${item.image.data.attributes.url}`}
                      type={item.image.data.attributes.mime}
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
            ) : null}

            <div className={`${styles.tabSection_item_content}`}>
              <h3
                className={`${styles.tabSection_item_title} observe fade-in-up`}
              >
                {item.title}
              </h3>
              {item.linkText ? (
                <Link
                  className={`${styles.tabSection_item_link} observe fade-in-up`}
                  href={`${item.linkURL}`}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.linkText,
                    }}
                  ></span>
                  <ArrowIcon />
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
