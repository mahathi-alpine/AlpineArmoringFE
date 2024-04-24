import React from 'react';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Inventory(props) {
  let topBanner = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );

  topBanner = topBanner?.attributes.allBanner;

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

          {props.vehicles.data ? (
            <div className={`${styles.listing_list}`}>
              {props.vehicles.data.map((item, index) => (
                <InventoryItem key={item.id} props={item} index={index} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = context.query.type;
  let query = `filters[category][slug][$eq]=${category}`;
  if (context.query.make) {
    query += `&filters[make][slug][$eq]=${context.query.make}`;
  }
  if (context.query.q) {
    query += `&filters[slug][$contains]=${context.query.q.toLowerCase()}`;
  }

  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    params: query,
    sort: 'title',
    pageSize: 100,
    populate: 'featuredImage',
  });

  // Fetching Types and Makes for the Filters
  const [type, make] = await Promise.all([
    getPageData({
      route: 'categories',
      sort: 'order',
      fields: 'fields[0]=title&fields[1]=slug',
      populate: 'allBanner.media, seo',
    }).then((res) => res.data),
    getPageData({
      route: 'makes',
      sort: 'title',
      pageSize: 100,
      fields: 'fields[0]=title&fields[1]=slug',
    }).then((res) => res.data),
  ]);

  let filters = {};
  if (type && make) {
    filters = { type, make };
  }

  let seoData = type?.find(
    (item) => item.attributes.slug === context.query.type
  );
  seoData = seoData?.attributes.seo || null;

  return {
    props: { vehicles, filters, query: context.query.type, seoData },
  };
}

export default Inventory;
