import styles from './StickyHorizontalSlider.module.scss';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

import useEmblaCarousel from 'embla-carousel-react';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from 'components/global/carousel/CarouselArrowButtons';

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
  // curved = false,
  inventory = false,
}) => {
  const { openLightbox, renderLightbox } = useLightbox();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const sliderOptions = {
    dragFree: true,
    // loop: true
  };

  const [containerInnerRef, emblaMainApi] = useEmblaCarousel(sliderOptions);

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaMainApi) return;
    const newIndex = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    emblaMainApi.scrollTo(newIndex);
  }, [emblaMainApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaMainApi);

  return (
    <section
      className={`
        ${styles.stickyHorizontalSlider}      
        ${inventory ? styles.stickyHorizontalSlider_inventory : ''}   
      `}
      // ${curved ? styles.stickyHorizontalSlider_curved : ''}
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
                    <Image
                      src={data.image.data.attributes.formats?.thumbnail.url}
                      alt={
                        data.image.data.attributes.alternativeText ||
                        'Alpine Armoring'
                      }
                      width={550}
                      height={365}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.stickyHorizontalSlider_item_image}
                    />
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

        {slides.length > 1 ? (
          <div className={`carousel_arrows_full`}>
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
        ) : null}
      </div>

      {renderLightbox({
        slides: slides.map((item) => ({
          src: item.attributes?.image.data?.attributes.url,
          width: item.attributes?.image.data?.attributes.width,
          height: item.attributes?.image.data?.attributes.height,
          title: item.attributes?.title,
          formats: item.attributes?.image.data?.attributes.formats,
          alt: item.attributes?.image.data?.attributes.alternativeText,
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
