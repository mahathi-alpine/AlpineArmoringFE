import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import styles from './Carousel.module.scss';
import ZoomIcon from 'components/icons/Zoom';

import useEmblaCarousel from 'embla-carousel-react';
import { Thumb } from './CarouselThumbsButton';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './CarouselArrowButtons';

import { Lightbox } from 'yet-another-react-lightbox';
import NextJsImage from '../lightbox/NextJsImage';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
// import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const EmblaCarousel = (props) => {
  // console.log(slides)
  // return null;

  const { slides, options } = props;
  const [open, setOpen] = useState(false);

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);

  const [thumbsAxis, setThumbsAxis] = useState<'x' | 'y'>('x');
  useEffect(() => {
    window.innerWidth >= 1280 ? setThumbsAxis('y') : setThumbsAxis('x');
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
    if (window.innerWidth >= 1280 && options.thumbs) {
      const firstDivHeight = galleryRef.current.offsetHeight;
      thumbsRef.current.style.height = `${firstDivHeight}px`;
    }
  });

  // console.log(slides);

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
                setOpen(true);
                setSelectedIndex(index);
              }}
            >
              {item.attributes?.url ? (
                <picture>
                  <source
                    media="(min-width: 768px)"
                    srcSet={item.attributes.formats?.large?.url}
                  />
                  <Image
                    src={item.attributes.formats?.small.url}
                    alt="alt text here"
                    fill
                    // priority={index === 0}
                    priority
                    className={styles.carousel_slide_img}
                  />
                </picture>
              ) : null}
            </div>
          ))}
        </div>

        <div className={styles.carousel_arrows}>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className={styles.carousel_zoom}>
          <ZoomIcon />
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides.map((item) => ({
          src: item.attributes?.url,
          width: item.attributes?.width,
          height: item.attributes?.height,
        }))}
        index={selectedIndex}
        plugins={[Thumbnails]}
        render={{ slide: NextJsImage }}
        thumbnails={{
          padding: 0,
          gap: 4,
          imageFit: 'cover',
          borderColor: '#737373',
          borderRadius: 8,
        }}
      />

      {options.thumbs ? (
        <div className={`${styles.carousel_thumbs}`} ref={thumbsRef}>
          <div className={styles.carousel_thumbs_viewport} ref={emblaThumbsRef}>
            <div className={styles.carousel_thumbs_container}>
              {slides.map((item, index) => (
                <Thumb
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                  imgSrc={item.attributes?.url}
                  key={index}
                />
              ))}
            </div>
          </div>

          <div className={styles.carousel_thumbs_arrows}>
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EmblaCarousel;
