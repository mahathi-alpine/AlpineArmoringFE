import { getPageData } from 'hooks/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import Link from 'next/link';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';

function Inventory(props) {
  const router = useRouter();
  const { make, q } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false);
    }
  }, [router.isReady]);

  let topBanner = props.filters?.type?.find(
    (item) => item.attributes.slug === props.query
  );
  topBanner = topBanner?.attributes.allBanner;

  // Filtering vehicles based on the make parameter
  const filteredByMake = props.vehicles?.data?.filter(
    (vehicle) =>
      !make || vehicle.attributes.make?.data?.attributes?.slug === make
  );

  // Filtering vehicles based on the q parameter
  const filteredByQ = filteredByMake?.filter(
    (vehicle) => !q || vehicle.attributes?.slug.includes(q)
  );

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

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
    </>
  );
}

export async function getStaticPaths() {
  try {
    const slugsResponse = await getPageData({
      route: 'categories',
      fields: 'fields[0]=slug',
      populate: '/',
    });

    if (!Array.isArray(slugsResponse.data)) {
      throw new Error('Invalid data format');
    }

    const paths = slugsResponse.data.reduce((acc, item) => {
      if (item.attributes && item.attributes.slug) {
        acc.push({ params: { type: item.attributes.slug } });
      }
      return acc;
    }, []);

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    params: `filters[category][slug][$eq]=${params.type}`,
    sort: 'title',
    pageSize: 100,
    populate: 'featuredImage, make',
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

  let seoData = type?.find((item) => item.attributes.slug === params.type);
  seoData = seoData?.attributes.seo || null;

  return {
    props: { vehicles, filters, query: params.type, seoData },
  };
}

export default Inventory;
