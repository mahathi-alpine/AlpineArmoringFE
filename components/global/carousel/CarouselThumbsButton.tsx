import React from 'react';
import Image from 'next/image';
import styles from './Carousel.module.scss';

type PropType = {
  selected: boolean;
  imgSrc: string;
  index: number;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, imgSrc, onClick, alt, className, width, height, sizes } =
    props;

  const combinedClassName =
    `${styles.carousel_thumbs_slide} ${selected ? styles.carousel_thumbs_slide_selected : ''} ${className ? className : ''}`.trim();

  return (
    <div className={combinedClassName}>
      <button
        onClick={onClick}
        className={styles.carousel_thumbs_slide_button}
        type="button"
      >
        <Image
          src={imgSrc}
          alt={alt || 'Alpine Armoring'}
          width={width}
          height={height}
          sizes={sizes}
          className={styles.carousel_thumbs_slide_img}
        />
      </button>
    </div>
  );
};
