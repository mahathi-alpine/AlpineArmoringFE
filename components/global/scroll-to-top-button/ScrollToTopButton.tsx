'use client';

import { useEffect, useState } from 'react';
import Chevron from 'components/icons/Chevron';
import styles from './ScrollToTopButton.module.scss';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);

        if (document.querySelector('.WABusiness')) {
          document.querySelector('.WABusiness').classList.add('scrolled');
        }
      } else {
        setIsVisible(false);

        document.querySelector('.WABusiness').classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

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
