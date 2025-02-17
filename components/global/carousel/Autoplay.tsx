import styles from './Autoplay.module.scss';
import Image from 'next/image';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from 'hooks/useIsMobile';
import useLocale from 'hooks/useLocale';

import useEmblaCarousel from 'embla-carousel-react';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './CarouselArrowButtons';

import useLightbox from '../lightbox/useLightbox';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import NextJsImage from '../lightbox/NextJsImageContent';

interface AutoplayProps {
  slides: Array<{
    image: any;
    year?: string;
    caption?: string;
    allImages?: any;
  }>;
  white?: any;
  squared?: any;
  regular?: any;
  singular?: any;
  autoplay?: boolean;
}

const Autoplay: React.FC<AutoplayProps> = ({
  slides,
  white = undefined,
  regular = undefined,
  singular = undefined,
  autoplay = false,
}) => {
  const options = {
    dragFree: true,
    loop: true,
    thumbs: false,
    variableWidth: true,
    duration: 80,
  };

  const isMobile = useIsMobile();
  const { lang } = useLocale();

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);

  const { openLightbox, renderLightbox } = useLightbox();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaMainApi);

  // Autoplay functionality
  const [isAutoplay, setIsAutoplay] = useState(autoplay);
  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isAutoplay && emblaMainApi && isVisible) {
      autoplayInterval.current = setInterval(() => {
        if (emblaMainApi.canScrollNext()) {
          emblaMainApi.scrollNext();
        } else {
          emblaMainApi.scrollTo(0);
        }
      }, 3000); // Change slide every 3 seconds
    } else if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current);
    }
    return () => {
      if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    };
  }, [isAutoplay, emblaMainApi, isVisible]);

  const handleLightboxOpen = (index: number) => {
    setSelectedIndex(index);
    openLightbox();
    setIsAutoplay(false); // Stop autoplay when lightbox is opened
  };

  // Handler for pausing autoplay on mouse hover
  const handleMouseEnter = useCallback(() => {
    setIsAutoplay(false);
  }, []);

  // Handler for resuming autoplay on mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsAutoplay(true);
  }, []);

  return (
    <div
      className={`
        ${styles.carouselCurved_wrapper}      
      `}
    >
      {!regular && !singular ? (
        <div
          className={`${styles.carouselCurved_shape} ${styles.carouselCurved_shapeAfter} shape-after shape-after-small`}
        ></div>
      ) : null}

      <div
        className={`${styles.carouselCurved}`}
        onMouseEnter={handleMouseEnter} // Pause on hover
        onMouseLeave={handleMouseLeave} // Resume on leave
      >
        <div className={`${styles.carouselCurved_viewport}`} ref={emblaMainRef}>
          <div className={`${styles.carouselCurved_container}`}>
            {slides.map((slide, index) => (
              <div
                className={styles.carouselCurved_slide}
                key={index}
                onClick={() => handleLightboxOpen(index)}
              >
                {slide.image?.attributes?.url ? (
                  <>
                    <div className={`${styles.carouselCurved_slide_inner}`}>
                      {slide.image.attributes.mime.split('/')[0] === 'image' ? (
                        <Image
                          src={
                            isMobile
                              ? slide.image.attributes.formats?.thumbnail?.url
                              : slide.image.attributes.formats?.medium?.url ||
                                slide.image.attributes.url
                          }
                          alt={
                            slide.image.attributes.alternativeText ||
                            'Alpine Armoring'
                          }
                          width={
                            isMobile
                              ? slide.image.attributes.formats?.thumbnail?.width
                              : slide.image.attributes.formats?.medium?.width ||
                                slide.image.attributes.width
                          }
                          height={
                            isMobile
                              ? slide.image.attributes.formats?.thumbnail
                                  ?.height
                              : slide.image.attributes.formats?.medium
                                  ?.height || slide.image.attributes.height
                          }
                          className={styles.carouselCurved_slide_img}
                        ></Image>
                      ) : null}

                      {slide.image.attributes.mime.startsWith('video') ? (
                        <video autoPlay muted loop>
                          <source
                            src={`${slide.image.attributes.url}`}
                            type={slide.image.attributes.mime}
                          />
                        </video>
                      ) : null}

                      <div className={`${styles.carouselCurved_slide_content}`}>
                        <h4 className={`${styles.carouselCurved_slide_title}`}>
                          {slide.year ? <span>{slide.year}</span> : null}
                        </h4>

                        <p className={`${styles.carouselCurved_slide_text}`}>
                          {slide.caption ? <span>{slide.caption}</span> : null}
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}

                {index === 0 && slides.length > 1 && (
                  <div>
                    <Image
                      src="/assets/alpine-shield.png"
                      alt={lang.alpineShield}
                      fill
                      className={styles.carouselCurved_shield}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {slides.length > 1 ? (
            <div
              className={`${styles.carouselCurved_slide_arrows} carousel_arrows_full`}
            >
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
          slides: slides.map((slide) => ({
            src: slide.image.attributes?.url,
            width: slide.image.attributes?.width,
            height: slide.image.attributes?.height,
            formats: slide.image.attributes?.formats,
            year: slide.year,
            caption: slide.caption,
            all: slide.allImages,
          })),
          render: { slide: NextJsImage },
          index: selectedIndex,
        })}
      </div>

      {!regular && !singular ? (
        <div
          className={`${
            styles.carouselCurved_shape
          } shape-before shape-before-small ${
            white ? 'shape-before-white' : ''
          }`}
        ></div>
      ) : null}
    </div>
  );
};

export default Autoplay;
