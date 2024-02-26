import React from 'react';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Seo from 'components/Seo';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Inventory(props) {
  const topBanner = props.pageData?.banner;
  const seoData = props.pageData?.seo;

  const groupedByCategory = props.vehicles.data?.reduce((acc, item) => {
    const category = item.attributes.category.data
      ? item.attributes.category.data?.attributes.title
      : item.attributes.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

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

      <div className={`${styles.listing}`}>
        {topBanner ? <Banner props={topBanner} shape="white" small /> : null}

        <div className={`${styles.listing_all_filters} container`}>
          {props.filters.type ? <Filters props={props.filters} plain /> : null}
        </div>

        <div className={`${styles.listing_wrap} container`}>
          {props.vehicles.data?.length < 1 ? (
            <div className={`${styles.listing_empty}`}>
              <h2>No Vehicles Found</h2>
            </div>
          ) : null}

          {groupedByCategory ? (
            <div className={`${styles.listing_list}`}>
              {Object.keys(groupedByCategory).map((category) => {
                const itemsInCategory = groupedByCategory[category];

                return itemsInCategory.map((item) => (
                  <InventoryItem key={item.id} props={item} />
                ));
              })}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

// interface InventoryProps {
//   data: any;
// }

export async function getServerSideProps(context) {
  let pageData = await getPageData({
    route: 'list-vehicles-we-armor',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  let query = '';
  if (context.query.category) {
    query += `&filters[category][slug][$eq]=${context.query.category}`;
  }
  if (context.query.make) {
    query += `&filters[make][slug][$eq]=${context.query.make}`;
  }
  if (context.query.q) {
    query += `filters[slug][$contains]=${context.query.q}`;
  }
  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    params: query,
    populate: 'featuredImage, category',
    sort: 'title',
  });

  // Fetching Types and Makes for the Filters
  const [type, make] = await Promise.all([
    getPageData({
      route: 'categories',
      sort: 'order',
      fields: 'fields[0]=title&fields[1]=slug',
    }).then((res) => res.data),
    getPageData({
      route: 'makes',
      sort: 'order',
      fields: 'fields[0]=title&fields[1]=slug',
    }).then((res) => res.data),
  ]);

  let filters = {};
  if (type && make) {
    filters = { type, make };
  }

  return {
    props: { pageData, vehicles, filters },
  };
}

export default Inventory;
