import styles from './BallisticChartBottom.module.scss';
import Image from 'next/image';

const BallisticChartBottom = () => {
  return (
    <div className={`${styles.ballistic_bottom}`}>
      <div className={`${styles.ballistic_bottom_top}`}>
        <Image
          src="/assets/ballistic/ballistic_logo_mobile.png"
          alt=""
          width="275"
          height="99"
          className={`${styles.ballistic_bottom_top_logo}`}
        ></Image>
        <div className={`${styles.ballistic_bottom_top_content}`}>
          <h2
            className={`${styles.ballistic_bottom_top_content_title}`}
            data-text="PROJECTILE ENCYCLOPEDIA"
          >
            PROJECTILE ENCYCLOPEDIA
          </h2>
          <button
            className={`${styles.ballistic_bottom_top_content_button}`}
            // onClick={showChosenItems}
          >
            Discover
          </button>
        </div>
      </div>
    </div>
  );
};

export default BallisticChartBottom;
