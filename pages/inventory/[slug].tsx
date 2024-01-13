import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect, useState } from 'react';

import Button from 'components/global/button/Button';
import TabSlider from 'components/global/tab-slider/TabSlider';
import Carousel from 'components/global/carousel/Carousel';
import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';

function InventoryVehicle(props) {
  const [activeDiv, setActiveDiv] = useState('0');
  const handleTabChange = (id) => {
    setActiveDiv(id);
  };

  useEffect(() => {
    document.body.classList.add(
      'listing-inventory',
      // 'header-transparent',
      'background-dark'
    );
    return () => {
      document.body.classList.remove(
        'listing-inventory',
        // 'header-transparent',
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

  const sliderTopOptions = { dragFree: false, loop: true, thumbs: true };

  // const sliderBottomOptions = {
  //   dragFree: true,
  //   loop: true,
  //   thumbs: false,
  //   variableWidth: true,
  // };

  const vehicleDetailsMain = {
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

  const tabSliderData = [
    {
      id: 0,
      titleNav: 'Vehicle Details',
    },
    {
      id: 1,
      titleNav: 'Specifications',
    },
    {
      id: 2,
      titleNav: 'Accessories',
    },
  ];

  return (
    <div className={`${styles.inventory}`}>
      <div className="background-dark">
        <div className={`${styles.inventory_top}`}>
          <div className={`${styles.inventory_top_gallery}`}>
            {topGallery ? (
              <Carousel slides={topGallery} options={sliderTopOptions} />
            ) : null}

            <div className={`${styles.inventory_armor}`}>
              Armor
              <br />
              Level
              <span>{data.armor_level}</span>
            </div>

            <div
              className={`${styles.inventory_top_shape} shape-before mobile-only`}
            ></div>
          </div>

          <div className={`${styles.inventory_details}`}>
            {/* <div className={`${styles.inventory_breadcrumbs}`}>
              <a href="">Inventory</a>
              <span>&gt;</span>
              <a href="">Armored SUVs</a>
            </div> */}

            <h1 className={`${styles.inventory_details_title}`}>
              {data.title}
            </h1>

            <p className={`${styles.inventory_details_description}`}>
              {data.shortDescription}
            </p>

            <div className={`${styles.inventory_tabs}`}>
              <TabSlider props={tabSliderData} onTabChange={handleTabChange} />

              <div className={`${styles.inventory_tabs_content}`}>
                <div
                  className={`${styles.inventory_tabs_content_item} ${
                    activeDiv == '0'
                      ? styles.inventory_tabs_content_item_active
                      : ''
                  }`}
                >
                  <ul className={`${styles.inventory_tabs_content_list}`}>
                    {Object.entries(vehicleDetailsMain).map(([key, value]) => {
                      return (
                        data[value] != null && (
                          <li
                            key={key}
                            className={`${styles.inventory_tabs_content_list_item}`}
                          >
                            {`${key}:`}
                            <span>{`${data[value]}`}</span>
                          </li>
                        )
                      );
                    })}
                  </ul>
                </div>
                <div
                  className={`${styles.inventory_tabs_content_item} ${
                    activeDiv == '1'
                      ? styles.inventory_tabs_content_item_active
                      : ''
                  }`}
                >
                  test
                </div>
                <div
                  className={`${styles.inventory_tabs_content_item} ${
                    activeDiv == '2'
                      ? styles.inventory_tabs_content_item_active
                      : ''
                  }`}
                >
                  ESTEEE
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

        <div className={`${styles.inventory_images}`}>
          <div className="shape-after"></div>
          {/* {topGallery ? (
            <div className={`${styles.inventory_images_slider}`}>
              <Carousel slides={topGallery} options={sliderBottomOptions} />
            </div>
          ) : null} */}
          <div className="shape-before"></div>
        </div>
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
