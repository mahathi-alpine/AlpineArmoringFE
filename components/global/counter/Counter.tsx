import React, { useState, useEffect, useRef } from 'react';
import styles from './Counter.module.scss';

const Counter = ({ value }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const renderDigits = () => {
    return Array.from({ length: 10 }).map((_, idx) => (
      <div className={styles.counter_digit} key={idx} data-val={idx}>
        {idx}
      </div>
    ));
  };

  return (
    <div className={styles.counter} ref={counterRef}>
      {(value + '').split('').map((val, idx) => (
        <div
          className={styles.counter_digit_wrap}
          key={idx}
          style={{
            marginTop: shouldAnimate ? `calc(-${val}em)` : '0',
            transitionDelay: `${((value + '').split('').length - idx) * 30}ms`,
            opacity: shouldAnimate ? 1 : 0,
          }}
        >
          {renderDigits()}
        </div>
      ))}
    </div>
  );
};

export default Counter;
