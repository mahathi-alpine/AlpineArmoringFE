import React, { useRef } from 'react';
import styles from './StickyHorizontalSlider.module.scss';
import Image from 'next/image';
import { useEffect } from 'react';
// import { API_URL } from 'config/index';

const StickyHorizontalSlider = ({ props }) => {
  const containerRef = useRef(null);
  const containerInnerRef = useRef(null);

  useEffect(() => {
    const windowWidth = window.innerWidth;

    if (windowWidth > 767) {
      const container = containerRef.current;
      const elementWrapper = containerInnerRef.current;

      const horLength = elementWrapper.scrollWidth;
      const distFromTop = container.offsetTop;
      const scrollDistance = distFromTop + horLength - windowWidth;

      container.style.height = horLength - windowWidth / 3 + 'px';

      const onScroll = () => {
        const scrollTop = window.scrollY;
        if (scrollTop >= distFromTop && scrollTop <= scrollDistance) {
          elementWrapper.style.transform =
            'translateX(-' + (scrollTop - distFromTop) + 'px)';
        }
      };

      const obr = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          window.addEventListener('scroll', onScroll);
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      });
      obr.observe(container);
    }
  }, []);

  return (
    <section
      className={`${styles.stickyHorizontalSlider} sticky-container`}
      ref={containerRef}
    >
      <div className={`${styles.stickyHorizontalSlider_sticky}`}>
        <div className={`${styles.stickyHorizontalSlider_heading}`}>
          <h2 className={`c-title block-reveal observe`}>
            <span>Latest News</span>
          </h2>
        </div>

        <div
          className={`${styles.stickyHorizontalSlider_inner} sticky-container-inner`}
          ref={containerInnerRef}
        >
          <div
            className={`${styles.stickyHorizontalSlider_item} ${styles.stickyHorizontalSlider_item_empty} desktop-only`}
          ></div>

          {props.map((item) => (
            <div
              className={`${styles.stickyHorizontalSlider_item}`}
              key={item.id}
            >
              {item.image.data?.attributes.url ? (
                <Image
                  src={`${item.image.data.attributes.url}`}
                  alt="Description of the image"
                  width={475}
                  height={320}
                  className={`${styles.stickyHorizontalSlider_item_image}`}
                />
              ) : null}
              <div className={`${styles.stickyHorizontalSlider_item_content}`}>
                {/* <div className={`${styles.stickyHorizontalSlider_item_number}`}>0{index + 1}</div> */}
                <div className={`${styles.stickyHorizontalSlider_item_text}`}>
                  <h5 className={`${styles.stickyHorizontalSlider_item_title}`}>
                    {item.title}
                  </h5>
                  {/* <p className={`${styles.stickyHorizontalSlider_item_description}`}>{ item.description }</p> */}
                  <p className={`${styles.stickyHorizontalSlider_item_date}`}>
                    OCT 14, 2023
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StickyHorizontalSlider;
