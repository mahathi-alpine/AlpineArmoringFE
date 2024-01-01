import React from 'react';
import Image from 'next/image';
import styles from './Carousel.module.scss';

type PropType = {
  selected: boolean;
  imgSrc: string;
  index: number;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, imgSrc, onClick } = props;

  return (
    <div
      className={styles.carousel_thumbs_slide.concat(
        selected ? ' ' + styles.carousel_thumbs_slide_selected : ''
      )}
    >
      <button
        onClick={onClick}
        className={styles.carousel_thumbs_slide_button}
        type="button"
      >
        <Image
          src={imgSrc}
          alt="Description of the image"
          width={683}
          height={642}
          className={styles.carousel_thumbs_slide_img}
        />
      </button>
    </div>
  );
};
