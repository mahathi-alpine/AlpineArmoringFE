import styles from './BallisticChartBottom.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import useLocale from 'hooks/useLocale';
import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

const BallisticChartBottomHeading = (props) => {
  const { lang } = useLocale();
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
            data-text={lang.projectileEncyclopedia}
          >
            {lang.projectileEncyclopedia}
          </h2>
          <button
            className={`${styles.ballistic_bottom_top_content_button}`}
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
    </>
  );
};

export default BallisticChartBottomHeading;
