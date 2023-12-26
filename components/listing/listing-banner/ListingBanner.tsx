import styles from './ListingBanner.module.scss';
import ReactMarkdown from "react-markdown";

type ListingBannerProps = {
  props: any;
  overlay?: any;
};

const TopBanner = ({ props, overlay }: ListingBannerProps) => {
  const data = props.attributes;
  const bannerImage = data.bannerImage.data?.attributes.url;

  return (
    <div
      className={`${styles.banner_top}
      ${overlay ? `${styles.banner_top_overlay}` : ''}
    `}
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={`${styles.banner_top_content}`}>
        <ReactMarkdown className={`${styles.banner_top_text}`}>{data.bannerText}</ReactMarkdown>
      </div>
    </div>
  );
};

export default TopBanner;
