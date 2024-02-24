import styles from './TabSection.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ArrowIconCircle from 'components/icons/Arrow';
import TabSlider from 'components/global/tab-slider/TabSlider';
import Markdown from 'markdown-to-jsx';

const TabSection = ({ props }) => {
  const [activeDiv, setActiveDiv] = useState('0');
  const handleTabChange = (id) => {
    setActiveDiv(id);
  };

  return (
    <section className={`${styles.tabSection} container`}>
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
                    aria-label="Video player"
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
