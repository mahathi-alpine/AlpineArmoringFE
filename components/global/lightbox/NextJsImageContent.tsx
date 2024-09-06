import Image from 'next/image';
import { useState } from 'react';
import styles from './NextJsImageContent.module.scss';

export default function NextJsImageContent({ slide }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const thumbnails = slide.all
    ? slide.all.map(
        (img) => img.attributes.formats?.thumbnail?.url || img.attributes.url
      )
    : [
        slide.formats?.thumbnail?.url || slide.src,
        slide.formats?.large?.url || slide.formats?.medium?.url || slide.src,
        slide.formats?.xlarge?.url || slide.src,
      ];

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div className={styles.nextContainer}>
      <div className={styles.imageContainer}>
        {thumbnails[selectedIndex] && (
          <Image
            src={thumbnails[selectedIndex]}
            alt={slide.alt || 'Alpine Armoring'}
            width={
              window.innerWidth < 500
                ? slide.formats?.thumbnail?.width || slide.width
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.width ||
                    slide.formats?.medium?.width ||
                    slide.width
                  : slide.formats?.xlarge?.width || slide.width
            }
            height={
              window.innerWidth < 500
                ? slide.formats?.thumbnail?.height || slide.height
                : window.innerWidth >= 500 && window.innerWidth < 1280
                  ? slide.formats?.large?.height ||
                    slide.formats?.medium?.height ||
                    slide.height
                  : slide.formats?.xlarge?.height || slide.height
            }
            className={styles.mainImage}
            priority={slide.index === selectedIndex}
          />
        )}
      </div>

      <div className={styles.infoContainer}>
        {slide.year && <div className={styles.year}>{slide.year}</div>}
        {slide.caption && <div className={styles.caption}>{slide.caption}</div>}
        <div className={styles.thumbnailContainer}>
          {thumbnails.map((thumb, index) => (
            <div
              key={index}
              className={styles.thumbnail}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className={styles.thumbnailImage}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
