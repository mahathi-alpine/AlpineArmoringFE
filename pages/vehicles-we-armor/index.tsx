import React from 'react';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function VehicleWeArmor(props) {
  const router = useRouter();
  const { q, make } = router.query;
  const topBanner = props.pageData?.banner;

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false);
    }
  }, [router.isReady]);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [router.query]);

  const categoryOrderMap = new Map(
    props.filters.type?.map((category) => [
      category.attributes.title,
      category.attributes.order,
    ])
  );

  const vehiclesArray = vehiclesData?.sort((a, b) => {
    // Correctly access the category order using the category title
    const categoryOrderA = categoryOrderMap.get(
      a.attributes.category.data.attributes.title
    );
    const categoryOrderB = categoryOrderMap.get(
      b.attributes.category.data.attributes.title
    );

    // Compare by category order
    if (categoryOrderA !== categoryOrderB) {
      return Number(categoryOrderA) - Number(categoryOrderB);
    }

    // If categories are equal, compare by make title alphabetically
    const makeOrderA = a.attributes.make
      ? a.attributes.make.data?.attributes.title
      : '';
    const makeOrderB = b.attributes.make
      ? b.attributes.make.data?.attributes.title
      : '';
    return makeOrderA?.localeCompare(makeOrderB);
  });

  // Filtering vehicles based on the make parameter
  const filteredByMake = vehiclesArray?.filter(
    (vehicle) =>
      !make || vehicle.attributes.make?.data?.attributes?.slug === make
  );

  // Filtering vehicles based on the q parameter
  const filteredByQ = filteredByMake?.filter(
    (vehicle) => !q || vehicle.attributes?.slug.includes(q)
  );

  const [currentPage, setCurrentPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

  const pageLimit = 14;

  const fetchMoreItems = async () => {
    if (!hasMore) return;

    const totalItems = props.vehicles?.meta?.pagination?.total || 0;

    if (currentPage * pageLimit >= totalItems + pageLimit) return;

    setLoading(true);
    setCurrentPage(currentPage + 1);

    const query = q ? `filters[slug][$contains]=${q}` : '';

    // Fetch the next batch of items using the current page number
    const vehicles = await getPageData({
      route: 'vehicles-we-armors',
      sort: 'category.order',
      populate: 'featuredImage, category, make',
      page: currentPage,
      pageSize: pageLimit,
      params: query,
    });

    if (Array.isArray(vehicles.data)) {
      setVehiclesData((prevData) => [...prevData, ...vehicles.data]);
    }

    const itemsFetched = vehiclesData?.length + vehicles.data.length || 0;
    setHasMore(itemsFetched < totalItems);
    setLoading(false);
  };

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
          observer.unobserve(entry.target);

          if (entry.target.classList.contains('bottomObserver')) {
            fetchMoreItems();
          }
        }
      });
    });

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, [currentPage, hasMore, props.vehicles.data]);

  return (
    <>
      <div className={`${styles.listing}`}>
        {topBanner ? <Banner props={topBanner} shape="white" small /> : null}

        <div className={`${styles.listing_all_filters} container`}>
          {props.filters.type ? <Filters props={props.filters} plain /> : null}
        </div>

        <div className={`${styles.listing_wrap} container`}>
          {filteredByQ?.length < 1 ? (
            <div className={`${styles.listing_empty}`}>
              <h2>No Vehicles Found</h2>
            </div>
          ) : null}

          {filteredByQ?.length > 0 && !isLoading ? (
            <div className={`${styles.listing_list}`}>
              {filteredByQ.map((item, index) => (
                <InventoryItem key={item.id} props={item} index={index} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`${styles.listing_loading}`}
        style={{ opacity: loading ? 1 : 0 }}
      >
        Loading...
      </div>

      <div className={`observe bottomObserver`}></div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'list-vehicles-we-armor',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  // let query = '';
  // if (context.query.category) {
  //   query += `&filters[category][slug][$eq]=${context.query.category}`;
  // }
  // if (context.query.make) {
  //   query += `&filters[make][slug][$eq]=${context.query.make}`;
  // }
  // if (context.query.q) {
  //   query += `filters[slug][$contains]=${context.query.q.toLowerCase()}`;
  // }

  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    populate: 'featuredImage, category, make',
    page: 1,
    pageSize: 14,
    sort: 'category.order',
  });

  const [type, make] = await Promise.all([
    getPageData({
      route: 'categories',
      sort: 'order',
      fields: 'fields[0]=title&fields[1]=slug&fields[2]=order',
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

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, vehicles, filters, seoData },
  };
}

export default VehicleWeArmor;
