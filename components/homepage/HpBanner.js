import styles from './HpBanner.module.scss';
import Button from '/components/global/Button';

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
          <source src='/hpVideo.mp4' />
        </video>

        <div className={`${styles.hp_banner_content}`}>
          <h2 className={`${styles.hp_banner_subtitle} desktop-only`}>{props.subtitle}</h2>        
          <h1 className={`${styles.hp_banner_title}`}>{props.title}</h1>
          <Button href="http://localhost:3000/inventory" className="transparent">View Inventory</Button>
        </div>

      </div>
    </div>
  );
};

export default HpBanner;