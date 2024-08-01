import styles from './BallisticChart.module.scss';

const BallisticChart = () => {
  const items2 = [
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

  const items = [
    {
      name: 'weapon',
      columns: [
        {
          name: 'Name',
          items: [
            {
              list: ['.38 Special'],
            },
            {
              list: ['9mm Luger'],
            },
            {
              list: ['.357 Magnum'],
            },
            {
              list: ['.44 Magnum'],
            },
            {
              list: ['Shotgun'],
            },
            {
              list: ['300AAC Blackout'],
            },
            {
              list: ['AK-47 or Kalashnikov'],
            },
            {
              list: ['M4/M16'],
            },
            {
              list: ['M4/M16'],
            },
            {
              list: ['Remington 700'],
            },
            {
              list: ['AK-47', 'M4'],
              size: 'small',
            },
            {
              list: ['M1 Garand', 'Remington 700', 'Dragunov'],
              size: 'small',
            },
            {
              list: ['Barrett'],
            },
          ],
        },
        {
          name: 'Caliber',
          items: [
            {
              list: ['9 x 29mmR'],
            },
            {
              list: ['9 x 19mm'],
            },
            {
              list: ['9 x 33mmR'],
            },
            {
              list: ['11 x 33mmR'],
            },
            {
              list: ['12 Gauge'],
            },
            {
              list: ['7.62 x 35mm'],
            },
            {
              list: ['7.62 x 39mm'],
            },
            {
              list: ['5.56 x 45mm (M193)'],
            },
            {
              list: ['5.56 x 45mm NATO', '(SS109)'],
              size: 'small',
            },
            {
              list: ['.308 or 7.62 x 51mm', '(M80 Ball)'],
              size: 'small',
            },
            {
              list: ['7.62 x 39mm API BZ', '5.56 x 45mm GT AP (M855)'],
              size: 'small',
            },
            {
              list: [
                '7.62 x 63 M2 AP',
                '7.62 x 51 NATO AP',
                '7.62 x 54mmR API',
              ],
              size: 'small',
            },
            {
              list: ['.50 BMG (12.7 x 99mm)'],
            },
          ],
        },
        {
          name: 'Class',
          items: [
            {
              list: ['Revolver'],
            },
            {
              list: ['Handgun'],
            },
            {
              list: ['Revolver'],
            },
            {
              list: ['Revolver'],
            },
            {
              list: ['Shotgun'],
            },
            {
              list: ['Carbine'],
            },
            {
              list: ['Rifle'],
            },
            {
              list: ['Carbine'],
            },
            {
              list: ['Carbine'],
            },
            {
              list: ['Rifle'],
            },
            {
              list: ['Rifle', 'Carbine'],
              size: 'small',
            },
            {
              list: ['Rifle', 'Sniper Rifle', 'Sniper Rifle'],
              size: 'small',
            },
            {
              list: ['Rifle'],
            },
          ],
        },
      ],
    },
    {
      name: 'levels',
      columns: [
        {
          name: 'Stanag',
          items: [
            {
              list: ['-'],
            },
            {
              list: ['-'],
            },
            {
              list: ['-'],
            },
            {
              list: ['-'],
            },
            {
              list: ['-'],
            },
            {
              list: ['I'],
            },
            {
              list: ['I'],
            },
            {
              list: ['I'],
            },
            {
              list: ['I'],
            },
            {
              list: ['I'],
            },
            {
              list: ['II'],
            },
            {
              list: ['III'],
            },
            {
              list: ['I'],
            },
          ],
        },
        {
          name: 'UL',
          items: [
            {
              list: ['1'],
            },
            {
              list: ['1'],
            },
            {
              list: ['2'],
            },
            {
              list: ['3'],
            },
            {
              list: ['4'],
            },
            {
              list: ['5'],
            },
            {
              list: ['5'],
            },
            {
              list: ['5'],
            },
            {
              list: ['5'],
            },
            {
              list: ['8'],
            },
            {
              list: ['9'],
            },
            {
              list: ['9'],
            },
            {
              list: ['5'],
            },
          ],
        },
        {
          name: 'Alpine',
          items: [
            {
              list: ['A1'],
            },
            {
              list: ['A2'],
            },
            {
              list: ['A3'],
            },
            {
              list: ['A4'],
            },
            {
              list: ['A', 'S', 'G'],
              size: 'small',
            },
            {
              list: ['A5'],
            },
            {
              list: ['A6'],
            },
            {
              list: ['A7'],
            },
            {
              list: ['A8'],
            },
            {
              list: ['A9'],
            },
            {
              list: ['A10'],
            },
            {
              list: ['A11'],
            },
            {
              list: ['A12'],
            },
          ],
        },
        {
          name: 'NIJ',
          items: [
            {
              list: ['HG1'],
            },
            {
              list: ['HG1'],
            },
            {
              list: ['HG1'],
            },
            {
              list: ['HG2'],
            },
            {
              list: ['IIIA'],
            },
            {
              list: ['RF1'],
            },
            {
              list: ['RF1'],
            },
            {
              list: ['RF1'],
            },
            {
              list: ['RF1'],
            },
            {
              list: ['RF2'],
            },
            {
              list: ['RF2'],
            },
            {
              list: ['RF3'],
            },
            {
              list: ['N/A'],
            },
          ],
        },
        {
          name: 'CEN',
          items: [
            {
              list: ['BR1'],
            },
            {
              list: ['BR2'],
            },
            {
              list: ['BR3'],
            },
            {
              list: ['BR4'],
            },
            {
              list: ['SG2'],
            },
            {
              list: ['BR4+'],
            },
            {
              list: ['BR5'],
            },
            {
              list: ['BR5'],
            },
            {
              list: ['BR5'],
            },
            {
              list: ['BR6+'],
            },
            {
              list: ['BR7'],
            },
            {
              list: ['BR7'],
            },
            {
              list: ['BR7+'],
            },
          ],
        },
      ],
    },
  ];

  const imagePaths = Array.from(
    { length: 13 },
    (_, i) => `/assets/ballistic/weapon_A${i + 1}.png`
  );

  return (
    <>
      <div className={`${styles.ballistic}`}>
        <div className={`${styles.ballistic_wrapper}`}>
          <div className={`${styles.ballistic_row_header}`}>
            <div className={`${styles.ballistic_row_item}`}>
              <img
                src="/assets/ballistic/ballistic_logo.png"
                alt=""
                height="122"
                width="80"
              />
            </div>
            <div className={`${styles.ballistic_row_item}`}>
              <img
                src={`/assets/ballistic/heading_weapon.png`}
                width="200"
                alt=""
              />
            </div>
            <div className={`${styles.ballistic_row_item}`}>
              <img
                src={`/assets/ballistic/heading_levels.png`}
                width="200"
                alt=""
              />
            </div>
            <div className={`${styles.ballistic_row_item}`}>
              <img
                src={`/assets/ballistic/heading_projectile.png`}
                width="200"
                alt=""
              />
            </div>
            <div className={`${styles.ballistic_row_item}`}>
              <img
                src={`/assets/ballistic/heading_best.png`}
                width="200"
                alt=""
              />
            </div>
          </div>

          <table>
            <thead>
              {/* <tr className={`${styles.ballistic_row_header}`}>
                            <th className={`${styles.ballistic_row_item}`}>
                                <img
                                    src="/assets/ballistic/ballistic_logo.png"
                                    alt=""
                                    height="122"
                                    width="80"
                                />
                            </th>
                            <th className={`${styles.ballistic_row_item}`}>
                                <img
                                    src={`/assets/ballistic/heading_weapon.png`}
                                    width="200"
                                    alt=""
                                />
                            </th>
                            <th className={`${styles.ballistic_row_item}`}>
                                <img
                                    src={`/assets/ballistic/heading_levels.png`}
                                    width="200"
                                    alt=""
                                />
                            </th>
                            <th className={`${styles.ballistic_row_item}`}>
                                <img
                                    src={`/assets/ballistic/heading_projectile.png`}
                                    width="200"
                                    alt=""
                                />
                            </th>
                            <th className={`${styles.ballistic_row_item}`}>
                                <img
                                    src={`/assets/ballistic/heading_best.png`}
                                    width="200"
                                    alt=""
                                />
                            </th>
                        </tr> */}
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
              {items2.map((item, index) => (
                <tr className={`${styles.ballistic_row}`} key={index}>
                  <td className={`${styles.ballistic_row_item}`}>
                    <div
                      key={index}
                      className={`${styles.ballistic_weaponImg}`}
                    >
                      <img
                        src={`/assets/ballistic/weapon_A${item.level[0]}.png`}
                        alt=""
                        width="240"
                        height="47"
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

                  <td>
                    <div className={`${styles.ballistic_compare_button}`}></div>
                  </td>

                  <td className={`${styles.ballistic_bullets}`}>
                    <img
                      src={`/assets/ballistic/bullet${index + 1}.png`}
                      alt=""
                      width="207"
                      height="47"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${styles.ballistic}`}>
        <div className={`${styles.ballistic_wrapper}`}>
          <div
            className={`${styles.ballistic_column} ${styles.ballistic_column_logo}`}
          >
            <div className={`${styles.ballistic_heading}`}>
              <img
                src="/assets/ballistic/ballistic_logo.png"
                alt=""
                height="122"
                width="80"
              />
            </div>

            <div className={`${styles.ballistic_column_items}`}>
              <div className={`${styles.ballistic_column_items_column}`}>
                {imagePaths.map((path, index) => (
                  <div
                    key={index}
                    className={`${styles.ballistic_column_logo_weaponImg}`}
                  >
                    <img src={path} alt="" width="240" height="47" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className={`${styles.ballistic_column} ${
                styles[`ballistic_column_${item.name}`]
              }`}
            >
              <div className={`${styles.ballistic_heading}`}>
                <img
                  src={`/assets/ballistic/heading_${item.name}.png`}
                  width="200"
                  alt=""
                />
              </div>

              <div className={`${styles.ballistic_column_items}`}>
                {Object.prototype.hasOwnProperty.call(item, 'columns') &&
                  item.columns.map((column, columnIndex) => (
                    <ul
                      key={columnIndex}
                      className={`${styles.ballistic_column_items_column}`}
                    >
                      <li className={`${styles.ballistic_column_heading}`}>
                        {column.name}
                      </li>
                      {column.items.map((columnItem, listItemIndex) => (
                        <li
                          key={listItemIndex}
                          className={`${styles.ballistic_column_item_wrap}`}
                        >
                          {columnItem.list.map((listItem, spanIndex) => (
                            <span
                              key={spanIndex}
                              data-text={listItem}
                              className={`${styles.ballistic_column_item} ${
                                columnItem.size === 'small'
                                  ? styles.ballistic_column_item_small
                                  : ''
                              }`}
                            >
                              {listItem}
                            </span>
                          ))}
                        </li>
                      ))}
                    </ul>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BallisticChart;
