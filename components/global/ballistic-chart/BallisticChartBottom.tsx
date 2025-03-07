import styles from './BallisticChartBottom.module.scss';
import BallisticChartBottomHeading from './BallisticChartBottomHeading';
import { useState } from 'react';
import useLocale from 'hooks/useLocale';
import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

const BallisticChartBottom = (props) => {
  const { lang } = useLocale();

  const projectileAcronyms = [
    {
      name: 'AP',
      text: 'Armor Piercing',
    },
    {
      name: 'API',
      text: 'Armor Piercing Incendiary',
    },
    {
      name: 'FMJ',
      text: 'Full Metal Jacket',
    },
    {
      name: 'JHP',
      text: 'Jacketed Hollow Point',
    },
    {
      name: 'JSP',
      text: 'Jacketed Soft Point',
    },
    {
      name: 'RN',
      text: 'Round Nose',
    },
    {
      name: 'GT',
      text: 'Green Tip AP',
    },
    {
      name: 'PB',
      text: 'Pointed Bullet',
    },
    {
      name: 'BT',
      text: 'Boattail Bullet',
    },
    {
      name: 'HC',
      text: 'Hard Core',
    },
    {
      name: 'WC',
      text: 'Wadcutter',
    },
    {
      name: 'LC',
      text: 'Lead Core',
    },
    {
      name: 'BZ',
      text: 'Brillouin Zone',
    },
  ];

  const otherAcronyms = [
    {
      name: 'NATO',
      text: 'North Atlantic Treaty Organization',
    },
    {
      name: 'ANSI',
      text: 'American National Standards Institute',
    },
    {
      name: 'Ö-Norm',
      text: 'Austrian Standards Institute',
    },
    {
      name: 'SNV',
      text: 'Swiss Standards Association',
    },
    {
      name: 'BSI',
      text: 'British Standards Institution',
    },
    {
      name: 'HOSDM',
      text: 'The UK Home Office Scientific Development Branch',
    },
    {
      name: 'EASC',
      text: 'Euro-Asian Council For Standardization Metrology And Certification',
    },
    {
      name: 'GOST',
      text: 'Russian Government Standards (Gosudarstvennyy Standart)',
    },
    {
      name: 'ISO',
      text: 'International Standards Organization',
    },
    {
      name: 'AS/NZS',
      text: 'Standards for Australia and New Zealand (2343:1997)',
    },
    {
      name: 'NGA',
      text: 'National Glass Association',
    },
    {
      name: 'UHH',
      text: 'Ultra-high Hardness (Armour steel alloy of 578-655 HBW)',
    },
    {
      name: 'ARMOX',
      text: 'Ballistic Steel brand by SSAB for armored vehicles',
    },
    {
      name: 'RAMOR',
      text: 'Ballistic Steel brand by SSAB for armored vehicles',
    },
    {
      name: '12 FAM 380',
      text: 'US State Dept. armored vehicle (LAV/HAV) program for Levels C, D, & E',
    },
  ];

  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  return (
    <div className={`${styles.ballistic_bottom}`}>
      <BallisticChartBottomHeading bulletPoster={props.bulletPoster} />

      <div className={`${styles.ballistic_bottom_main}`}>
        <div className={`${styles.ballistic_bottom_main_item}`}>
          <h2 className={`${styles.ballistic_bottom_main_title}`}>
            {lang.linksToBallisticStandards}
          </h2>
          <ul className={`${styles.ballistic_bottom_main_list}`}>
            {props?.BallisticStandards?.map((item, index) => (
              <li
                className={`${styles.ballistic_bottom_main_list_item}`}
                key={index}
                onClick={() => togglePDFPopup(item?.pdf?.data?.attributes)}
              >
                <span className={`${styles.ballistic_bottom_main_list_level}`}>
                  <strong>{item.label}</strong>
                </span>
                <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                  {item.name}
                  {item.text2 && (
                    <>
                      <br />
                      <small>
                        {lang.protectionLevelsForOccupantsOfLogisticAndLight}
                      </small>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.ballistic_bottom_main_item}`}>
          <h2 className={`${styles.ballistic_bottom_main_title}`}>
            {lang.projectileAcronyms}
          </h2>
          <ul className={`${styles.ballistic_bottom_main_list}`}>
            {projectileAcronyms.map((item, index) => (
              <li
                className={`${styles.ballistic_bottom_main_list_item}`}
                key={index}
              >
                <span className={`${styles.ballistic_bottom_main_list_level}`}>
                  <strong>{item.name}</strong>
                </span>
                <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.ballistic_bottom_main_item}`}>
          <h2 className={`${styles.ballistic_bottom_main_title}`}>
            {lang.otherAcronyms}
          </h2>
          <ul className={`${styles.ballistic_bottom_main_list}`}>
            {otherAcronyms.map((item, index) => (
              <li
                className={`${styles.ballistic_bottom_main_list_item}`}
                key={index}
              >
                <span className={`${styles.ballistic_bottom_main_list_level}`}>
                  <strong>{item.name}</strong>
                </span>
                <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`${styles.ballistic_bottom_ammunition}`}
        onClick={() => togglePDFPopup(props.ammunitionChartPDF)}
      >
        <span className={`${styles.text} text-cta-regular`}>
          {lang.ammunitionChart}
        </span>
        <div className={`${styles.icon}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="none"
            viewBox="0 0 20 20"
          >
            <circle cx="10" cy="10" r="8" stroke="currentColor"></circle>
            <path
              stroke="currentColor"
              d="M7.714 12.286 12 8m0 0H7m5 0v5"
            ></path>
          </svg>
        </div>
      </div>

      <PopupPDF
        isOpen={isPDFPopupOpen}
        onClose={() => togglePDFPopup('')}
        pdfUrl={currentPdfUrl}
      />
    </div>
  );
};

export default BallisticChartBottom;
