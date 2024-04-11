import styles from './Banner.module.scss';
import { BannerProps } from 'types';

import Image from 'next/image';

const TopBanner = ({ props, shape, center, small }: BannerProps) => {
  const bannerImage = props.media.data?.attributes;
  const bannerMimeType = props.media.data?.attributes.mime;
  const bannerTitle = props.title;
  const bannerDescription = props.description;

  // console.log(props);

  let mediaElement;
  if (bannerMimeType?.split('/')[0] === 'image') {
    mediaElement = (
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet={bannerImage.formats?.xlarge?.url || bannerImage.url}
        />
        <Image
          src={`${bannerImage.formats?.small?.url || bannerImage.url}`}
          alt={bannerImage.alternativeText || 'Alpine Armoring'}
          width={bannerImage.width}
          height={bannerImage.height}
          className={`${styles.banner_media}`}
          priority
        />
      </picture>
    );
  } else if (bannerMimeType?.startsWith('video')) {
    mediaElement = (
      <video autoPlay muted loop className={`${styles.banner_media}`}>
        <source src={`${bannerImage.url}`} type={bannerMimeType} />
      </video>
    );
  }

  return (
    <div
      className={`
      ${styles.banner}
      ${small ? styles.banner_small : ''}
      ${center ? styles.banner_center : ''}
    `}
    >
      <div className={`${styles.banner_inner}`}>
        {mediaElement}

        <div className={`${styles.banner_content}`}>
          <div className={`${styles.banner_text} observe fade-in-scale`}>
            {bannerTitle ? (
              <h1
                className={`${styles.banner_title}`}
                dangerouslySetInnerHTML={{ __html: bannerTitle }}
              ></h1>
            ) : null}
            {bannerDescription ? (
              <h2
                className="observe fade-in"
                dangerouslySetInnerHTML={{ __html: bannerDescription }}
              ></h2>
            ) : null}
          </div>
        </div>
      </div>

      {shape ? (
        <div
          className={`${styles.banner_shape} shape-before shape-before-${shape}`}
        ></div>
      ) : null}
    </div>
  );
};

export default TopBanner;
