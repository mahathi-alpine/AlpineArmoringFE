import { useEffect, useState } from 'react';
import styles from './ScrollProgressBar.module.scss';

interface ScrollProgressBarProps {
  targetClassName?: string;
  targetId?: string;
}

const ScrollProgressBar = ({
  targetClassName,
  targetId,
}: ScrollProgressBarProps): JSX.Element => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = (): void => {
      let targetElement: HTMLElement | null = null;

      if (targetId) {
        targetElement = document.getElementById(targetId);
      } else if (targetClassName) {
        targetElement = document.querySelector(
          `.${targetClassName}`
        ) as HTMLElement;
      }

      if (!targetElement) {
        setProgress(0);
        return;
      }

      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.offsetHeight;
      const elementBottom = elementTop + elementHeight;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollBottom = scrollTop + windowHeight;

      if (scrollTop < elementTop) {
        setProgress(0);
      } else if (scrollBottom > elementBottom) {
        setProgress(100);
      } else {
        const scrolledIntoElement = scrollTop - elementTop;
        const totalScrollableHeight = elementHeight - windowHeight;

        if (totalScrollableHeight <= 0) {
          setProgress(100);
        } else {
          const scrollPercentage =
            (scrolledIntoElement / totalScrollableHeight) * 100;
          setProgress(Math.min(100, Math.max(0, scrollPercentage)));
        }
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return (): void => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetClassName, targetId]);

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressBar_fill}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
