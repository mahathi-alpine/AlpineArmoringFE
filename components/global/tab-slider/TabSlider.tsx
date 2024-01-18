import styles from './TabSlider.module.scss';
import { useEffect, useRef } from 'react';

const TabSlider = ({ props, onTabChange, className = '' }) => {
  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : Infinity;

  const navRef = useRef(null);
  const gliderRef = useRef(null);

  useEffect(() => {
    if (navRef.current && navRef.current.firstChild) {
      navRef.current.firstChild.classList.add(styles.tabSlider_nav_item_active);
      const firstTab = navRef.current.firstChild;
      updateGliderStyle(firstTab);
    }
  }, []);

  const updateGliderStyle = (activeTab) => {
    const tabWidth = activeTab.offsetWidth;
    gliderRef.current.style.width = `${tabWidth}px`;
  };

  const changeTab = (id, event) => {
    onTabChange(id);

    Array.from(navRef.current.children).forEach((child) => {
      (child as HTMLElement).classList.remove(styles.tabSlider_nav_item_active);
    });
    event.currentTarget.classList.add(styles.tabSlider_nav_item_active);

    if (viewportWidth >= 768) {
      const tabRect = event.currentTarget.getBoundingClientRect();
      const containerRect = navRef.current.getBoundingClientRect();
      const translateX = tabRect.left - containerRect.left;
      gliderRef.current.style.transform = `translateX(${translateX}px)`;

      updateGliderStyle(event.currentTarget);
    }
  };

  return (
    <div
      className={`
        center
        ${className} 
      `}
    >
      <div className={`${styles.tabSlider_nav_wrap}`}>
        <ul className={`${styles.tabSlider_nav}`} ref={navRef}>
          {props.map((item, index) => (
            <li
              className={`${styles.tabSlider_nav_item}`}
              onClick={(event) => changeTab(index, event)}
              key={item.id}
            >
              {item.titleNav}
            </li>
          ))}
        </ul>

        <div className={`${styles.tabSlider_nav_glider}`} ref={gliderRef}></div>
      </div>
    </div>
  );
};

export default TabSlider;
