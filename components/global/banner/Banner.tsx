import styles from './Banner.module.scss';
import Markdown from 'markdown-to-jsx';

import Image from 'next/image';

type BannerProps = {
  props: any;
  overlay?: any;
};

const TopBanner = ({ props, overlay }: BannerProps) => {
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
        height={450}
        className={`${styles.banner_media}`}
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
      className={`${styles.banner}
      ${overlay ? `${styles.banner_overlay}` : ''}
    `}
    >
      {mediaElement}

      <div className={`${styles.banner_content}`}>
        <div className={`${styles.banner_text}`}>
          {bannerTitle ? (
            <h1 className={`${styles.banner_title}`}>{bannerTitle}</h1>
          ) : null}
          {bannerDescription ? <Markdown>{bannerDescription}</Markdown> : null}
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
