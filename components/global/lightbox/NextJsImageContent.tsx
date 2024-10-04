import Image from 'next/image';
import { useState } from 'react';
import styles from './NextJsImageContent.module.scss';

export default function NextJsImageContent({ slide }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const thumbnails = slide.all
    ? slide.all.map(
        (img) =>
          img.attributes.formats?.thumbnail?.url ||
          (img.attributes.mime === 'video/mp4'
            ? img.attributes.mime
            : img.attributes.url)
      )
    : [
        slide.formats?.thumbnail?.url || slide.src,
        slide.formats?.large?.url || slide.formats?.medium?.url || slide.src,
        slide.formats?.xlarge?.url || slide.src,
      ];

  const mainImageSrc = slide.all
    ? slide.all[selectedIndex]?.attributes.mime === 'video/mp4'
      ? slide.all[selectedIndex].attributes.mime
      : window.innerWidth < 500
        ? slide.all[selectedIndex].attributes.formats?.thumbnail?.url ||
          slide.all[selectedIndex].attributes.url
        : window.innerWidth >= 500 && window.innerWidth <= 750
          ? slide.all[selectedIndex].attributes.formats?.medium?.url ||
            slide.all[selectedIndex].attributes.url
          : slide.all[selectedIndex].attributes.formats?.large?.url ||
            slide.all[selectedIndex].attributes.url
    : window.innerWidth < 500
      ? slide.formats?.thumbnail?.url || slide.src
      : window.innerWidth >= 500 && window.innerWidth < 1280
        ? slide.formats?.large?.url || slide.formats?.medium?.url || slide.src
        : slide.formats?.xlarge?.url || slide.src;

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div className={styles.nextContainer}>
      <div className={styles.imageContainer}>
        {mainImageSrc && mainImageSrc !== 'video/mp4' ? (
          <Image
            src={mainImageSrc}
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
            priority={slide.index === selectedIndex}
          />
        ) : (
          <video muted autoPlay playsInline loop preload="auto" controls>
            <source
              src={`${slide.all[selectedIndex].attributes.url}`}
              type={`${slide.all[selectedIndex].attributes.mime}`}
            />
          </video>
        )}
      </div>

      <div className={styles.infoContainer}>
        {slide.year && <div className={styles.year}>{slide.year}</div>}
        {slide.caption && <div className={styles.caption}>{slide.caption}</div>}
        {thumbnails.length > 1 && (
          <div className={styles.thumbnailContainer}>
            {thumbnails.map((thumb, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  index === selectedIndex ? styles.selectedThumbnail : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                {thumb !== 'video/mp4' ? (
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    sizes="(max-width: 767px) 15vw, 10vw"
                    width={120}
                    height={80}
                    className={styles.thumbnailImage}
                  />
                ) : (
                  <svg
                    height="36"
                    width="36"
                    viewBox="0 0 459 459"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                    fill="#FF0000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {' '}
                      <g>
                        {' '}
                        <g>
                          <path d="M229.5,0C102.751,0,0,102.751,0,229.5S102.751,459,229.5,459S459,356.249,459,229.5S356.249,0,229.5,0z M310.292,239.651 l-111.764,76.084c-3.761,2.56-8.63,2.831-12.652,0.704c-4.022-2.128-6.538-6.305-6.538-10.855V153.416 c0-4.55,2.516-8.727,6.538-10.855c4.022-2.127,8.891-1.857,12.652,0.704l111.764,76.084c3.359,2.287,5.37,6.087,5.37,10.151 C315.662,233.564,313.652,237.364,310.292,239.651z"></path>
                        </g>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
