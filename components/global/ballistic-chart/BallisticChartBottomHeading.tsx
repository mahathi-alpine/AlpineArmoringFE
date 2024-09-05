import styles from './BallisticChartBottom.module.scss';
import Image from 'next/image';
import useLightbox from '../lightbox/useLightbox';
import NextJsImage from '../lightbox/NextJsImage';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

const BallisticChartBottomHeading = () => {
  const { openLightbox, renderLightbox } = useLightbox();

  return (
    <>
      <div className={`${styles.ballistic_bottom_top}`}>
        <Image
          src="/assets/ballistic/ballistic_logo_big.png"
          alt=""
          width="384"
          height="229"
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
            onClick={() => {
              openLightbox();
            }}
          >
            Discover
          </button>
        </div>
      </div>

      {renderLightbox({
        slides: [
          {
            src: '/assets/ballistic/Alpine-bullet-poster.jpg',
            width: 4500,
            height: 3000,
          },
        ],
        plugins: [Zoom],
        render: {
          slide: NextJsImage,
          buttonPrev: () => null,
          buttonNext: () => null,
        },
      })}
    </>
  );
};

export default BallisticChartBottomHeading;
