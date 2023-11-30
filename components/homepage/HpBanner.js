import styles from './HpBanner.module.scss';
import Button from '/components/global/Button';

const HpBanner = ({ props, error }) => {
  // useEffect(() => {
  //   const heading = document.querySelector('.fade-in-left');
  //   heading.classList.add('show');
  // }, []);

  return (
    <div className={`${styles.hp_banner}`}>
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
          <h2 className={`${styles.hp_banner_subtitle} observe animate fade-in-up desktop-only`}>{props.subtitle}</h2>        
          <h1 className={`${styles.hp_banner_title} delay-3 observe animate fade-in-up`}>{props.title}</h1>
          <div className="observe delay-8 animate fade-in-scale inline-block">
            <Button href="/inventory" className="transparent">View Inventory</Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HpBanner;