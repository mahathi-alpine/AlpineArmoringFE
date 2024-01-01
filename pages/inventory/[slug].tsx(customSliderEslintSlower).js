/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './InventoryVehicle.module.scss';
import { getPageData } from '../../lib/api';
import Button from 'components/global/button/Button';
import Image from 'next/image';

// import { API_URL } from 'config/index';

function InventoryVehicle(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [topGallery, setTopGallery] = useState([]);
  const activeImageRef = useRef();

  useEffect(() => {
    if (props.data) {
      const data = props.data.data[0].attributes;
      setTopGallery(data.gallery.data);
    }
  }, [props.data]);

  // if (!props.data) {
  //   return null;
  // }

  // const data = props.data.data[0].attributes;
  // const topGallery = data.gallery.data;

  const handleClick = useCallback(
    (index) => {
      if (index < 0) {
        setActiveIndex(topGallery.length - 1);
      } else if (index >= topGallery.length) {
        setActiveIndex(0);
      } else {
        setActiveIndex(index);
      }
    },
    [topGallery.length]
  );

  useEffect(() => {
    let initialX = null;
    let initialY = null;
    let direction = null;

    const touchStartHandler = (event) => {
      initialX = event.touches[0].clientX;
      initialY = event.touches[0].clientY;
    };

    const touchMoveHandler = (event) => {
      const finalX = event.touches[0].clientX;
      const finalY = event.touches[0].clientY;

      if (initialX === null) {
        return;
      }

      if (finalX < initialX) {
        direction = 'left';
      } else if (finalX > initialX) {
        direction = 'right';
      } else if (finalY < initialY) {
        direction = 'up';
      } else if (finalY > initialY) {
        direction = 'down';
      }
    };

    const touchEndHandler = () => {
      if (direction === 'left') {
        handleClick(activeIndex + 1);
      } else if (direction === 'right') {
        handleClick(activeIndex - 1);
      }

      initialX = null;
      initialY = null;
      direction = null;
    };

    activeImageRef.current.addEventListener('touchstart', touchStartHandler);
    activeImageRef.current.addEventListener('touchmove', touchMoveHandler);
    activeImageRef.current.addEventListener('touchend', touchEndHandler);

    // Cleanup function to remove event listeners
    return () => {
      activeImageRef.current.removeEventListener(
        'touchstart',
        touchStartHandler
      );
      activeImageRef.current.removeEventListener('touchmove', touchMoveHandler);
      activeImageRef.current.removeEventListener('touchend', touchEndHandler);
    };
  }, [activeIndex, handleClick]);

  return (
    <div className={`${styles.inventory}`}>
      <div className={`${styles.inventory_top}`}>
        <div className={`${styles.inventory_top_gallery}`}>
          <div
            className={`${styles.inventory_top_gallery_active}`}
            ref={activeImageRef}
          >
            <div className={`${styles.inventory_top_gallery_active_container}`}>
              {topGallery.map((image, index) => (
                <Image
                  key={index}
                  width={375}
                  height={320}
                  src={image.attributes.url}
                  alt="Description of the image"
                  className={activeIndex === index ? styles.active : ''}
                />
              ))}
            </div>
          </div>
          <div className={`${styles.inventory_top_gallery_nav}`}>
            {/* {[...topGallery.slice(1), topGallery[0]].map((image, index) => ( */}
            {topGallery.map((image, index) => (
              <Image
                key={index}
                src={image.attributes.url}
                width={475}
                height={320}
                onClick={() => handleClick(topGallery.indexOf(image))}
                alt="Description of the image"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getPageData({
    route: 'inventories',
    params: `filters[slug][$eq]=${context.params.slug}`,
  });

  return {
    props: { data },
  };
}

export default InventoryVehicle;
