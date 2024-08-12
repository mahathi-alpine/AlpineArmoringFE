import styles from './BallisticChartBottom.module.scss';
import BallisticChartBottomHeading from './BallisticChartBottomHeading';
import { useState } from 'react';

import useLightbox from '../lightbox/useLightbox';
import 'yet-another-react-lightbox/styles.css';
import pdfViewer from '../lightbox/pdfViewer';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
// import { Lightbox } from 'yet-another-react-lightbox';

const BallisticChartBottom = () => {
  const ballisticStandards = [
    {
      name: 'NIJ',
      text: 'National Institute of Justice (0101.07/0123.00)',
    },
    {
      name: 'UL',
      text: 'Underwriters Laboratories – Standards & Engagements 752',
    },
    {
      name: 'CEN',
      text: 'European Committee for Standardization – BR 1063',
    },
    {
      name: 'DIN',
      text: 'German Institute for Standardization',
    },
    {
      name: 'STANAG',
      text: 'Standardization Agreement by NATO - 4569',
      smallText:
        'Protection Levels for Occupants of Logistic and Light Armored Vehicles',
    },
    {
      name: 'VPAM',
      text: 'Association of Testing Centers for Attack-Resistant Materials and Constructions',
    },
    {
      name: 'OTHER',
      text: 'Internationally Recognized Ballistic Testing Standards (for reference)',
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

  const slides = [
    {
      src: '18glK6RvY-0itVOh0Se__v2P3Z5eXCjiZ',
      width: 830,
      height: 560,
    },
    {
      src: '1XpoiHTetYIXT2PFUcHiC5rGH9nHUgZUh',
      width: 300,
      height: 300,
    },
  ];
  // const [isOpen, setIsOpen] = useState(false);

  // const openLightbox = () => {
  //   setIsOpen(true);
  // };

  // const closeLightbox = () => {
  //   setIsOpen(false);
  // };

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
                    setSelectedIndex(index);
                    openLightbox();
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

      {/* <Lightbox
        open={isOpen}
        close={closeLightbox}
        slides={slides}
        render={{
          slide: ({ slide }) =>            
            <iframe
              width="100%"
              height="600px"
              src={`${slide?.src}#toolbar=0`}
              style={{ border: 'none' }}
            />
        }}
      /> */}

      {renderLightbox({
        slides: slides.map((item) => ({
          src: item.src,
          width: item.width,
          height: item.height,
        })),
        plugins: [Zoom],
        render: {
          // slide: ({ slide }) => {
          // <iframe
          //   src={`https://docs.google.com/viewer?url=${slide.src}.pdf&embedded=true`}
          //   width={`${slide.width}`}
          //   height={`${slide.height}`}
          // />,
          // <object
          //   data={`https://drive.google.com/file/d/${slide.src}/preview?usp=sharing`}
          //   type="application/pdf"
          //   style={{width: `${slide.width}px`, height: `${slide.height}px`, maxWidth: '100%'}}
          // >
          //   <embed
          //     src={`https://drive.google.com/file/d/${slide.src}/preview?usp=sharing`}
          //     style={{width: `${slide.width}px`, height: `${slide.height}px`, maxWidth: '100%'}}
          //   />
          // </object>},
          slide: pdfViewer,
          buttonPrev: () => null,
          buttonNext: () => null,
        },
        index: selectedIndex,
      })}
    </div>
  );
};

export default BallisticChartBottom;
