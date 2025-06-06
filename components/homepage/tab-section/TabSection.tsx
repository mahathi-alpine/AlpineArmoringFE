import styles from './TabSection.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import ArrowIcon from 'components/icons/Arrow';
import TabSlider from 'components/global/tab-slider/TabSlider';
import { useIsMobile } from 'hooks/useIsMobile';
import useLocale from 'hooks/useLocale';

const TabSection = ({ props }) => {
  const { lang } = useLocale();
  const isMobile = useIsMobile();

  const [activeDiv, setActiveDiv] = useState('0');
  const [loadedVideos, setLoadedVideos] = useState(new Set(['0']));
  const videoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const handleTabChange = (id: string) => {
    setActiveDiv(id);
    setLoadedVideos((prev) => new Set([...prev, id]));
  };

  const sliderProps = props.map((item) => {
    const newItem = {};
    ['id', 'titleNav'].forEach((field) => {
      newItem[field] = item[field];
    });
    return newItem;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = (entry.target as HTMLElement).dataset.index;
            if (index) {
              setLoadedVideos((prev) => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(videoRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${styles.tabSection} container`}>
      <TabSlider
        props={sliderProps}
        onTabChange={handleTabChange}
        className="fade-in-up observe"
        small
      />

      <div className={`${styles.tabSection_content}`}>
        {props.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            data-index={index.toString()}
            className={`${styles.tabSection_item} ${
              activeDiv == index ? styles.tabSection_item_active : ''
            }`}
          >
            {item.image?.data ? (
              <div
                className={`${styles.tabSection_item_image} observe fade-in-up`}
              >
                {item.image.data[0].attributes.mime.startsWith('image/') ? (
                  <Image
                    src={`${
                      item.image.data[0].attributes.formats.medium?.url ||
                      item.image.data[0].attributes.url
                    }`}
                    alt={
                      item.image.data[0].attributes.alternativeText ||
                      'Alpine Armoring'
                    }
                    width={620}
                    height={430}
                    sizes="(max-width: 450px) 50vw"
                  />
                ) : item.image.data[0].attributes.mime.startsWith('video/') ? (
                  loadedVideos.has(index.toString()) ? (
                    <video
                      preload="metadata"
                      muted={true}
                      autoPlay
                      playsInline={true}
                      loop={true}
                      width={isMobile ? 380 : 620}
                      height={isMobile ? 200 : 430}
                    >
                      <source
                        src={item.image.data[0].attributes?.url}
                        type={item.image.data[0].attributes.mime}
                      />
                      {lang.videoTagNotSupported}
                    </video>
                  ) : (
                    <div
                      style={{
                        width: isMobile ? 380 : 620,
                        height: isMobile ? 200 : 430,
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Loading video...
                    </div>
                  )
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
