import { useEffect, useRef } from 'react';
import styles from './ComparisonSlider.module.scss';
import Image from 'next/image';

const ComparisonSlider = ({ beforeImage, afterImage }) => {
  const sliderRef = useRef(null);
  const beforeRef = useRef(null);
  const resizerRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const before = beforeRef.current;
    const beforeImage = before.getElementsByTagName('img')[0];
    const resizer = resizerRef.current;

    let active = false;

    const moveDivisor = () => {
      const width = slider.offsetWidth;
      beforeImage.style.width = width + 'px';
    };

    window.addEventListener('resize', moveDivisor);

    slider.addEventListener('mousedown', (e) => {
      let x = e.pageX;
      x -= slider.getBoundingClientRect().left;
      slideIt(x);
    });

    resizer.addEventListener('mousedown', () => {
      active = true;
      resizer.classList.add('resize');
    });

    document.body.addEventListener('mouseup', () => {
      active = false;
      resizer.classList.remove('resize');
    });

    document.body.addEventListener('mouseleave', () => {
      active = false;
      resizer.classList.remove('resize');
    });

    document.body.addEventListener('mousemove', (e) => {
      if (!active) return;
      let x = e.pageX;
      x -= slider.getBoundingClientRect().left;
      slideIt(x);
      pauseEvent(e);
    });

    resizer.addEventListener('touchstart', () => {
      active = true;
      resizer.classList.add('resize');
    });

    document.body.addEventListener('touchend', () => {
      active = false;
      resizer.classList.remove('resize');
    });

    document.body.addEventListener('touchcancel', () => {
      active = false;
      resizer.classList.remove('resize');
    });

    document.body.addEventListener('touchmove', (e) => {
      if (!active) return;
      let x;
      let i;
      for (i = 0; i < e.changedTouches.length; i++) {
        x = e.changedTouches[i].pageX;
      }
      x -= slider.getBoundingClientRect().left;
      slideIt(x);
      pauseEvent(e);
    });

    function slideIt(x) {
      const transform = Math.max(0, Math.min(x, slider.offsetWidth));
      before.style.width = transform + 'px';
      resizer.style.left = transform - 0 + 'px';
    }

    function pauseEvent(e) {
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    }

    moveDivisor();

    return () => {
      window.removeEventListener('resize', moveDivisor);
    };
  }, []);

  return (
    <div className={`${styles.comparisonSlider}`} ref={sliderRef}>
      <div className={`${styles.comparisonSlider_before}`} ref={beforeRef}>
        <Image
          src={beforeImage?.formats?.large?.url || beforeImage?.url}
          alt={beforeImage.alternativeText || 'Alpine Armoring'}
          width={1300}
          height={450}
          quality={100}
          sizes="(max-width: 768px) 100vw, 75vw"
        ></Image>
      </div>

      <div className={`${styles.comparisonSlider_after}`}>
        <Image
          src={afterImage?.formats?.large?.url || afterImage?.url}
          alt={afterImage.alternativeText || 'Alpine Armoring'}
          width={1300}
          height={450}
          quality={100}
          sizes="(max-width: 768px) 100vw, 75vw"
        ></Image>
      </div>

      <div className={`${styles.comparisonSlider_resizer}`} ref={resizerRef}>
        <div className={`${styles.comparisonSlider_resizer_inner}`}></div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
