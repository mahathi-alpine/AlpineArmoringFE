import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect, useState } from 'react';
import Button from 'components/global/button/Button';
import Carousel from 'components/global/carousel/Carousel';
// import EmblaOptionsType from "embla-carousel-react"

import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';

// const OPTIONS: EmblaOptionsType = {
//   loop: true,
// };

function InventoryVehicle(props) {
  const [activeDiv, setActiveDiv] = useState('1');

  useEffect(() => {
    document.body.classList.add(
      'listing-inventory',
      'header-transparent',
      'background-dark'
    );
    return () => {
      document.body.classList.remove(
        'listing-inventory',
        'header-transparent',
        'background-dark'
      );
    };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
          observer.unobserve(entry.target);

          // VideoScale
          if (entry.target.classList.contains('videoScaleContainer')) {
            window.addEventListener(
              'scroll',
              () => animateVideo(entry.target),
              { passive: true }
            );
          }
        } else {
          if (entry.target.classList.contains('videoScaleContainer')) {
            window.removeEventListener('scroll', () =>
              animateVideo(entry.target)
            );
          }
        }
      });
    });

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  if (!props.data.data) {
    return null;
  }
  const data = props.data.data[0].attributes;
  const topGallery = data.gallery.data;

  const keys = {
    VIN: 'VIN',
    'Vehicle ID': 'vehicleID',
    Engine: 'engine',
    Trans: 'trans',
    Power: 'power',
    'Color (EXT)': 'color_ext',
    'Color (INT)': 'color_int',
    Trim: 'trim',
    Wheels: 'wheels',
    'Drive Train': 'driveTrain',
    Height: 'height',
    Length: 'length',
    Width: 'width',
    Wheelbase: 'wheelbase',
    Weight: 'weight',
  };

  const changeTab = (id) => {
    setActiveDiv(id);
  };

  return (
    <div className={`${styles.inventory}`}>
      <div className="background-dark">
        <div className={`${styles.inventory_top}`}>
          <div className={`${styles.inventory_top_gallery}`}>
            {topGallery ? <Carousel slides={topGallery} /> : null}

            <div className="shape-before mobile-only">
              <span></span>
            </div>
          </div>

          <div className={`${styles.inventory_details}`}>
            <div className={`${styles.inventory_breadcrumbs}`}>
              <a href="">Inventory</a>
              <span>&gt;</span>
              <a href="">Armored SUVs</a>
            </div>

            {/* <h3 className={`${styles.inventory_banner_protection}`}>
              ARMORED AT PROTECTION LEVEL <span>A9</span>
            </h3> */}

            <h1 className={`${styles.inventory_details_title}`}>
              {data.title}
            </h1>

            <p className={`${styles.inventory_details_description}`}>
              {data.shortDescription}
            </p>

            <div className={`${styles.inventory_tabs}`}>
              <div className={`${styles.inventory_tabs_nav_wrap}`}>
                <ul className={`${styles.inventory_tabs_nav}`}>
                  <li
                    className={`${styles.inventory_tabs_nav_item} ${
                      activeDiv === '1'
                        ? styles.inventory_tabs_nav_item_active
                        : ''
                    }`}
                    onClick={() => changeTab('1')}
                  >
                    Vehicle Details
                  </li>
                  <li
                    className={`${styles.inventory_tabs_nav_item} ${
                      activeDiv === '2'
                        ? styles.inventory_tabs_nav_item_active
                        : ''
                    }`}
                    onClick={() => changeTab('2')}
                  >
                    Specifications
                  </li>
                  <li
                    className={`${styles.inventory_tabs_nav_item} ${
                      activeDiv === '3'
                        ? styles.inventory_tabs_nav_item_active
                        : ''
                    }`}
                    onClick={() => changeTab('3')}
                  >
                    Optional Equipment
                  </li>
                </ul>
              </div>

              <div className={`${styles.inventory_tabs_content}`}>
                <div
                  className={`${styles.inventory_tabs_content_item} ${
                    activeDiv === '1'
                      ? styles.inventory_tabs_content_item_active
                      : ''
                  }`}
                >
                  <ul className={`${styles.inventory_tabs_content_list}`}>
                    {Object.entries(keys).map(([key, value]) => {
                      return (
                        <li
                          key={key}
                          className={`${styles.inventory_tabs_content_list_item}`}
                        >
                          {`${key}:`}
                          <span>{`${data[value]}`}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div
                  className={`${styles.inventory_tabs_content_item} ${
                    activeDiv === '2'
                      ? styles.inventory_tabs_content_item_active
                      : ''
                  }`}
                >
                  <ul className={`${styles.inventory_tabs_content_list}`}></ul>
                </div>
              </div>
            </div>

            <Button href="/contact" icon className="icon">
              Request a quote
            </Button>
          </div>
        </div>

        <VideoScale
          video="/AlpineArmoringHP.mp4"
          text1="Armored Cadillac"
          text2="ESV V-Series"
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getPageData({
    route: 'inventories',
    params: `filters[slug][$eq]=${context.params.slug}`,
    populate: 'deep',
  });

  return {
    props: { data },
  };
}

export default InventoryVehicle;
