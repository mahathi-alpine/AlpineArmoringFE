import React from 'react';
import Banner from 'components/global/banner/Banner';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import routes from 'routes';
import useLocale from 'hooks/useLocale';

function Inventory(props) {
  const { lang } = useLocale();
  const topBanner = props.pageData?.banner;

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
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

  return (
    <>
      <div className={`${styles.listing} background-dark`}>
        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          {props.vehicles.data?.length < 1 ? (
            <div className={`${styles.listing_list_error}`}>
              <h2>{lang.noVehiclesFound}</h2>
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
  const locale = context.locale || 'en';
  const route = routes.soldVehicles;

  let pageData = await getPageData({
    route: route.collection,
    locale,
  });
  pageData = pageData.data?.attributes || null;

  const { q } = context.query;

  let query = 'filters[flag][$contains]=sold';
  if (q) {
    query += `filters[slug][$contains]=${q}`;
  }

  const vehicles = await getPageData({
    route: route.collectionSingle,
    params: query,
    sort: 'title',
    populate: 'featuredImage, categories',
    locale,
  });

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, vehicles, seoData },
  };
}

export default Inventory;
