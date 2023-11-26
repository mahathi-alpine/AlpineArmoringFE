import styles from './HpBanner.module.scss';

const HpBanner = ({ props, error }) => {
  const data = props.data.attributes.TopBanner;

  return (
    <div className={`${styles.hp_banner} section_bordered`}>
      <div className={`${styles.hp_banner_inner}`}>
        <video
          muted={true}
          autoPlay={true}
          playsInline={true}
          loop={true}
          className={`${styles.hp_banner_video}`}
        >          
          <source src={`http://localhost:1337` + data.Media.data.attributes.url} />
        </video>

        <div className={`${styles.hp_banner_content}`}>
          <h2 className={`${styles.hp_banner_subtitle} desktop-only`}>{data.Subtitle}</h2>        
          <h1 className={`${styles.hp_banner_title}`}>{data.Title}</h1>
          <button>View Inventory</button>
        </div>

      </div>
    </div>
  );
};

export default HpBanner;