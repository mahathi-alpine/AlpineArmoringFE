import styles from './BallisticChart.module.scss';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
// import { debounce } from 'lodash';

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
      typeFull: ['Full Metal Jacket'],
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
      typeFull: ['Full Metal Jacket'],
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
      stanag: '-',
      ul: '10+',
      level: ['12'],
      nij: 'N/A',
      cen: 'BR7+',
      weight: ['661 grains', '42.83 grams'],
      type: ['FMJ/Ball'],
      velocity: ['3,080 ft/s (940 m/s)'],
    },
  ];

  const [selectedRows, setSelectedRows] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showChosen, setShowChosen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [moreSelected, setMoreSelected] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const scrollAreaRef = useRef(null);
  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const headerRef = useRef(null);
  const interactedPopupRef = useRef(null);

  const setRowActive = (index) => {
    const currentSelectedRows = [...selectedRows];
    const currentSelectedLevels = [...selectedLevels];

    const row = tableRef.current.children[index];

    const isActive = row.classList.contains(styles.ballistic_row_active);

    if (isActive) {
      row.classList.remove(styles.ballistic_row_active);

      if (
        document.querySelectorAll(`.${styles.ballistic_row_active}`).length < 1
      ) {
        containerRef.current.classList.remove(
          styles.ballistic_comparisonActive
        );

        const compareButtons = document.querySelectorAll(
          `.${styles.ballistic_compare_view}`
        );

        compareButtons.forEach((element) => {
          element.querySelector('span').textContent = 'View';
          element.classList.remove(styles.ballistic_compare_view_active);
        });
      }

      if (window.innerWidth < 1280) {
        const rowIndex = currentSelectedRows.indexOf(index);
        currentSelectedRows.splice(rowIndex, 1);
        currentSelectedLevels.splice(rowIndex, 1);
        setMoreSelected(false);
      }
    } else if (currentSelectedRows.length < 2) {
      row.classList.add(styles.ballistic_row_active);
      if (window.innerWidth < 1280) {
        currentSelectedRows.push(index);
        currentSelectedLevels.push(items[index].level[0]);
        setShowPopup(true);
      }
    } else {
      if (window.innerWidth < 1280) {
        setShowPopup(true);
        setMoreSelected(true);
      }
    }

    if (window.innerWidth < 1280) {
      setSelectedRows(currentSelectedRows);
      setSelectedLevels(currentSelectedLevels);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const showChosenItems = () => {
    if (selectedRows.length === 2) {
      setShowChosen(true);
    }
  };

  const closePopupComparison = () => {
    setShowPopup(false);
    setShowChosen(false);
    // setSelectedRows([]);
    // document.querySelector('tbody tr').classList.remove(styles.ballistic_row_active);
  };

  const showComparisonDesktop = (index, button) => {
    if (window.innerWidth >= 1280) {
      containerRef.current.classList.add(styles.ballistic_comparisonActive);

      const compareButtons = document.querySelectorAll(
        `.${styles.ballistic_compare_view}`
      );

      if (button.classList.contains(styles.ballistic_compare_view_active)) {
        tableRef.current.children[index].classList.remove(
          styles.ballistic_row_active
        );
        button.classList.remove(styles.ballistic_compare_view_active);
        button.querySelector('span').textContent = 'View';

        if (
          document.querySelectorAll(`.${styles.ballistic_row_active}`).length <
          1
        ) {
          containerRef.current.classList.remove(
            styles.ballistic_comparisonActive
          );

          compareButtons.forEach((element) => {
            element.querySelector('span').textContent = 'View';
          });
        }
      } else {
        compareButtons.forEach((element) => {
          element.classList.add(styles.ballistic_compare_view_active);
          element.querySelector('span').textContent = 'Close';
        });
      }
    }
  };

  const handleScrollAreaScroll = () => {
    if (scrollAreaRef.current && headerRef.current) {
      const scrollLeft = scrollAreaRef.current.scrollLeft;
      headerRef.current.style.transform = `translateX(-${scrollLeft}px)`;
    }
  };

  const handleWindowScroll = () => {
    if (window.pageYOffset >= 74) {
      containerRef.current.classList.add(styles.ballistic_header_active);
    } else {
      containerRef.current.classList.remove(styles.ballistic_header_active);
    }
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      } else {
        interactedPopupRef.current.classList.add(
          `${styles.ballistic_popup_interact_disable}`
        );
      }
    };

    window.addEventListener('touchstart', handleInteraction);
    // window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      // window.removeEventListener('click', handleInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (window.innerWidth < 1280) {
      window.addEventListener('scroll', handleWindowScroll);

      if (scrollAreaRef.current) {
        scrollAreaRef.current.addEventListener(
          'scroll',
          handleScrollAreaScroll
        );
      }

      return () => {
        window.removeEventListener('scroll', handleWindowScroll);

        if (scrollAreaRef.current) {
          scrollAreaRef.current.removeEventListener(
            'scroll',
            handleScrollAreaScroll
          );
        }
      };
    }
  }, []);

  return (
    <>
      <div className={`${styles.ballistic}`} ref={scrollAreaRef}>
        <div className={`${styles.ballistic_wrapper}`} ref={containerRef}>
          <div className={`${styles.ballistic_header}`} ref={headerRef}>
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
            <div className={`${styles.ballistic_navigation}`}>
              <div className={`${styles.ballistic_row_item}`}></div>
              <div className={`${styles.ballistic_row_item}`}>Name</div>
              <div className={`${styles.ballistic_row_item}`}>Caliber</div>
              <div className={`${styles.ballistic_row_item}`}>Class</div>
              <div className={`${styles.ballistic_row_item}`}>Stanag</div>
              <div className={`${styles.ballistic_row_item}`}>UL</div>
              <div className={`${styles.ballistic_row_item}`}>Alpine</div>
              <div className={`${styles.ballistic_row_item}`}>Nij</div>
              <div className={`${styles.ballistic_row_item}`}>Cen</div>
              <div className={`${styles.ballistic_row_item}`}>Weight±</div>
              <div className={`${styles.ballistic_row_item}`}>Type</div>
              <div className={`${styles.ballistic_row_item}`}>Velocity±</div>
              <div className={`${styles.ballistic_row_item}`}>Compare</div>
              <div className={`${styles.ballistic_row_item}`}></div>
            </div>
          </div>

          <div className={`${styles.ballistic_table}`} ref={tableRef}>
            {items.map((item, index) => (
              <div className={`${styles.ballistic_row}`} key={index}>
                <div className={`${styles.ballistic_row_item}`}>
                  <div key={index} className={`${styles.ballistic_weaponImg}`}>
                    <Image
                      src={`/assets/ballistic/weapon_A${item.level[0]}.png`}
                      alt=""
                      width="264"
                      height="71"
                    ></Image>
                  </div>
                </div>

                <div className={`${styles.ballistic_row_item}`}>
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
                </div>

                <div className={`${styles.ballistic_row_item}`}>
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
                </div>

                <div className={`${styles.ballistic_row_item}`}>
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
                </div>

                <div className={`${styles.ballistic_row_item}`}>
                  <span
                    data-text={item.stanag}
                    className={`${styles.ballistic_row_item_text}`}
                  >
                    {item.stanag}
                  </span>
                </div>

                <div className={`${styles.ballistic_row_item}`}>
                  <span
                    data-text={item.ul}
                    className={`${styles.ballistic_row_item_text}`}
                  >
                    {item.ul}
                  </span>
                </div>

                <div
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
                </div>

                <div className={`${styles.ballistic_row_item}`}>
                  <span
                    data-text={item.nij}
                    className={`${styles.ballistic_row_item_text}`}
                  >
                    {item.nij}
                  </span>
                </div>

                <div className={`${styles.ballistic_row_item}`}>
                  <span
                    data-text={item.cen}
                    className={`${styles.ballistic_row_item_text}`}
                  >
                    {item.cen}
                  </span>
                </div>

                <div className={`${styles.ballistic_row_item}`}>
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
                </div>

                <div className={`${styles.ballistic_row_item}`}>
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
                  {item.typeFull ? (
                    <div className={`${styles.ballistic_tooltip}`}>
                      {item.typeFull}
                    </div>
                  ) : null}
                </div>

                <div className={`${styles.ballistic_row_item}`}>
                  {item.velocity.map((listItem, spanIndex) => (
                    <span
                      key={spanIndex}
                      data-text={listItem}
                      className={`${styles.ballistic_row_item_text}`}
                    >
                      {listItem}
                    </span>
                  ))}
                </div>

                <div
                  className={`${styles.ballistic_row_item} ${styles.ballistic_compare}`}
                >
                  <div
                    className={`${styles.ballistic_compare_button}`}
                    onClick={() => setRowActive(index)}
                  >
                    <span
                      className={`${styles.ballistic_compare_button_slider}`}
                    ></span>
                  </div>
                  <button
                    className={`${styles.ballistic_compare_view}`}
                    onClick={(e) =>
                      showComparisonDesktop(index, e.currentTarget)
                    }
                  >
                    <span>View</span>
                  </button>
                </div>

                <div
                  className={`${styles.ballistic_row_item} ${styles.ballistic_bullets}`}
                >
                  <Image
                    src={`/assets/ballistic/bullet${index + 1}.png`}
                    alt=""
                    width="232"
                    height="56"
                  ></Image>
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasInteracted && (
          <div
            className={`${styles.ballistic_popup} ${
              styles.ballistic_popup_interact
            } ${hasInteracted ? styles.ballistic_popup_active : ''}`}
            ref={interactedPopupRef}
          >
            <div className={`${styles.ballistic_popup_text}`}>
              To view the entire chart, scroll horizontally and vertically
            </div>
          </div>
        )}

        {showPopup && (
          <div
            className={`${styles.ballistic_popup} ${
              showPopup ? styles.ballistic_popup_active : ''
            }`}
          >
            <div className={`${styles.ballistic_popup_text}`}>
              {selectedLevels.length > 0 && !moreSelected && (
                <div>
                  Level A{selectedLevels[selectedLevels.length - 1]}{' '}
                  successfully added to comparison list
                </div>
              )}
              {selectedLevels.length == 1 && (
                <div>Select one more level to see the comparison</div>
              )}
              {moreSelected && <div>You can compare only two levels</div>}
            </div>

            {selectedLevels.length == 2 && (
              <button
                className={`${styles.ballistic_popup_button}`}
                onClick={showChosenItems}
              >
                See list
              </button>
            )}

            <div
              className={`${styles.ballistic_popup_close}`}
              data-text="Close"
              onClick={closePopup}
            >
              Close
            </div>
          </div>
        )}

        {showChosen ? (
          <div
            className={`${styles.ballistic_choosen} ${
              showChosen ? styles.ballistic_choosen_active : ''
            }`}
          >
            <div className={`${styles.ballistic_choosen_inner}`}>
              <div className={`${styles.ballistic_choosen_heading}`}>
                <h2>Comparison</h2>
                <p>(Alpine’s Levels vs. Others)</p>
                <button
                  className={`${styles.ballistic_choosen_close}`}
                  onClick={closePopupComparison}
                >
                  X
                </button>
              </div>

              <div className={`${styles.ballistic_choosen_list}`}>
                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <Image
                      src="/assets/ballistic/ballistic_logo.png"
                      alt=""
                      width="60"
                      height="90"
                      className={`${styles.ballistic_choosen_list_left_logo}`}
                    ></Image>
                  </div>

                  <div
                    className={`
                      ${styles.ballistic_choosen_list_item} 
                      ${styles.ballistic_choosen_list_item_level}
                      ${
                        items[selectedRows[0]].level.length > 1
                          ? styles.ballistic_choosen_list_item_level_small
                          : ''
                      }`}
                  >
                    <span data-text="A">A</span>
                    {items[selectedRows[0]].level.map((listItem, spanIndex) => (
                      <span key={spanIndex} data-text={listItem}>
                        {listItem}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`
                      ${styles.ballistic_choosen_list_item} 
                      ${styles.ballistic_choosen_list_item_level}
                      ${
                        items[selectedRows[1]].level.length > 1
                          ? styles.ballistic_choosen_list_item_level_small
                          : ''
                      }`}
                  >
                    <div
                      className={`${styles.ballistic_choosen_list_item_level_inner}`}
                    >
                      <span data-text="A">A</span>
                      {items[selectedRows[1]].level.map(
                        (listItem, spanIndex) => (
                          <span key={spanIndex} data-text={listItem}>
                            {listItem}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div
                    className={`${styles.ballistic_choosen_list_left}`}
                  ></div>

                  <div
                    className={`${styles.ballistic_choosen_list_item} ${styles.ballistic_choosen_list_item_name}`}
                  >
                    <Image
                      src={`/assets/ballistic/weapon_A${
                        items[selectedRows[0]].level[0]
                      }.png`}
                      alt=""
                      width="264"
                      height="71"
                    ></Image>

                    {items[selectedRows[0]].name.map((listItem, spanIndex) => (
                      <span key={spanIndex}>{listItem}</span>
                    ))}
                  </div>

                  <div
                    className={`${styles.ballistic_choosen_list_item} ${styles.ballistic_choosen_list_item_name}`}
                  >
                    <Image
                      src={`/assets/ballistic/weapon_A${
                        items[selectedRows[1]].level[0]
                      }.png`}
                      alt=""
                      width="100"
                      height="40"
                    ></Image>

                    <span>{items[selectedRows[1]].name}</span>
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="Stanag"
                    >
                      Stanag
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    <span
                      className={`${styles.ballistic_choosen_list_item_span}`}
                      data-text={`${items[selectedRows[0]].stanag}`}
                    >
                      {items[selectedRows[0]].stanag}
                    </span>
                  </div>
                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    <span
                      className={`${styles.ballistic_choosen_list_item_span}`}
                      data-text={`${items[selectedRows[1]].stanag}`}
                    >
                      {items[selectedRows[1]].stanag}
                    </span>
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="Ul"
                    >
                      Ul
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    <span
                      className={`${styles.ballistic_choosen_list_item_span}`}
                      data-text={`${items[selectedRows[0]].ul}`}
                    >
                      {items[selectedRows[0]].ul}
                    </span>
                  </div>
                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    <span
                      className={`${styles.ballistic_choosen_list_item_span}`}
                      data-text={`${items[selectedRows[1]].ul}`}
                    >
                      {items[selectedRows[1]].ul}
                    </span>
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="nij"
                    >
                      nij
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    <span
                      className={`${styles.ballistic_choosen_list_item_span}`}
                      data-text={`${items[selectedRows[0]].nij}`}
                    >
                      {items[selectedRows[0]].nij}
                    </span>
                  </div>
                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    <span
                      className={`${styles.ballistic_choosen_list_item_span}`}
                      data-text={`${items[selectedRows[1]].nij}`}
                    >
                      {items[selectedRows[1]].nij}
                    </span>
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="cen"
                    >
                      cen
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    <span
                      className={`${styles.ballistic_choosen_list_item_span}`}
                      data-text={`${items[selectedRows[0]].cen}`}
                    >
                      {items[selectedRows[0]].cen}
                    </span>
                  </div>
                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    <span
                      className={`${styles.ballistic_choosen_list_item_span}`}
                      data-text={`${items[selectedRows[1]].cen}`}
                    >
                      {items[selectedRows[1]].cen}
                    </span>
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="caliber"
                    >
                      caliber
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[0]].caliber.map(
                      (listItem, spanIndex) => (
                        <span
                          key={spanIndex}
                          data-text={listItem}
                          className={`${
                            styles.ballistic_choosen_list_item_span
                          } ${
                            items[selectedRows[0]].caliber.length > 1
                              ? styles.ballistic_choosen_list_item_span_small
                              : ''
                          }`}
                        >
                          {listItem}
                        </span>
                      )
                    )}
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[1]].caliber.map(
                      (listItem, spanIndex) => (
                        <span
                          key={spanIndex}
                          data-text={listItem}
                          className={`${
                            styles.ballistic_choosen_list_item_span
                          } ${
                            items[selectedRows[1]].caliber.length > 1
                              ? styles.ballistic_choosen_list_item_span_small
                              : ''
                          }`}
                        >
                          {listItem}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="class"
                    >
                      class
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[0]].class.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${
                          styles.ballistic_choosen_list_item_span
                        } ${
                          items[selectedRows[0]].class.length > 1
                            ? styles.ballistic_choosen_list_item_span_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </div>
                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[1]].class.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        data-text={listItem}
                        className={`${
                          styles.ballistic_choosen_list_item_span
                        } ${
                          items[selectedRows[1]].class.length > 1
                            ? styles.ballistic_choosen_list_item_span_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="weight"
                    >
                      weight
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[0]].weight.map(
                      (listItem, spanIndex) => (
                        <span
                          key={spanIndex}
                          data-text={listItem}
                          className={`${styles.ballistic_choosen_list_item_span} ${styles.ballistic_choosen_list_item_span_weight}`}
                        >
                          {listItem}
                        </span>
                      )
                    )}
                  </div>
                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[1]].weight.map(
                      (listItem, spanIndex) => (
                        <span
                          key={spanIndex}
                          data-text={listItem}
                          className={`${styles.ballistic_choosen_list_item_span} ${styles.ballistic_choosen_list_item_span_weight}`}
                        >
                          {listItem}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="type"
                    >
                      type
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[0]].type.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        className={`${
                          styles.ballistic_choosen_list_item_span
                        } ${
                          items[selectedRows[0]].type.length > 1
                            ? styles.ballistic_choosen_list_item_span_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </div>
                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[1]].type.map((listItem, spanIndex) => (
                      <span
                        key={spanIndex}
                        className={`${
                          styles.ballistic_choosen_list_item_span
                        } ${
                          items[selectedRows[1]].type.length > 1
                            ? styles.ballistic_choosen_list_item_span_small
                            : ''
                        }`}
                      >
                        {listItem}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`${styles.ballistic_choosen_row}`}>
                  <div className={`${styles.ballistic_choosen_list_left}`}>
                    <div
                      className={`${styles.ballistic_choosen_list_left_item}`}
                      data-text="velocity"
                    >
                      velocity
                    </div>
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[0]].velocity.map(
                      (listItem, spanIndex) => (
                        <span
                          key={spanIndex}
                          className={`${
                            styles.ballistic_choosen_list_item_span
                          } ${
                            items[selectedRows[0]].velocity.length > 1
                              ? styles.ballistic_choosen_list_item_span_small
                              : ''
                          }`}
                        >
                          {listItem.split('(')[0].trim()}
                          <br />({listItem.split('(')[1].replace(')', '')})
                        </span>
                      )
                    )}
                  </div>

                  <div className={`${styles.ballistic_choosen_list_item}`}>
                    {items[selectedRows[1]].velocity.map(
                      (listItem, spanIndex) => (
                        <span
                          key={spanIndex}
                          className={`
                          ${styles.ballistic_choosen_list_item_span}
                          ${
                            items[selectedRows[1]].velocity.length > 1
                              ? styles.ballistic_choosen_list_item_span_small
                              : ''
                          }`}
                        >
                          {listItem.split('(')[0].trim()}
                          <br />({listItem.split('(')[1].replace(')', '')})
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default BallisticChart;
