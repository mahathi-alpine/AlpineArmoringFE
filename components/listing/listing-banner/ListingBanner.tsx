import styles from './ListingBanner.module.scss';
// import ReactMarkdown from 'react-markdown';
// import Image from 'next/image';

type ListingBannerProps = {
  props: any;
  overlay?: any;
};

const TopBanner = ({ props, overlay }: ListingBannerProps) => {
  console.log(props);
  // const bannerImage = props.bannerImage.data?.attributes.url;

  return (
    <div
      className={`${styles.banner_top}
      ${overlay ? `${styles.banner_top_overlay}` : ''}
    `}
    >
      {/* <Image
        src={`${bannerImage}`}
        alt="Description of the image"
        width={1920}
        height={450}
        className={`${styles.banner_top_image}`}
      /> */}
      <div className={`${styles.banner_top_content}`}>
        {/* <ReactMarkdown className={`${styles.banner_top_text}`}>
          {props.bannerText}
        </ReactMarkdown> */}
      </div>
    </div>
  );
};

export default TopBanner;
