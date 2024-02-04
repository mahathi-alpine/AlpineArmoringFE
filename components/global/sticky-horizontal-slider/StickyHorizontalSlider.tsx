import styles from './StickyHorizontalSlider.module.scss';
import React, { useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import NextJsImage from '../lightbox/NextJsImage';
import NextJsImageThumbs from '../lightbox/NextJsImageThumbs';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';
import useLightbox from '../lightbox/useLightbox';

const StickyHorizontalSlider = ({
  slides,
  title = undefined,
  curved = false,
  inventory = false,
}) => {
  const { openLightbox, renderLightbox } = useLightbox();
  const [selectedIndex, setSelectedIndex] = useState(null);

  console.log(slides);
  // return null;

  const sliderOptions = {
    dragFree: true,
  };
  const [containerInnerRef] = useEmblaCarousel(sliderOptions);

  return (
    <section
      className={`
        ${styles.stickyHorizontalSlider}
        ${curved ? styles.stickyHorizontalSlider_curved : ''}      
        ${inventory ? styles.stickyHorizontalSlider_inventory : ''}   
      `}
    >
      {title ? (
        <div className={`${styles.stickyHorizontalSlider_heading} container`}>
          <h2 className={`c-title`}>
            <span>{title}</span>
          </h2>
        </div>
      ) : null}

      <div
        className={`${styles.stickyHorizontalSlider_sticky} fade-in-up observe `}
        ref={containerInnerRef}
      >
        <div className={`${styles.stickyHorizontalSlider_inner}`}>
          {slides.map((item, index) => {
            const data = item.attributes ? item.attributes : item;
            return (
              <div
                className={`${styles.stickyHorizontalSlider_item}`}
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  openLightbox();
                }}
              >
                {data.image.data?.attributes.url ? (
                  <div
                    className={`${styles.stickyHorizontalSlider_item_image_wrap}`}
                  >
                    <picture>
                      <source
                        media="(min-width: 768px)"
                        srcSet={data.image.data.attributes.formats?.large?.url}
                      />
                      <Image
                        src={data.image.data.attributes.formats?.small.url}
                        alt={
                          data.image.data.attributes.alternativeText ||
                          'Alpine Armoring'
                        }
                        fill
                        className={styles.stickyHorizontalSlider_item_image}
                      />
                    </picture>
                  </div>
                ) : null}

                <div
                  className={`${styles.stickyHorizontalSlider_item_content}`}
                >
                  <h5 className={`${styles.stickyHorizontalSlider_item_title}`}>
                    {data.title}
                  </h5>
                  {/* <p className={`${styles.stickyHorizontalSlider_item_date}`}>
                    {data.subtitle}
                  </p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {renderLightbox({
        slides: slides.map((item) => ({
          src: item.attributes?.image.data.attributes.url,
          width: item.attributes?.image.data.attributes.width,
          height: item.attributes?.image.data.attributes.height,
          title: item.attributes?.title,
          formats: item.attributes?.formats,
          alt: item.attributes?.alternativeText,
        })),
        plugins: [Thumbnails, Captions],
        thumbnails: {
          padding: 0,
          gap: 4,
          imageFit: 'cover',
          borderColor: '#737373',
          borderRadius: 8,
        },
        render: { slide: NextJsImage, thumbnail: NextJsImageThumbs },
        index: selectedIndex,
      })}
    </section>
  );
};

export default StickyHorizontalSlider;
