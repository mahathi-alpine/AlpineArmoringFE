import styles from './HpBanner.module.scss';

const HpBanner = ({ props, error }) => {

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
          <source src={`http://localhost:1337` + props.media?.data.attributes.url} />
        </video>

        <div className={`${styles.hp_banner_content}`}>
          <h2 className={`${styles.hp_banner_subtitle} desktop-only`}>{props.subtitle}</h2>        
          <h1 className={`${styles.hp_banner_title}`}>{props.title}</h1>
          <button>View Inventory</button>
        </div>

      </div>
    </div>
  );
};

export default HpBanner;