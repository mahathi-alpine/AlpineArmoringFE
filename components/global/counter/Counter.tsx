import React, { useEffect, useState } from 'react';
import styles from './Counter.module.scss';

interface CounterProps {
  title?: string;
  start: number;
  end: number;
  duration: number;
}

const Counter: React.FC<CounterProps> = ({ title, start, end, duration }) => {
  const [count, setCount] = useState<number>(start);
  const increment: number = Math.ceil((end - start) / (duration * 60));

  useEffect(() => {
    const timer = setInterval(() => {
      if (count < end) {
        setCount((prevCount) => prevCount + increment);
      } else {
        setCount(end);
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [count, end, increment]);

  return (
    <div className={styles.counter}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.number}>{count}</div>
    </div>
  );
};

export default Counter;
