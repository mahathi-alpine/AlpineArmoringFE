import styles from './BallisticChart.module.scss';
import Image from 'next/image';

const BallisticChart = () => {
  const items = [
    {
      name: ['.38 Special '],
      caliber: ['9 x 29mmR'],
      class: ['Revolver'],
      stanag: '-',
      ul: '1',
      level: ['1'],
      nij: 'HG1',
      cen: 'BR1',
      weight: ['125 grains', '8.09 grams'],
      type: ['FMJ'],
      velocity: ['1,075 ft/s (328 m/s)'],
    },
    {
      name: ['9mm Luger'],
      caliber: ['9 x 19mm'],
      class: ['Handgun'],
      stanag: '-',
      ul: '1',
      level: ['2'],
      nij: 'HG1',
      cen: 'BR2',
      weight: ['124 grains', '15.55 grams'],
      type: ['FMJ /RN'],
      velocity: ['1,075 ft/s (328 m/s)'],
    },
    {
      name: ['.357 Magnum'],
      caliber: ['9 x 33mmR'],
      class: ['Revolver'],
      stanag: '-',
      ul: '2',
      level: ['3'],
      nij: 'HG1',
      cen: 'BR3',
      weight: ['158 grains', '10.23 grams'],
      type: ['FMJ /JSP'],
      velocity: ['1,430 ft/s (436 m/s)'],
    },
    {
      name: ['.44 Magnum'],
      caliber: ['11 x 33mmR'],
      class: ['Revolver'],
      stanag: '-',
      ul: '3',
      level: ['4'],
      nij: 'HG2',
      cen: 'BR4',
      weight: ['240 grains', '15.55 grams'],
      type: ['JHP'],
      velocity: ['1,430 ft/s (436 m/s)'],
    },
    {
      name: ['Shotgun'],
      caliber: ['12 Gauge'],
      class: ['Shotgun'],
      stanag: '-',
      ul: '4',
      level: ['S', 'G'],
      nij: 'IIIA',
      cen: 'SG2',
      weight: ['436 grains', '28.25 grams'],
      type: ['Slug'],
      velocity: ['1,650 ft/s (503 m/s)'],
    },
    {
      name: ['300AAC Blackout'],
      caliber: ['7.62 x 35mm'],
      class: ['Carbine'],
      stanag: 'I',
      ul: '5',
      level: ['5'],
      nij: 'RF1',
      cen: 'BR4+',
      weight: ['125 grains', '8.10 grams'],
      type: ['FMJ'],
      velocity: ['2,185 ft/s (666 m/s)'],
    },
    {
      name: ['AK-47 or Kalashnikov'],
      caliber: ['7.62 x 39mm'],
      class: ['Rifle'],
      stanag: 'I',
      ul: '5',
      level: ['6'],
      nij: 'RF1',
      cen: 'BR5',
      weight: ['120 grains', '7.77 grams'],
      type: ['FMJ'],
      velocity: ['2,380 ft/s (725 m/s)'],
    },
    {
      name: ['M4/M16'],
      caliber: ['5.56 x 45mm (M193)'],
      class: ['Carbine'],
      stanag: 'I',
      ul: '5',
      level: ['7'],
      nij: 'RF1',
      cen: 'BR5',
      weight: ['56 grains', '3.63 grams'],
      type: ['FMJ/BT'],
      velocity: ['3,080 ft/s (940 m/s)'],
    },
    {
      name: ['M4/M16'],
      caliber: ['5.56 x 45mm NATO', '(SS109)'],
      class: ['Carbine'],
      stanag: 'I',
      ul: '5',
      level: ['8'],
      nij: 'RF1',
      cen: 'BR5',
      weight: ['56 grains', '3.63 grams'],
      type: ['FMJ/BT'],
      velocity: ['2,950 ft/s (900 m/s)'],
    },
    {
      name: ['Remington 700'],
      caliber: ['.308 or 7.62 x 51mm', '(M80 Ball)'],
      class: ['Rifle'],
      stanag: 'I',
      ul: '8',
      level: ['9'],
      nij: 'RF2',
      cen: 'BR6+',
      weight: ['149 grains', '9.65 grams'],
      type: ['FMJ Ball'],
      velocity: ['2,780 ft/s (847 m/s)'],
    },
    {
      name: ['AK-47', 'M4'],
      caliber: ['7.62 x 39mm API BZ', '5.56 x 45mm GT AP (M855)'],
      class: ['Rifle', 'Carbine'],
      stanag: 'II',
      ul: '9',
      level: ['10'],
      nij: 'RF2',
      cen: 'BR7',
      weight: ['122/62 grains', '7.90/4.02 grams'],
      type: ['API/PB/HC', 'GT/AP/BT'],
      velocity: ['2,395 ft/s (730 m/s)', '3,020 ft/s (920 m/s)'],
    },
    {
      name: ['M1 Garand', 'Remington 700', 'Dragunov'],
      caliber: ['7.62 x 63 M2 AP', '7.62 x 51 NATO AP', '7.62 x 54mmR API'],
      class: ['Rifle', 'Sniper Rifle', 'Sniper Rifle'],
      stanag: 'III',
      ul: '9',
      level: ['11'],
      nij: 'RF3',
      cen: 'BR7',
      weight: ['165/151/154', 'grains', '10.69/9.78/9.98', 'grams'],
      type: ['FMJ/PB/HC', 'FMJ/PB/HC/WC', 'API/PB/HC'],
      velocity: [
        '2,880 ft/s (878 m/s)',
        '2,690 ft/s (820 m/s)',
        '2,820 ft/s (860 m/s)',
      ],
    },
    {
      name: ['Barrett'],
      caliber: ['.50 BMG (12.7 x 99mm)'],
      class: ['Rifle'],
      stanag: 'I',
      ul: '5',
      level: ['12'],
      nij: 'N/A',
      cen: 'BR7+',
      weight: ['661 grains', '42.83 grams'],
      type: ['FMJ/Ball'],
      velocity: ['3,080 ft/s (940 m/s)'],
    },
  ];

  return (
    <>
      <div className={`${styles.ballistic}`}>
        <div className={`${styles.ballistic_wrapper}`}>
          <div className={`${styles.ballistic_header}`}>
            <div className={`${styles.ballistic_header_inner}`}>
              <div className={`${styles.ballistic_header_item}`}>
                <Image
                  src="/assets/ballistic/ballistic_logo_mobile.png"
                  alt=""
                  width="140"
                  height="64"
                  className="untilLarge-only"
                ></Image>
                <Image
                  src="/assets/ballistic/ballistic_logo.png"
                  alt=""
                  width="80"
                  height="122"
                  className="large-only"
                ></Image>
              </div>
              <div className={`${styles.ballistic_header_item}`}>
                <Image
                  src="/assets/ballistic/heading_weapon_mobile.png"
                  alt=""
                  width="243"
                  height="64"
                  className="untilLarge-only"
                ></Image>
                <Image
                  src="/assets/ballistic/heading_weapon.png"
                  alt=""
                  width="230"
                  height="50"
                  className="large-only"
                ></Image>
              </div>
              <div className={`${styles.ballistic_header_item}`}>
                <Image
                  src="/assets/ballistic/heading_levels_mobile.png"
                  alt=""
                  width="227"
                  height="64"
                  className="untilLarge-only"
                ></Image>
                <Image
                  src="/assets/ballistic/heading_levels.png"
                  alt=""
                  width="353"
                  height="143"
                  className="large-only"
                ></Image>
              </div>
              <div className={`${styles.ballistic_header_item}`}>
                <Image
                  src="/assets/ballistic/heading_projectile_mobile.png"
                  alt=""
                  width="303"
                  height="92"
                  className="untilLarge-only"
                ></Image>
                <Image
                  src="/assets/ballistic/heading_projectile.png"
                  alt=""
                  width="379"
                  height="135"
                  className="large-only"
                ></Image>
              </div>
              <div className={`${styles.ballistic_header_item}`}>
                <Image
                  src="/assets/ballistic/heading_best.png"
                  alt=""
                  width="140"
                  height="78"
                ></Image>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr className={`${styles.ballistic_row_navigation}`}>
                <th className={`${styles.ballistic_row_item}`}></th>
                <th className={`${styles.ballistic_row_item}`}>Name</th>
                <th className={`${styles.ballistic_row_item}`}>Caliber</th>
                <th className={`${styles.ballistic_row_item}`}>Class</th>
                <th className={`${styles.ballistic_row_item}`}>Stanag</th>
                <th className={`${styles.ballistic_row_item}`}>UL</th>
                <th className={`${styles.ballistic_row_item}`}>Alpine</th>
                <th className={`${styles.ballistic_row_item}`}>Nij</th>
                <th className={`${styles.ballistic_row_item}`}>Cen</th>
                <th className={`${styles.ballistic_row_item}`}>
                  <span>
                    Weight
                    <span>
                      <small>+</small>
                      <small>-</small>
                    </span>
                  </span>
                </th>
                <th className={`${styles.ballistic_row_item}`}>Type</th>
                <th className={`${styles.ballistic_row_item}`}>
                  <span>
                    Velocity
                    <span>
                      <small>+</small>
                      <small>-</small>
                    </span>
                  </span>
                </th>
                <th className={`${styles.ballistic_row_item}`}>Compare</th>
                <th className={`${styles.ballistic_row_item}`}></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr className={`${styles.ballistic_row}`} key={index}>
                  <td className={`${styles.ballistic_row_item}`}>
                    <div
                      key={index}
                      className={`${styles.ballistic_weaponImg}`}
                    >
                      <img
                        src={`/assets/ballistic/weapon_A${item.level[0]}.png`}
                        alt=""
                        width="264"
                        height="71"
                      />
                    </div>
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    {item.name.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${styles.ballistic_row_item_text} ${
                          item.name.length > 1
                            ? styles.ballistic_row_item_text_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    {item.caliber.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${styles.ballistic_row_item_text} ${
                          item.caliber.length > 1
                            ? styles.ballistic_row_item_text_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    {item.class.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${styles.ballistic_row_item_text} ${
                          item.class.length > 1
                            ? styles.ballistic_row_item_text_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    <span
                      data-text={item.stanag}
                      className={`${styles.ballistic_row_item_text}`}
                    >
                      {item.stanag}
                    </span>
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    <span
                      data-text={item.ul}
                      className={`${styles.ballistic_row_item_text}`}
                    >
                      {item.ul}
                    </span>
                  </td>

                  <td
                    className={`
                                    ${styles.ballistic_row_item} 
                                    ${styles.ballistic_row_item_level}
                                    ${
                                      item.level.length > 1
                                        ? styles.ballistic_row_item_level_small
                                        : ''
                                    }
                                `}
                  >
                    <span
                      data-text="A"
                      className={`${styles.ballistic_row_item_text}`}
                    >
                      A
                    </span>
                    {item.level.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${styles.ballistic_row_item_text}`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    <span
                      data-text={item.nij}
                      className={`${styles.ballistic_row_item_text}`}
                    >
                      {item.nij}
                    </span>
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    <span
                      data-text={item.cen}
                      className={`${styles.ballistic_row_item_text}`}
                    >
                      {item.cen}
                    </span>
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    {item.weight.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${styles.ballistic_row_item_text} ${
                          item.weight.length > 1
                            ? styles.ballistic_row_item_text_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    {item.type.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${styles.ballistic_row_item_text} ${
                          item.type.length > 1
                            ? styles.ballistic_row_item_text_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    {item.velocity.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${styles.ballistic_row_item_text}`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </td>

                  <td className={`${styles.ballistic_row_item}`}>
                    <div className={`${styles.ballistic_compare_button}`}></div>
                  </td>

                  <td
                    className={`${styles.ballistic_row_item} ${styles.ballistic_bullets}`}
                  >
                    <img
                      src={`/assets/ballistic/bullet${index + 1}.png`}
                      alt=""
                      width="232"
                      height="56"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BallisticChart;
