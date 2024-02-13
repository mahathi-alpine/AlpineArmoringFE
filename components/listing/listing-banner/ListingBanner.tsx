import styles from './ListingBanner.module.scss';
import Markdown from 'markdown-to-jsx';

import Image from 'next/image';

type ListingBannerProps = {
  props: any;
  overlay?: any;
};

const TopBanner = ({ props, overlay }: ListingBannerProps) => {
  const bannerImage = props.bannerImage.data?.attributes.url;
  const bannerText = props.bannerText;

  return (
    <div
      className={`${styles.banner_top}
      ${overlay ? `${styles.banner_top_overlay}` : ''}
    `}
    >
      {bannerImage ? (
        <Image
          src={`${bannerImage}`}
          alt="Description of the image"
          width={2200}
          height={500}
          className={`${styles.banner_top_image}`}
        />
      ) : null}

      {bannerText ? (
        <div className={`${styles.banner_top_content}`}>
          <div className={`${styles.banner_top_text}`}>
            <Markdown>{bannerText}</Markdown>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TopBanner;
