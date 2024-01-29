import styles from './TabSlider.module.scss';
import Link from 'next/link';
// import ChevronIcon from 'components/icons/Chevron';
import { useEffect, useRef } from 'react';

const TabSlider = ({
  props,
  onTabChange,
  sticky = false,
  className = '',
  anchor = false,
}) => {
  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : Infinity;

  const navRef = useRef(null);
  const gliderRef = useRef(null);

  useEffect(() => {
    if (navRef.current && navRef.current.firstChild && !sticky) {
      navRef.current.firstChild.classList.add(styles.tabSlider_nav_item_active);
      const firstTab = navRef.current.firstChild;
      updateGliderStyle(firstTab);
    }
  }, [sticky]);

  const updateGliderStyle = (activeTab) => {
    const tabWidth = activeTab.offsetWidth;
    gliderRef.current.style.width = `${tabWidth}px`;
  };

  const changeTab = ({ index, item }, event) => {
    onTabChange(index, item.titleNav);

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

  const navItemDict = props.reduce((acc, curr) => {
    const targetId = curr.titleNav.toLowerCase().replace(/\s+/g, '-');
    acc[targetId] = curr;
    return acc;
  }, {});

  const lastActiveNavItem = useRef(null);

  useEffect(() => {
    if (anchor) {
      const observerAnchorTargets = document.querySelectorAll('.anchor');
      const observerAnchor = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const targetId = entry.target.id;
              const correspondingNavItem = navItemDict[targetId];

              if (correspondingNavItem) {
                const navItemIndex = props.findIndex(
                  (item) => item.id === correspondingNavItem.id
                );
                const navItemElement = navRef.current.children[navItemIndex];
                navItemElement.classList.add(styles.tabSlider_nav_item_active);
                lastActiveNavItem.current?.classList.remove(
                  styles.tabSlider_nav_item_active
                );
                lastActiveNavItem.current = navItemElement;
                updateGliderStyle(navItemElement);

                const tabRect = navItemElement.getBoundingClientRect();
                const containerRect = navRef.current.getBoundingClientRect();
                const translateX = tabRect.left - containerRect.left;
                gliderRef.current.style.transform = `translateX(${translateX}px)`;
              }
            }
          });
        },
        {
          rootMargin: '0px 0px -70% 0px',
        }
      );
      observerAnchorTargets.forEach((item) => observerAnchor.observe(item));

      // Clean up the observer when the component unmounts
      return () => {
        observerAnchorTargets.forEach((item) => observerAnchor.unobserve(item));
        observerAnchor.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (sticky) {
      const observerNavTarget = document.querySelector('.slug_nav');
      const observerNav = new IntersectionObserver(
        ([entries]) => {
          entries.target.classList.toggle(
            styles.tabSlider_sticked,
            entries.intersectionRatio < 1
          );
        },
        {
          threshold: 1,
        }
      );
      observerNav.observe(observerNavTarget);

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
      `}
    >
      <div
        className={`
        ${styles.tabSlider_nav_wrap}      
      `}
      >
        <ul className={`${styles.tabSlider_nav}`} ref={navRef}>
          {props.map((item, index) => (
            <li
              className={`${styles.tabSlider_nav_item}`}
              onClick={(event) => changeTab({ index, item }, event)}
              key={item.id}
            >
              {item.titleNav}
            </li>
          ))}
          {sticky ? (
            <li
              className={`${styles.tabSlider_nav_item} ${styles.tabSlider_nav_item_cta}`}
            >
              <Link href="/contact">Request a quote</Link>
            </li>
          ) : null}
        </ul>

        <div className={`${styles.tabSlider_nav_glider}`} ref={gliderRef}></div>
      </div>
    </div>
  );
};

export default TabSlider;
