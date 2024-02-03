import styles from './Banner.module.scss';
import Markdown from 'markdown-to-jsx';
import { BannerProps } from 'types';

import Image from 'next/image';

const TopBanner = ({ props, shape, small, center }: BannerProps) => {
  // console.log(props)
  // return null;

  const bannerImage = props.media.data?.attributes.url;
  const bannerMimeType = props.media.data?.attributes.mime;
  const bannerTitle = props.title;
  const bannerDescription = props.description;

  let mediaElement;
  if (bannerMimeType.split('/')[0] === 'image') {
    mediaElement = (
      <Image
        src={`${bannerImage}`}
        alt="Description of the image"
        width={1920}
        height={600}
        className={`${styles.banner_media}`}
        priority
      />
    );
  } else if (bannerMimeType.startsWith('video')) {
    mediaElement = (
      <video autoPlay muted loop className={`${styles.banner_media}`}>
        <source src={`${bannerImage}`} type={bannerMimeType} />
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
          <div className={`${styles.banner_text}`}>
            {bannerTitle ? (
              <h1 className={`${styles.banner_title} observe fade-in-scale`}>
                {bannerTitle}
              </h1>
            ) : null}
            {bannerDescription ? (
              <h1>
                <Markdown className="observe fade-in">
                  {bannerDescription}
                </Markdown>
              </h1>
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
