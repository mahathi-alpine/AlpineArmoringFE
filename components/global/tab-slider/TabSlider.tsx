import styles from './TabSlider.module.scss';
import { useEffect, useRef, useState, useCallback } from 'react';

const TabSlider = ({
  props,
  onTabChange,
  sticky = false,
  className = '',
  anchor = false,
  banner = false,
  small = false,
}) => {
  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : Infinity;

  const navRef = useRef(null);
  const gliderRef = useRef(null);
  const lastActiveNavItem = useRef(null);

  const [clickEventOccurred, setClickEventOccurred] = useState(false);

  const updateGliderStyle = useCallback((activeTab) => {
    const tabWidth = activeTab.offsetWidth;
    if (gliderRef.current) {
      gliderRef.current.style.width = `${tabWidth}px`;
    }
  }, []);

  const changeTab = useCallback(
    ({ index, item }, event) => {
      setClickEventOccurred(true);

      onTabChange(index, item.titleNav);

      if (navRef.current) {
        Array.from(navRef.current.children).forEach((child) => {
          (child as HTMLElement).classList.remove(
            styles.tabSlider_nav_item_active
          );
        });
        event.currentTarget.classList.add(styles.tabSlider_nav_item_active);

        if (viewportWidth >= 768 && gliderRef.current) {
          const tabRect = event.currentTarget.getBoundingClientRect();
          const containerRect = navRef.current.getBoundingClientRect();
          const translateX = tabRect.left - containerRect.left;
          gliderRef.current.style.transform = `translateX(${translateX}px)`;

          updateGliderStyle(event.currentTarget);
        }
      }
    },
    [onTabChange, viewportWidth, updateGliderStyle]
  );

  const navItemDict = useRef(
    props.reduce((acc, curr) => {
      const targetId = curr.titleNav.toLowerCase().replace(/\s+/g, '-');
      acc[targetId] = curr;
      return acc;
    }, {})
  );

  useEffect(() => {
    if (navRef.current && navRef.current.firstChild && !sticky) {
      navRef.current.firstChild.classList.add(styles.tabSlider_nav_item_active);
      const firstTab = navRef.current.firstChild;
      updateGliderStyle(firstTab);
    }
  }, [sticky, updateGliderStyle]);

  useEffect(() => {
    if (anchor) {
      const observerAnchorTargets = document.querySelectorAll('.anchor');
      const observerAnchor = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!clickEventOccurred && entry.isIntersecting) {
              const targetId = entry.target.id;
              const correspondingNavItem = navItemDict.current[targetId];

              if (correspondingNavItem) {
                const navItemIndex = props.findIndex(
                  (item) => item.id === correspondingNavItem.id
                );
                const navItemElement = navRef.current.children[navItemIndex];

                lastActiveNavItem.current = navItemElement;
                updateGliderStyle(navItemElement);
                if (gliderRef.current && navRef.current) {
                  const tabRect = navItemElement.getBoundingClientRect();
                  const containerRect = navRef.current.getBoundingClientRect();
                  const translateX = tabRect.left - containerRect.left;
                  gliderRef.current.style.transform = `translateX(${translateX}px)`;
                }
              }
            }
          });
        },
        {
          rootMargin: '0px 0px -70% 0px',
        }
      );

      observerAnchorTargets.forEach((item) => observerAnchor.observe(item));

      return () => {
        observerAnchorTargets.forEach((item) => observerAnchor.unobserve(item));
        observerAnchor.disconnect();
      };
    }
  }, [anchor, clickEventOccurred, props, updateGliderStyle]);

  useEffect(() => {
    const timer = setTimeout(() => setClickEventOccurred(false), 2000);
    return () => clearTimeout(timer);
  }, [clickEventOccurred]);

  useEffect(() => {
    if (sticky) {
      const observerNavTarget = document.querySelector('.slug_nav');
      const observerNav = new IntersectionObserver(
        ([entry]) => {
          entry.target.classList.toggle(
            styles.tabSlider_sticked,
            entry.intersectionRatio < 1
          );
        },
        {
          threshold: 1,
        }
      );
      if (observerNavTarget) {
        observerNav.observe(observerNavTarget);
      }

      return () => {
        observerNav.disconnect();
      };
    }
  }, [sticky]);

  return (
    <div
      className={`
        center
        ${className} 
        ${styles.tabSlider}
        ${sticky ? styles.tabSlider_sticky : ''}  
        ${banner ? styles.tabSlider_banner : ''}  
        ${small ? styles.tabSlider_small : ''}  
      `}
    >
      <div className={`${styles.tabSlider_nav_wrap}`}>
        <ul className={`${styles.tabSlider_nav}`} ref={navRef}>
          {props.map((item, index) => (
            <li
              className={`
                ${styles.tabSlider_nav_item}
                ${item.button ? styles.tabSlider_nav_item_cta : ''}
              `}
              onClick={(event) => changeTab({ index, item }, event)}
              key={index}
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
