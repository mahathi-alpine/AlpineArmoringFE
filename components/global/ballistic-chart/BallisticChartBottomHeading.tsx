import styles from './BallisticChartBottom.module.scss';
import Image from 'next/image';
import { useState } from 'react';

import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});
// import useLightbox from '../lightbox/useLightbox';
// import NextJsImage from '../lightbox/NextJsImage';
// import Zoom from 'yet-another-react-lightbox/plugins/zoom';

const BallisticChartBottomHeading = (props) => {
  // const { openLightbox, renderLightbox } = useLightbox();

  // type CustomSlide = {
  //   src: string;
  //   width?: number;
  //   height?: number;
  //   alt?: string;
  //   unoptimized?: boolean;
  //   index?: number;
  //   selectedIndex?: number;
  // };
  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  return (
    <>
      <div
        className={`${styles.ballistic_bottom_top}`}
        id="ballistic-chart-top"
      >
        <Image
          src="/assets/ballistic/ballistic_logo_big.png"
          alt="Alpine Armoring"
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
            // onClick={() => {
            //   openLightbox();
            // }}
            onClick={() => togglePDFPopup(props.bulletPoster)}
          >
            Discover
          </button>
        </div>
      </div>

      <PopupPDF
        isOpen={isPDFPopupOpen}
        onClose={() => togglePDFPopup('')}
        pdfUrl={currentPdfUrl}
      />

      {/* {renderLightbox({
        slides: [
          {
            src: props.bulletPoster?.url,
            width: props.bulletPoster?.width,
            height: props.bulletPoster?.height,
            alt: props.bulletPoster?.alternativeText,
            unoptimized: true,
          },
        ] as CustomSlide[],
        plugins: [Zoom],
        render: {
          slide: NextJsImage,
          buttonPrev: () => null,
          buttonNext: () => null,
        },
      })} */}
    </>
  );
};

export default BallisticChartBottomHeading;
