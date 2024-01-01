import styles from './ListingBanner.module.scss';
import Markdown from 'markdown-to-jsx';

import Image from 'next/image';

type ListingBannerProps = {
  props: any;
  overlay?: any;
};

const TopBanner = ({ props, overlay }: ListingBannerProps) => {
  const bannerImage = props.bannerImage.data?.attributes.url;

  return (
    <div
      className={`${styles.banner_top}
      ${overlay ? `${styles.banner_top_overlay}` : ''}
    `}
    >
      <Image
        src={`${bannerImage}`}
        alt="Description of the image"
        width={1920}
        height={450}
        className={`${styles.banner_top_image}`}
      />
      <div className={`${styles.banner_top_content}`}>
        <Markdown className={`${styles.banner_top_text}`}>
          {props.bannerText}
        </Markdown>
      </div>
    </div>
  );
};

export default TopBanner;
