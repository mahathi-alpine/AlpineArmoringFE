import styles from './BallisticChartBottom.module.scss';
import BallisticChartBottomHeading from './BallisticChartBottomHeading';
import { useState, useEffect, useRef } from 'react';

import useLightbox from '../lightbox/useLightbox';
import 'yet-another-react-lightbox/styles.css';
import pdfViewer from '../lightbox/pdfViewer';

import PdfViewer from 'components/global/lightbox/PdfViewer2';

const BallisticChartBottom = () => {
  const ballisticStandards = [
    {
      name: 'NIJ',
      text: 'National Institute of Justice (0101.07/0123.00)',
      url: '19rObIeih67-cJvBEfGQncN0f91XCTquV',
      height: 560,
    },
    {
      name: 'UL',
      text: 'Underwriters Laboratories – Standards & Engagements 752',
      url: '18cJkbVt1HTsXGJnz4TosYo9X0RUUYlU9',
      height: 706,
    },
    {
      name: 'CEN',
      text: 'European Committee for Standardization – BR 1063',
      url: '18cv4OJWT7jMh5fCFNki6aB3XQ-whwBq0',
      height: 495,
    },
    {
      name: 'DIN',
      text: 'German Institute for Standardization',
      url: '18dFPahm2n-93fu_Q0etg0GEbYVngvULn',
      height: 495,
    },
    {
      name: 'STANAG',
      text: 'Standardization Agreement by NATO - 4569',
      smallText:
        'Protection Levels for Occupants of Logistic and Light Armored Vehicles',
      url: '18fZmfyArn0l1doYRinPLxqJyrqOMUKeO',
      height: 523,
    },
    {
      name: 'VPAM',
      text: 'Association of Testing Centers for Attack-Resistant Materials and Constructions',
      url: '18i41IlKUMbTbXVFjbGZngPTmQOa3zPa1',
      height: 283,
    },
    {
      name: 'OTHER',
      text: 'Internationally Recognized Ballistic Testing Standards (for reference)',
      url: '18gpmBavwGIfHaRLPzre0GbsWr_86NS8F',
      height: 1059,
    },
  ];

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

  const { openLightbox, renderLightbox } = useLightbox();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const ammunitionChart = {
    url: '11XePOW4takkdN-2s0vymRRo42gaKsYf-',
    height: 474,
  };

  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);

  const togglePDFPopup = () => {
    setPDFPopupOpen(!isPDFPopupOpen);

    if (!isPDFPopupOpen) {
      document.body.style.marginRight =
        window.innerWidth - document.body.offsetWidth + 'px';
      document.body.classList.add('no-scroll');
    } else {
      document.body.style.marginRight = '0';
      document.body.classList.remove('no-scroll');
    }
  };

  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = () => {
      if (
        popupRef.current &&
        popupRef.current.classList.contains('modal_active')
      ) {
        setPDFPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${styles.ballistic_bottom}`}>
      <BallisticChartBottomHeading />

      <div className={`${styles.ballistic_bottom_main}`}>
        <div className={`${styles.ballistic_bottom_main_item}`}>
          <h2 className={`${styles.ballistic_bottom_main_title}`}>
            LINKS TO BALLISTIC STANDARDS
          </h2>
          <ul className={`${styles.ballistic_bottom_main_list}`}>
            {ballisticStandards.map((item, index) => (
              <li
                className={`${styles.ballistic_bottom_main_list_item}`}
                key={index}
              >
                <span
                  className={`${styles.ballistic_bottom_main_list_level}`}
                  onClick={() => {
                    if (item.url) {
                      setSelectedIndex(index);
                      openLightbox();
                    }
                  }}
                >
                  <strong>{item.name}</strong>
                </span>
                <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                  {item.text}
                  {item.smallText && (
                    <>
                      <br />
                      <small>
                        Protection Levels for Occupants of Logistic and Light
                        Armored Vehicles
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
            PROJECTILE ACRONYMS
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
            OTHER ACRONYMS
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

      {renderLightbox({
        slides: [
          {
            src:
              selectedIndex !== null
                ? ballisticStandards[selectedIndex]?.url
                : ammunitionChart.url,
            height:
              selectedIndex !== null
                ? ballisticStandards[selectedIndex]?.height
                : ammunitionChart.height,
          },
        ],
        className: 'pdfLightbox',
        render: {
          slide: pdfViewer,
          buttonPrev: () => null,
          buttonNext: () => null,
        },
      })}

      <div
        className={`${styles.ballistic_bottom_ammunition}`}
        onClick={() => {
          setSelectedIndex(null);
          openLightbox();
        }}
      >
        Ammunition Chart
      </div>

      <div
        className={`${styles.ballistic_bottom_ammunition}`}
        onClick={togglePDFPopup}
      >
        TEST PDF POPUP
      </div>

      {isPDFPopupOpen && (
        <div
          ref={popupRef}
          className={`modal modal_pdf ${isPDFPopupOpen ? 'modal_active' : ''}`}
          onClick={togglePDFPopup}
        >
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <PdfViewer pdfUrl="/assets/pdf1.pdf" />
            <button className={`modal_close`} onClick={togglePDFPopup}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                focusable="false"
              >
                <g fill="currentColor">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    fill="#fff"
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BallisticChartBottom;
