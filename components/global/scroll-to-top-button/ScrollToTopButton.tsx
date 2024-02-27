'use client';

import { useEffect, useState } from 'react';
import Chevron from 'components/icons/Chevron';
import styles from './ScrollToTopButton.module.scss';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // if the user scrolls down, show the button
      window.scrollY > 500 ? setIsVisible(true) : setIsVisible(false);
    };
    // listen for scroll events
    window.addEventListener('scroll', toggleVisibility);

    // clear the listener on component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // handles the animation when scrolling to the top
  const scrollToTop = () => {
    isVisible &&
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      });
  };

  return (
    <button
      className={`
        ${styles.scrollToTopButton} 
        ${isVisible ? `${styles.scrollToTopButton_visible}` : ''}
      `}
      onClick={scrollToTop}
      aria-label="scroll to top"
    >
      <Chevron />
    </button>
  );
};

export default ScrollToTopButton;
