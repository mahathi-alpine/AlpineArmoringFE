import { getPageData } from 'hooks/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '/components/listing/Listing.module.scss';
import Banner from 'components/global/banner/Banner';
import Link from 'next/link';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';

function Inventory(props) {
  let topBanner = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );
  topBanner = topBanner?.attributes.inventoryBanner;

  const findTitleBySlug = (filters, targetSlug) => {
    if (!filters || !Array.isArray(filters.type)) {
      return null;
    }

    const matchingItem = filters.type.find(
      (item) =>
        item.attributes &&
        item.attributes.slug.toLowerCase() === targetSlug.toLowerCase()
    );

    return matchingItem ? matchingItem.attributes.title : null;
  };

  const categoryTitle = findTitleBySlug(props?.filters, props?.query);

  const router = useRouter();
  const currentPath = router.asPath;
  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);
  const [itemsToRender, setItemsToRender] = useState(6);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [router.query]);

  const fetchMoreItems = () => {
    if (itemsToRender < vehiclesData?.length) {
      setLoading(true);
      setItemsToRender((prevItemsToRender) => prevItemsToRender + 6);
      setLoading(false);
    }
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
  }, [itemsToRender]);

  return (
    <>
      <div className={`${styles.listing} background-dark`}>
        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        <div className={`b-breadcrumbs b-breadcrumbs-list container`}>
          <Link href="/available-now">Available now</Link>
          <span>&gt;</span>
          {categoryTitle}
        </div>

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container mt0`}
        >
          {/* Render Filters conditionally based on path and filter type */}
          {!currentPath.includes('armored-rental') && props.filters?.type ? (
            <Filters props={props.filters} />
          ) : null}

          {vehiclesData && vehiclesData.length > 0 ? (
            <div className={`${styles.listing_list}`}>
              {vehiclesData.reduce((acc, item, index) => {
                if (item.attributes.ownPage !== false) {
                  acc[index] = (
                    <InventoryItem key={item.id} props={item} index={index} />
                  );
                }
                return acc;
              }, [])}
            </div>
          ) : (
            <div className={`${styles.listing_list_error}`}>
              No Vehicles Found
            </div>
          )}
        </div>
      </div>

      <div
        className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
        style={{ opacity: loading ? 1 : 0 }}
      >
        Loading...
      </div>

      <div className={`observe bottomObserver`}></div>

      <div className="shape-before shape-before-white"></div>
    </>
  );
}

export async function getServerSideProps(context) {
  // Fetching Vehicles
  const category = context.query.type;
  let query = `filters[categories][slug][$eq]=${category}`;
  const q = context.query.q;
  if (q) {
    query += `&filters[slug][$contains]=${q.toLowerCase()}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    sort: 'order',
    populate: 'featuredImage',
    fields:
      'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=ownPage&fields[9]=hide',
    pageSize: 100,
  });

  const filteredVehicles = {
    ...vehicles,
    data: vehicles.data.filter((vehicle) => vehicle.attributes.hide !== true),
  };

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    custom: `populate[inventory_vehicles][fields][0]=''&populate[inventoryBanner][populate][media][fields][0]=url&populate[inventoryBanner][populate][media][fields][1]=mime&populate[inventoryBanner][populate][media][fields][2]=alternativeText&populate[inventoryBanner][populate][media][fields][3]=width&populate[inventoryBanner][populate][media][fields][4]=height&populate[inventoryBanner][populate][media][fields][5]=formats&populate[inventoryBanner][populate][mediaMP4][fields][0]=url&populate[inventoryBanner][populate][mediaMP4][fields][1]=mime&populate[seo][populate][metaImage][fields][0]=url&populate[seo][populate][metaSocial][fields][0]=url&sort=order:asc&fields[0]=title&fields[1]=slug`,
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  let seoData = filters.type?.find(
    (item) => item.attributes.slug === context.query.type
  );

  seoData = seoData?.attributes?.seo ?? null;

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
