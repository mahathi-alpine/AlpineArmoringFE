import styles from './Ballistic.module.scss';

function BallisticTesting() {
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
    (_, i) => `/assets/ballistic/weapon_${i + 1}.png`
  );

  return (
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
  );
}

export default BallisticTesting;
