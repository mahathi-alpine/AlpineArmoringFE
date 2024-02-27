import React from 'react';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Seo from 'components/Seo';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Inventory(props) {
  const topBanner = props.pageData?.banner;
  const seoData = props.pageData?.seo;

  // Group vehicles by category
  // return null;
  const groupedByCategory = props.vehicles.data?.reduce((acc, item) => {
    const category = item.attributes.categories.data[0]
      ? item.attributes.categories.data[0].attributes.title
      : item.attributes.categories;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Convert the groupedByCategory object into an array of objects
  const vehiclesArray = Object.entries(groupedByCategory).map(
    ([title, items]) => ({ title, items })
  );

  console.log(props.vehicles.data);

  // Sort the vehiclesArray based on the order in props.filters.type, placing '[object Object]' at the end
  vehiclesArray.sort((a, b) => {
    if (a.title === '[object Object]') return 1;
    if (b.title === '[object Object]') return -1;

    const indexA = props.filters.type.findIndex(
      (c) => c.attributes.title === a.title
    );
    const indexB = props.filters.type.findIndex(
      (c) => c.attributes.title === b.title
    );
    return indexA - indexB;
  });

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => observerRef.current.observe(item));

    return () => {
      targets.forEach((item) => observerRef.current.unobserve(item));
    };
  }, []);

  return (
    <>
      <Seo props={seoData} />

      <div className={`${styles.listing} background-dark`}>
        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          {props.filters.type ? <Filters props={props.filters} /> : null}

          {props.vehicles.data?.length < 1 ? (
            <div className={`${styles.listing_list_error}`}>
              <h2>No Vehicles Found</h2>
            </div>
          ) : null}

          {vehiclesArray ? (
            <div className={`${styles.listing_list}`}>
              {vehiclesArray.map((category) => {
                return Array.isArray(category.items)
                  ? category.items
                      .filter((item) => item.attributes.ownPage !== false)
                      .map((item) => (
                        <InventoryItem key={item.id} props={item} />
                      ))
                  : null;
              })}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let pageData = await getPageData({
    route: 'list-inventory',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const { vehicles_we_armor, q } = context.query;

  let query = '';
  if (vehicles_we_armor) {
    query += `filters[vehicles_we_armor][slug][$eq]=${vehicles_we_armor}`;
  }
  if (q) {
    query += `filters[slug][$contains]=${q}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    sort: 'title',
    populate: 'featuredImage, categories',
  });

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    sort: 'order',
    fields: 'fields[0]=title&fields[1]=slug',
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  return {
    props: { pageData, vehicles, filters },
  };
}

export default Inventory;
