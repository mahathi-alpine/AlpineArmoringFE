import React from 'react';
import Banner from 'components/global/banner/Banner';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Seo from 'components/Seo';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Inventory(props) {
  const topBanner = props.pageData?.banner;
  const seoData = props.pageData?.seo;

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
          {props.vehicles.data?.length < 1 ? (
            <div className={`${styles.listing_list_error}`}>
              <h2>No Vehicles Found</h2>
            </div>
          ) : null}

          {props.vehicles.data ? (
            <div className={`${styles.listing_list}`}>
              {props.vehicles.data.map((item) => (
                <InventoryItem key={item.id} props={item} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let pageData = await getPageData({
    route: 'sold-vehicle',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const { q } = context.query;

  let query = 'filters[flag][$contains]=sold';
  if (q) {
    query += `filters[slug][$contains]=${q}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    sort: 'title',
    populate: 'featuredImage, categories',
  });

  return {
    props: { pageData, vehicles },
  };
}

export default Inventory;
