// import styles from './ListingBanner.module.scss';
// import ReactMarkdown from 'react-markdown';

type ListingBannerProps = {
  props: any;
  overlay?: any;
};

const TopBanner = ({ props, overlay }: ListingBannerProps) => {
  // const bannerImage = props.bannerImage.data?.attributes.url;

  return (
    <div>
      {props.bannerText}
      <div className={`${overlay ? `asd` : ''}`}>asd</div>
    </div>
  );
};

export default TopBanner;
