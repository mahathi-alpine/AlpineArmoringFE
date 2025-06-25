import React from 'react';
import { getPageData } from 'hooks/api';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import routes from 'routes';
import styles from '/components/listing/Listing.module.scss';
import useLocale from 'hooks/useLocale';

import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import CustomMarkdown from 'components/CustomMarkdown';
import Accordion from 'components/global/accordion/Accordion';
import Content from 'components/global/content/Content';

function VehicleList(props) {
  const { lang } = useLocale();
  const router = useRouter();
  const pageData = props.pageData;
  const vehicles = props.vehicles.data;
  const filters = props.filters;

  const topBanner = pageData?.banner;
  const bottomText = pageData?.bottomText;
  const bottomTextContent = {
    dynamicZone: pageData?.bottomTextDynamic || [],
  };
  const faqs = pageData?.faqs;

  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const contentRef = useRef(null);
  const toggleContent = () => {
    setIsContentExpanded(!isContentExpanded);
  };

  if (!pageData) {
    return (
      <div className="error-container">
        <div>No page data available</div>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.listing} background-dark`}>
        <div className={`b-breadcrumbs b-breadcrumbs-list container`}>
          <Link href="/">{lang.home}</Link>
          <span>&gt;</span>
          <Link href={routes.inventory.paths[router.locale]}>
            {lang.availableNowTitle}
          </Link>
        </div>

        {topBanner && <Banner props={topBanner} shape="dark" />}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          <div className={`${styles.listing_wrap_filtered}`}>
            {filters?.type && <Filters props={filters} />}
          </div>

          <div className={`${styles.listing_wrap_shown}`}>
            {!vehicles?.length ? (
              <div className={`${styles.listing_list_error}`}>
                <h2>{lang.noVehiclesFound}</h2>
              </div>
            ) : (
              <div className={`${styles.listing_list}`}>
                {vehicles.map((item, index) => (
                  <InventoryItem
                    key={item.id || index}
                    props={item}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {bottomText && bottomTextContent.dynamicZone.length == 0 && (
          <div className={`container_small`}>
            <div className={`${styles.listing_bottomText}`}>
              <CustomMarkdown>{bottomText}</CustomMarkdown>
            </div>
          </div>
        )}

        {bottomTextContent.dynamicZone.length > 0 && (
          <div className={`${styles.listing_bottomContent} static`}>
            <div
              ref={contentRef}
              className={`${styles.listing_content_preview} container_small`}
              style={{
                maxHeight: isContentExpanded
                  ? `${contentRef.current?.scrollHeight}px`
                  : '265px',
              }}
            >
              <Content data={bottomTextContent} />
            </div>

            {!isContentExpanded && (
              <div className={`${styles.listing_content_overlay}`}></div>
            )}

            <button
              className={`${styles.listing_more}`}
              onClick={toggleContent}
            >
              {isContentExpanded ? 'Read Less' : 'Read More'}
            </button>
          </div>
        )}

        {faqs?.length > 0 ? (
          <div className={`${styles.listing_faqs}`}>
            <Accordion items={faqs} title={lang.frequentlyAskedQuestions} />
          </div>
        ) : null}
      </div>

      <div className="shape-before shape-before-white"></div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const locale = context.locale || 'en';
  const route = routes.inventory;

  const vehicleSlug = typeof slug === 'string' ? slug : '';

  if (!vehicleSlug) {
    return {
      notFound: true,
    };
  }

  try {
    let pageData = await getPageData({
      route: route.collection,
      locale,
    });
    pageData = pageData.data?.attributes || null;

    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: `filters[vehicles_we_armor][slug][$eq]=${vehicleSlug}`,
      sort: 'order',
      populate: 'featuredImage',
      fields:
        'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
      pageSize: 100,
      locale,
    });

    if (!vehicles || !vehicles.data) {
      throw new Error('Invalid vehicles data received from Strapi');
    }

    const filteredVehicles = {
      ...vehicles,
      data: vehicles.data.filter((vehicle) => {
        return vehicle.attributes.hide !== true;
      }),
    };

    const type = await getPageData({
      route: 'categories',
      custom:
        "populate[inventory_vehicles][fields][0]=''&sort=order:asc&fields[0]=title&fields[1]=slug",
      locale,
    }).then((response) => response.data);

    const filters = type ? { type } : {};

    const seoData = {
      ...(pageData?.seo || {}),
      canonicalURL: false,
      languageUrls: false,
      metaRobots: 'noindex, follow',
    };

    return {
      props: {
        pageData,
        vehicles: filteredVehicles,
        filters,
        seoData,
        locale,
      },
    };
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    return {
      notFound: true,
    };
  }
}

export default VehicleList;
