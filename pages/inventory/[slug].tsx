// import React, { useState, useEffect, useCallback } from 'react'
import styles from './InventoryVehicle.module.scss';
import { getPageData } from '../../lib/api';
// import Button from 'components/global/button/Button';
// import Image from 'next/image';
import Carousel from 'components/global/carousel/Carousel';
import { EmblaOptionsType } from 'embla-carousel-react';

const OPTIONS: EmblaOptionsType = {
  loop: true,
};

function InventoryVehicle(props) {
  if (!props.data) {
    return null;
  }

  const data = props.data.data[0].attributes;
  const topGallery = data.gallery.data;

  return (
    <div className={`${styles.inventory}`}>
      <div className="background-dark">
        <div className={`${styles.inventory_top}`}>
          <div className={`${styles.inventory_top_gallery}`}>
            <Carousel slides={topGallery} options={OPTIONS} />
          </div>

          <div className={`${styles.inventory_top_details}`}>
            <h1 className={`${styles.inventory_top_title}`}>{data.title}</h1>
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
