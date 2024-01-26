import styles from './CarouselCurved.module.scss';
import ZoomIcon from 'components/icons/Zoom';
import Image from 'next/image';
import React, { useState } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './CarouselArrowButtons';

import useLightbox from '../lightbox/useLightbox';
import 'yet-another-react-lightbox/styles.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import NextJsImage from '../lightbox/NextJsImage';
import NextJsImageThumbs from '../lightbox/NextJsImageThumbs';

const CarouselCurved = (props) => {
  const slides = props.props;
  // console.log(slides)
  // return null;

  const options = {
    dragFree: false,
    loop: true,
    thumbs: false,
    variableWidth: true,
  };

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);

  const { openLightbox, renderLightbox } = useLightbox();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaMainApi);

  return (
    <>
      <div
        className={`${styles.carouselCurved_shapeAfter} shape-after shape-after-small`}
      ></div>

      <div className={`${styles.carouselCurved}`}>
        <div className={`${styles.carouselCurved_viewport}`} ref={emblaMainRef}>
          <div className={`${styles.carouselCurved_container}`}>
            {slides.map((item, index) => (
              <div
                className={styles.carouselCurved_slide}
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  openLightbox();
                }}
              >
                {item.attributes?.url ? (
                  <Image
                    src={item.attributes.url}
                    alt="Description of the image"
                    width={800}
                    height={600}
                    className={styles.carouselCurved_slide_img}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className={styles.carouselCurved_arrows}>
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>

          <div className={styles.carouselCurved_zoom}>
            <ZoomIcon />
          </div>
        </div>

        {renderLightbox({
          slides: slides.map((item) => ({
            src: item.attributes?.url,
            width: item.attributes?.width,
            height: item.attributes?.height,
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
      </div>

      <div className="shape-before shape-before-white shape-before-small"></div>
    </>
  );
};

export default CarouselCurved;
