import React from 'react';
import { getPageData } from 'hooks/api';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '/components/listing/Listing.module.scss';

import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import CustomMarkdown from 'components/CustomMarkdown';
import Accordion from 'components/global/accordion/Accordion';

const ITEMS_PER_PAGE = 16;
const ITEMS_TO_DISPLAY = 6;

function Inventory(props) {
  const { pageData, vehicles, filters, searchQuery } = props;
  const topBanner = pageData?.banner;
  const bottomText = pageData?.bottomText;
  const faqs = pageData?.faqs;

  const router = useRouter();
  const { q, vehicles_we_armor } = router.query;

  const [allFetchedVehicles, setAllFetchedVehicles] = useState(vehicles.data);
  const [displayedVehicles, setDisplayedVehicles] = useState(
    searchQuery ? vehicles.data : vehicles.data.slice(0, ITEMS_TO_DISPLAY)
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_TO_DISPLAY);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const totalItems = vehicles.meta.pagination.total;

  const fetchMoreFromStrapi = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;

      const query = vehicles_we_armor
        ? `filters[vehicles_we_armor][slug][$eq]=${vehicles_we_armor}`
        : '';

      const newVehicles = await getPageData({
        route: 'inventories',
        params:
          query +
          `&pagination[page]=${nextPage}&pagination[pageSize]=${ITEMS_PER_PAGE}`,
        sort: 'order',
        populate: 'featuredImage,categories',
        fields:
          'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
      });

      const updatedVehicles = [...allFetchedVehicles, ...newVehicles.data];
      setAllFetchedVehicles(updatedVehicles);
      setCurrentPage(nextPage);

      const newHasMore = updatedVehicles.length < totalItems;
      setHasMore(newHasMore);

      if (!newHasMore) {
        const visibleVehicles = updatedVehicles.filter(
          (vehicle) => !vehicle.attributes.hide
        );
        const remainingToDisplay =
          visibleVehicles.length - displayedVehicles.length;
        if (remainingToDisplay > 0) {
          setVisibleCount(visibleVehicles.length);
        }
      }
    } catch (error) {
      console.error('Error fetching more vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIntersection = useCallback(async () => {
    if (loading) return;

    const visibleVehicles = allFetchedVehicles.filter(
      (vehicle) => !vehicle.attributes.hide
    );
    const nextBatchStart = displayedVehicles.length;
    const remainingItems = visibleVehicles.length - nextBatchStart;

    if (remainingItems > 0) {
      if (remainingItems <= ITEMS_TO_DISPLAY) {
        setVisibleCount((prevCount) => prevCount + remainingItems);
      } else {
        setVisibleCount((prevCount) => prevCount + ITEMS_TO_DISPLAY);
      }

      if (hasMore && allFetchedVehicles.length < totalItems) {
        await fetchMoreFromStrapi();
      }
    }
  }, [
    loading,
    allFetchedVehicles,
    displayedVehicles.length,
    hasMore,
    totalItems,
  ]);

  // Reset state when search query or filter changes
  useEffect(() => {
    if (searchQuery) {
      setDisplayedVehicles(vehicles.data);
    } else {
      setAllFetchedVehicles(vehicles.data);
      setDisplayedVehicles(vehicles.data.slice(0, ITEMS_TO_DISPLAY));
      setVisibleCount(ITEMS_TO_DISPLAY);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [q, vehicles_we_armor, vehicles.data, searchQuery]);

  // Update displayed vehicles when not in search mode
  useEffect(() => {
    if (!searchQuery) {
      const visibleVehicles = allFetchedVehicles.filter(
        (vehicle) => !vehicle.attributes.hide
      );
      const nextBatch = visibleVehicles.slice(0, visibleCount);
      setDisplayedVehicles(nextBatch);
    }
  }, [allFetchedVehicles, visibleCount, searchQuery]);

  // Set up intersection observer
  useEffect(() => {
    if (searchQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.classList.contains('bottomObserver')
          ) {
            handleIntersection();
          }
        });
      },
      {
        rootMargin: '0px 0px 70%',
        threshold: 0,
      }
    );

    const target = document.querySelector('.bottomObserver');
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [handleIntersection, searchQuery]);

  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.alpineco.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Available now',
          item: `https://www.alpineco.com/available-now`,
        },
      ],
    };
    return JSON.stringify(structuredData);
  };

  // FAQ structured data
  const getFAQStructuredData = () => {
    if (!faqs || !Array.isArray(faqs)) {
      console.error('FAQs is not an array:', faqs);
      return null;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq, index) => {
        const title =
          faq?.attributes?.title || faq?.title || `FAQ ${index + 1}`;
        const text = faq?.attributes?.text || faq?.text || 'No answer provided';

        return {
          '@type': 'Question',
          name: title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: text,
          },
        };
      }),
    };

    return JSON.stringify(structuredData);
  };

  if (!displayedVehicles) return null;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
        {faqs?.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getFAQStructuredData() }}
            key="faq-jsonld"
          />
        )}
      </Head>

      <div className={`${styles.listing} background-dark`}>
        <div className={`b-breadcrumbs b-breadcrumbs-list container`}>
          <Link href="/">Home</Link>
          <span>&gt;</span>
          Available now
        </div>

        {topBanner && <Banner props={topBanner} shape="dark" />}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          <div className={`${styles.listing_wrap_filtered}`}>
            {filters.type && <Filters props={filters} />}
          </div>

          <div className={`${styles.listing_wrap_shown}`}>
            {!displayedVehicles.length ? (
              <div className={`${styles.listing_list_error}`}>
                <h2>No Vehicles Found</h2>
              </div>
            ) : (
              <div className={`${styles.listing_list}`}>
                {displayedVehicles.map((item, index) => (
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

        {bottomText ? (
          <div className={`container_small`}>
            <CustomMarkdown className={`${styles.listing_bottomText}`}>
              {bottomText}
            </CustomMarkdown>
          </div>
        ) : null}

        {faqs?.length > 0 ? (
          <div className={`mt2`}>
            <Accordion items={faqs} title="Frequently Asked Questions" />
          </div>
        ) : null}
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
  const { locale = 'en' } = context;

  try {
    let pageData = await getPageData({
      route: 'list-inventory',
      locale,
    });
    pageData = pageData.data?.attributes || null;

    const { vehicles_we_armor, q } = context.query;
    let query = '';
    let pageSize = 16;
    let searchQuery = null;

    if (vehicles_we_armor) {
      query += `filters[vehicles_we_armor][slug][$eq]=${vehicles_we_armor}`;
    }
    if (q) {
      query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
      pageSize = 100;
      searchQuery = true;
    }

    const vehicles = await getPageData({
      route: 'inventories',
      params: query,
      sort: 'order',
      populate: 'featuredImage,categories',
      fields:
        'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
      pageSize: pageSize,
      locale,
    });

    const filteredVehicles = {
      ...vehicles,
      data: vehicles.data.filter((vehicle) => {
        if (vehicle.attributes.hide === true) return false;
        if (!q) return true;

        const searchTerms = q.toLowerCase().replace(/[-\s]/g, '');
        const slug = vehicle.attributes.slug
          .toLowerCase()
          .replace(/[-\s]/g, '');

        return slug.includes(searchTerms);
      }),
    };

    const type = await getPageData({
      route: 'categories',
      custom:
        "populate[inventory_vehicles][fields][0]=''&sort=order:asc&fields[0]=title&fields[1]=slug",
    }).then((response) => response.data);

    const filters = type ? { type } : {};
    const seoData = pageData?.seo ?? null;

    return {
      props: {
        pageData,
        vehicles: filteredVehicles,
        filters,
        seoData,
        searchQuery,
        locale,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default Inventory;
