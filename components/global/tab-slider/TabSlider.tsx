import styles from './TabSlider.module.scss';
import { useCallback, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ClassNames from 'embla-carousel-class-names';

const TabSlider = ({ props, onTabChange }) => {
  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : Infinity;
  const sliderOptions = {
    active: viewportWidth < 1280,
    duration: 10,
  };

  const navRef = useRef(null);
  const gliderRef = useRef(null);

  const [tabSliderRef, emblaApi] = useEmblaCarousel(sliderOptions, [
    ClassNames(),
  ]);

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

    if (viewportWidth >= 1280) {
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
    <div className={`${styles.tabSlider_nav_wrap}`} ref={tabSliderRef}>
      <ul className={`${styles.tabSlider_nav}`} ref={navRef}>
        {props.map((item) => (
          <li
            className={`${styles.tabSlider_nav_item}`}
            onClick={(event) => changeTab(item.id, event)}
            key={item.id}
          >
            {item.titleNav}
          </li>
        ))}
      </ul>

      <div className={`${styles.tabSlider_nav_glider}`} ref={gliderRef}></div>
    </div>
  );
};

export default TabSlider;
