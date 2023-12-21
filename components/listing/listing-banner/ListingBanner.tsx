import styles from './ListingBanner.module.scss';
// import { API_URL } from 'config/index';

const TopBanner = ({ props }) => {
  const data = props.attributes;
  const bannerImage = data.bannerImage.data?.attributes.url;

  return (
    <div
      className={`${styles.banner_top}`}
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={`${styles.banner_top_content}`}>
        {/* <h1 className={`${styles.banner_top_title}`}>{data.heading}</h1> */}
        <p className={`${styles.banner_top_text}`}>{data.bannerText}</p>
      </div>
    </div>
  );
};

export default TopBanner;
