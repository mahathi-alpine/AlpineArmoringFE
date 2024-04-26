import styles from './Banner.module.scss';
import { BannerProps } from 'types';

import Image from 'next/image';

const TopBanner = ({ props, shape, center, small }: BannerProps) => {
  const bannerImage = props.media.data?.attributes;
  const bannerMimeType = props.media.data?.attributes.mime;
  const bannerTitle = props.title;
  const bannerDescription = props.description;

  let mediaElement;
  if (bannerImage && bannerMimeType?.split('/')[0] === 'image') {
    mediaElement = (
      <Image
        src={`${bannerImage?.formats?.xlarge?.url || bannerImage.url}`}
        alt={bannerImage?.alternativeText || 'Alpine Armoring'}
        width={bannerImage.formats?.xlarge?.width || bannerImage.width}
        height={bannerImage.formats?.xlarge?.height || bannerImage.height}
        className={`${styles.banner_media}`}
        priority
        // quality='100'
        sizes="100vw"
      />
    );
  } else if (bannerImage && bannerMimeType?.startsWith('video')) {
    mediaElement = (
      <video
        autoPlay
        muted
        loop
        playsInline
        // controls
        className={`${styles.banner_media}`}
        // webkit-playsinline
      >
        <source src={`${bannerImage?.url}`} type={bannerMimeType} />
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
