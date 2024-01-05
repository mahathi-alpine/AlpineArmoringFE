import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import Image from 'next/image';
import { Thumb } from './CarouselThumbsButton';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './CarouselArrowButtons';

// import  from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import { Lightbox } from 'yet-another-react-lightbox';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import styles from './Carousel.module.scss';
import ZoomIcon from 'components/icons/Zoom';
import { useIsMobile } from 'hooks/useIsMobile';

type PropType = {
  slides?: any;
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const [open, setOpen] = useState(false);

  const { slides, options } = props;
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);

  const isMobile = useIsMobile();

  const thumbsAxis = isMobile ? 'x' : 'y';

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
    const firstDivHeight = galleryRef.current.offsetHeight;
    thumbsRef.current.style.height = `${firstDivHeight}px`;
  }, []);
  return (
    <div className={styles.carousel}>
      <div className={`${styles.carousel_viewport}`} ref={emblaMainRef}>
        <div className={`${styles.carousel_container}`} ref={galleryRef}>
          {slides.map((item, index) => (
            <div className={styles.carousel_slide} key={index}>
              <Image
                src={item.attributes.url}
                alt="Description of the image"
                width={683}
                height={642}
                className={styles.carousel_slide_img}
              />
            </div>
          ))}
        </div>

        <div className={styles.carousel_zoom} onClick={() => setOpen(true)}>
          <ZoomIcon />
        </div>

        <div className={styles.carousel_arrows}>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides.map((item) => ({
          src: item.attributes.url,
        }))}
        index={selectedIndex}
        plugins={[Thumbnails]}
      />

      <div className={`${styles.carousel_thumbs}`} ref={thumbsRef}>
        <div className={styles.carousel_thumbs_viewport} ref={emblaThumbsRef}>
          <div className={styles.carousel_thumbs_container}>
            {slides.map((item, index) => (
              <Thumb
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
                imgSrc={item.attributes.url}
                key={index}
              />
            ))}
          </div>
        </div>

        <div className={styles.carousel_thumbs_arrows}>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
