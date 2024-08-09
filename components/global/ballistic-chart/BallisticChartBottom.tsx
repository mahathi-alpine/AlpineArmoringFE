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

      <div className={`${styles.ballistic_bottom_main}`}>
        <div className={`${styles.ballistic_bottom_main_item}`}>
          <h2 className={`${styles.ballistic_bottom_main_title}`}>
            LINKS TO BALLISTIC STANDARDS
          </h2>
          <ul className={`${styles.ballistic_bottom_main_list}`}>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                Nij
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                National Institute of Justice (0101.07/0123.00)
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                UL
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Underwriters Laboratories – Standards & Engagements 752
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                CEN
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                European Committee for Standardization – BR 1063
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                DIN
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                German Institute for Standardization
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                sTANAG
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Standardization Agreement by NATO - 4569
                <br />
                <small>
                  Protection Levels for Occupants of Logistic and Light Armored
                  Vehicles
                </small>
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                VPAM
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Association of Testing Centers for Attack-Resistant Materials
                and Constructions
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                OTHER
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Internationally Recognized Ballistic Testing Standards (for
                reference)
              </span>
            </li>
          </ul>
        </div>

        <div className={`${styles.ballistic_bottom_main_item}`}>
          <h2 className={`${styles.ballistic_bottom_main_title}`}>
            PROJECTILE ACRONYMS
          </h2>
          <ul className={`${styles.ballistic_bottom_main_list}`}>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>AP</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Armor Piercing
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>API</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Armor Piercing Incendiary
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>FMJ</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Full Metal Jacket
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>JHP</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Jacketed Hollow Point
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>JSP</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Jacketed Soft Point
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>RN</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Round Nose
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>GT</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Green Tip AP
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>PB</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Pointed Bullet
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>BT</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Boattail Bullet
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>HC</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Hard Core
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>WC</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Wadcutter
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>LC</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Lead Core
              </span>
            </li>
            <li className={`${styles.ballistic_bottom_main_list_item}`}>
              <span className={`${styles.ballistic_bottom_main_list_level}`}>
                <strong>BZ</strong>
              </span>
              <span className={`${styles.ballistic_bottom_main_list_pdf}`}>
                Brillouin Zone
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BallisticChartBottom;
