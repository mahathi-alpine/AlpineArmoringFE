import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import styles from './Carousel.module.scss';
import ZoomIcon from 'components/icons/Zoom';

import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import { Thumb } from './CarouselThumbsButton';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './CarouselArrowButtons';

import useLightbox from '../lightbox/useLightbox';
import NextJsImage from '../lightbox/NextJsImage';
import NextJsImageThumbs from '../lightbox/NextJsImageThumbs';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';

const EmblaCarousel = (props) => {
  const { slides, options } = props;
  // const [open, setOpen] = useState(false);
  const { openLightbox, renderLightbox } = useLightbox();

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options, [Fade()]);

  const [thumbsAxis, setThumbsAxis] = useState<'x' | 'y'>('x');
  useEffect(() => {
    window.innerWidth >= 1600 ? setThumbsAxis('y') : setThumbsAxis('x');
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    axis: thumbsAxis,
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const newIndex = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    emblaThumbsApi.scrollTo(newIndex);
  }, [emblaMainApi, emblaThumbsApi]);

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

  const galleryRef = useRef(null);
  const thumbsRef = useRef(null);

  useEffect(() => {
    // Function to adjust the thumbnails container height
    const adjustThumbsContainerHeight = () => {
      if (window.innerWidth >= 1600 && options.thumbs) {
        const firstDivHeight = galleryRef.current.offsetHeight;
        thumbsRef.current.style.height = `${firstDivHeight}px`;
      }
    };

    adjustThumbsContainerHeight();

    const handleResize = () => {
      adjustThumbsContainerHeight();
      if (window.innerWidth < 1600 && options.thumbs) {
        thumbsRef.current.style.height = `auto`;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [options.thumbs]);

  return (
    <div
      className={`${styles.carousel}
      ${options.variableWidth ? `${styles.carousel_variableWidth}` : ''}
    `}
    >
      <div className={`${styles.carousel_viewport}`} ref={emblaMainRef}>
        <div className={`${styles.carousel_container}`} ref={galleryRef}>
          {slides.map((item, index) => (
            <div
              className={styles.carousel_slide}
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                openLightbox();
              }}
            >
              {item.attributes?.url ? (
                <div className={`${styles.carousel_slide_img_wrap}`}>
                  <Image
                    src={
                      item.attributes.formats?.large?.url || item.attributes.url
                    }
                    alt={item.attributes.alternativeText || 'Alpine Armoring'}
                    // quality={100}
                    priority={index === 0}
                    fill
                    className={styles.carousel_slide_img}
                    sizes="70vw"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div
          className={`${styles.carousel_arrows_main} ${styles.carousel_arrows}`}
        >
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className={styles.carousel_zoom}>
          <ZoomIcon />
        </div>
      </div>

      {renderLightbox({
        slides: slides.map((item, index) => ({
          src: item.attributes?.url,
          width: item.attributes?.width,
          height: item.attributes?.height,
          formats: item.attributes?.formats,
          alt: item.attributes?.alternativeText,
          index: index,
          selectedIndex: selectedIndex,
        })),
        plugins: [Thumbnails],
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

      {options.thumbs ? (
        <div className={`${styles.carousel_thumbs}`} ref={thumbsRef}>
          <div className={styles.carousel_thumbs_viewport} ref={emblaThumbsRef}>
            <div className={styles.carousel_thumbs_container}>
              {slides.map((item, index) => (
                <Thumb
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                  alt={item.attributes?.alternativeText}
                  imgSrc={
                    item.attributes?.formats.thumbnail.url ||
                    item.attributes?.url
                  }
                  width={270}
                  height={200}
                  key={index}
                  className={styles.carousel_thumbs_slide}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EmblaCarousel;
