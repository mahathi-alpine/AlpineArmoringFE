import styles from './BallisticChartBottom.module.scss';
import BallisticChartBottomHeading from './BallisticChartBottomHeading';
import { useState } from 'react';

import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

const BallisticChartBottom = () => {
  const ballisticStandards = [
    {
      name: 'NIJ',
      text: 'National Institute of Justice (0101.07/0123.00)',
      pdf: '0-NIJ-National-Institute-of-Justice-0101-07-0123-00-.pdf',
    },
    {
      name: 'UL',
      text: 'Underwriters Laboratories – Standards & Engagements 752',
      pdf: '2-Underwriters-Laboratories-UL-Standards-Engagements-752.pdf',
    },
    {
      name: 'CEN',
      text: 'European Committee for Standardization – BR 1063',
      pdf: '3-European-Standard-CEN-1063.pdf',
    },
    {
      name: 'DIN',
      text: 'German Institute for Standardization',
      pdf: '4-DIN-German-Institute-for-Standardization.pdf',
    },
    {
      name: 'STANAG',
      text: 'Standardization Agreement by NATO - 4569',
      smallText:
        'Protection Levels for Occupants of Logistic and Light Armored Vehicles',
      pdf: '5-NATO-AEP-55STANAG-4569.pdf',
    },
    {
      name: 'VPAM',
      text: 'Association of Testing Centers for Attack-Resistant Materials and Constructions',
      pdf: '6-VPAM-Plate-Materials.pdf',
    },
    {
      name: 'OTHER',
      text: 'Internationally Recognized Ballistic Testing Standards (for reference)',
      pdf: '7-Other-common-Protection-Standards-table.pdf',
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

  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

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
                  onClick={() =>
                    togglePDFPopup(`/assets/ballistic/${item.pdf}`)
                  }
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

      <div
        className={`${styles.ballistic_bottom_ammunition}`}
        onClick={() =>
          togglePDFPopup('/assets/ballistic/Ammunition Chart for Refernece.pdf')
        }
      >
        Ammunition Chart
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
