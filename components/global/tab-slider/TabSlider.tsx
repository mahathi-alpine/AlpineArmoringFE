import styles from './TabSlider.module.scss';
import { useCallback, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ClassNames from 'embla-carousel-class-names';

const TabSlider = ({ props, onTabChange, className = '' }) => {
  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : Infinity;
  const sliderOptions = {
    active: viewportWidth < 768,
    duration: 10,
  };

  const navRef = useRef(null);
  const gliderRef = useRef(null);

  const [tabSliderRef, emblaApi] = useEmblaCarousel(sliderOptions, [
    ClassNames(),
  ]);

  useEffect(() => {
    if (navRef.current && navRef.current.firstChild) {
      const firstTab = navRef.current.firstChild;
      updateGliderStyle(firstTab);
    }
  }, []);

  const updateGliderStyle = (activeTab) => {
    const tabWidth = activeTab.offsetWidth;
    gliderRef.current.style.width = `${tabWidth}px`;
  };

  const onSelect = useCallback(() => {
    setTimeout(() => {
      const activeTab = navRef.current.querySelector('.is-snapped');
      if (!activeTab) return;

      const tabRect = activeTab.getBoundingClientRect();
      const translateX = tabRect.left - 13;
      gliderRef.current.style.transform = `translateX(${translateX}px)`;
      updateGliderStyle(activeTab);

      const id = Array.from(navRef.current.children).indexOf(activeTab);
      onTabChange(id);
    }, 300);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const changeTab = (id, event) => {
    onTabChange(id);
    emblaApi.scrollTo(id);

    if (viewportWidth >= 768) {
      Array.from(navRef.current.children).forEach((child) => {
        (child as HTMLElement).classList.remove(
          styles.tabSlider_nav_item_active
        );
      });
      event.currentTarget.classList.add(styles.tabSlider_nav_item_active);

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
      <div className={`${styles.tabSlider_nav_wrap}`} ref={tabSliderRef}>
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
