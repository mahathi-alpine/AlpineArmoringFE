import { getPageData } from 'hooks/api';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';

function Inventory(props) {
  let topBanner = props.filters?.type?.find(
    (item) => item.attributes.slug === props.query
  );
  topBanner = topBanner?.attributes.allBanner;

  const router = useRouter();

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);
  const [itemsToRender, setItemsToRender] = useState(6);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [router.query, props.vehicles.data]);

  const fetchMoreItems = useCallback(() => {
    if (itemsToRender < vehiclesData?.length) {
      setLoading(true);
      setItemsToRender((prevItemsToRender) => prevItemsToRender + 6);
      setLoading(false);
    }
  }, [itemsToRender, vehiclesData]);

  // // Filtering vehicles based on the make parameter
  const filteredByMake = props.vehicles?.data?.filter(
    (vehicle) =>
      !router.query.make ||
      vehicle.attributes.make?.data?.attributes?.slug === router.query.make
  );

  // // Filtering vehicles based on the q parameter
  // const filteredByQ = filteredByMake?.filter(
  //   (vehicle) => !q || vehicle.attributes?.slug.includes(q)
  // );

  // useEffect(() => {
  //   if (router.isReady) {
  //     setLoading(false);
  //   }
  // }, [router.isReady]);

  // Animations
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
  }, [itemsToRender, fetchMoreItems]);

  // const findTitleBySlug = (filters, targetSlug) => {
  //   if (!filters || !Array.isArray(filters.type)) {
  //     return null;
  //   }

  //   const matchingItem = filters.type.find(item =>
  //     item.attributes &&
  //     item.attributes.slug.toLowerCase() === targetSlug.toLowerCase()
  //   );

  //   return matchingItem ? matchingItem.attributes.title : null;
  // };

  // const categoryTitle = findTitleBySlug(props?.filters, props?.query);

  return (
    <>
      <div className={`${styles.listing}`}>
        {topBanner ? <Banner props={topBanner} shape="white" small /> : null}
        {/* 
        <div className={`b-breadcrumbs b-breadcrumbs-list b-breadcrumbs-dark container untilLarge-only`}>
          <Link href="/vehicles-we-armor">Vehicles We Can Armor</Link>
          <span>&gt;</span>
          {categoryTitle}
        </div> */}

        {props.filters?.type ? (
          <div className={`${styles.listing_all_filters} mt-0 container`}>
            <Filters props={props.filters} plain />
          </div>
        ) : null}

        <div className={`${styles.listing_wrap} container`}>
          {filteredByMake?.length > 0 && !loading ? (
            <div className={`${styles.listing_list}`}>
              {filteredByMake.map((item, index) => (
                <InventoryItem key={item.id} props={item} index={index} />
              ))}
            </div>
          ) : (
            <div className={`${styles.listing_empty}`}>No Vehicles Found</div>
          )}

          {/* {filteredByQ?.length < 1 ? (
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
          ) : null} */}
        </div>
      </div>

      <div
        className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
        style={{ opacity: loading ? 1 : 0 }}
      >
        Loading...
      </div>

      <div className={`observe bottomObserver`}></div>
    </>
  );
}

// export async function getStaticPaths() {
//   try {
//     const slugsResponse = await getPageData({
//       route: 'categories',
//       fields: 'fields[0]=slug',
//       populate: '/',
//     });

//     if (!Array.isArray(slugsResponse.data)) {
//       throw new Error('Invalid data format');
//     }

//     const paths = slugsResponse.data.reduce((acc, item) => {
//       if (item.attributes && item.attributes.slug) {
//         acc.push({ params: { type: item.attributes.slug } });
//       }
//       return acc;
//     }, []);

//     return {
//       paths,
//       fallback: true,
//     };
//   } catch (error) {
//     console.error('Error fetching slugs:', error);
//     return {
//       paths: [],
//       fallback: false,
//     };
//   }
// }

export async function getServerSideProps(context) {
  // Fetching Vehicles
  const category = context.query.type;
  let query = `filters[category][slug][$eq]=${category}`;
  const q = context.query.q;
  if (q) {
    query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
  }

  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    // params: `filters[category][slug][$eq]=${params.type}`,
    params: query,
    sort: 'order',
    pageSize: 100,
    populate: 'featuredImage, make',
  });

  const filteredVehicles = {
    ...vehicles,
    data: vehicles.data.filter((vehicle) => {
      if (!q) return true;

      const searchTerms = q.toLowerCase().replace(/[-\s]/g, '');
      const slug = vehicle.attributes.slug.toLowerCase().replace(/[-\s]/g, '');

      return slug.includes(searchTerms);
    }),
  };

  // Fetching Types and Makes for the Filters
  const [type, make] = await Promise.all([
    getPageData({
      route: 'categories',
      sort: 'order',
      fields: 'fields[0]=title&fields[1]=slug',
      populate:
        'allBanner.media, allBanner.imageMobile, allBanner.mediaMP4, seo',
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
    props: {
      vehicles: filteredVehicles,
      filters,
      query: context.query.type,
      seoData,
    },
  };
}

export default Inventory;
