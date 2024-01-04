// import React, { useState, useEffect, useCallback } from 'react'
import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Button from 'components/global/button/Button';
// import Image from 'next/image';
import Carousel from 'components/global/carousel/Carousel';
import { EmblaOptionsType } from 'embla-carousel-react';

const OPTIONS: EmblaOptionsType = {
  loop: true,
};

function InventoryVehicle(props) {
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

  if (!props.data.data) {
    return null;
  }
  const data = props.data.data[0].attributes;
  const topGallery = data.gallery.data;

  return (
    <div className={`${styles.inventory}`}>
      <div className="background-dark">
        <div className={`${styles.inventory_top}`}>
          <div className={`${styles.inventory_top_gallery}`}>
            {topGallery ? (
              <Carousel slides={topGallery} options={OPTIONS} />
            ) : null}

            <div className="shape-before mobile-only">
              <span></span>
            </div>
          </div>

          <div className={`${styles.inventory_details}`}>
            {/* <div className={`${styles.inventory_breadcrumbs}`}>

            </div> */}

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
                  <li className={`${styles.inventory_tabs_nav_item}`}>
                    Vehicle details
                  </li>
                  <li className={`${styles.inventory_tabs_nav_item}`}>
                    Specifications
                  </li>
                  <li className={`${styles.inventory_tabs_nav_item}`}>
                    Optional equipment
                  </li>
                </ul>
              </div>

              <div className={`${styles.inventory_tabs_content}`}>
                <div className={`${styles.inventory_tabs_content_item}`}>
                  <ul className={`${styles.inventory_tabs_content_list}`}>
                    <li></li>
                  </ul>
                </div>
              </div>
            </div>

            <Button href="/contact" icon className="icon">
              Request a quote
            </Button>
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
    populate: 'deep',
  });

  return {
    props: { data },
  };
}

export default InventoryVehicle;
