import styles from './Filters.module.scss';
import Link from 'next/link';
import FiltersIcon from 'components/icons/Filters';
import ChevronIcon from 'components/icons/Chevron';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useMemo } from 'react';
import SearchIcon from 'components/icons/Search';
import useLocale from 'hooks/useLocale';

type FiltersProps = {
  props: {
    type?: any[];
    make?: any[];
  };
  plain?: boolean;
};

const Filters = ({ props, plain }: FiltersProps) => {
  const { lang } = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilterItem, setActiveFilterItem] = useState('default');
  const [activeFilterTitles, setActiveFilterTitles] = useState({
    make: lang.select,
    type: lang.all,
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

  // Sorting function for filter items
  const sortFilterItems = (items: any[]) => {
    return items.sort((a, b) => {
      const aHasInventory = a.attributes.inventory_vehicles?.data.length > 0;
      const bHasInventory = b.attributes.inventory_vehicles?.data.length > 0;

      // Items with inventory come first, then items without inventory
      return aHasInventory === bHasInventory ? 0 : aHasInventory ? -1 : 1;
    });
  };

  // Filter makes based on current type
  const filterMakesByType = useMemo(() => {
    const currentTypeSlug = router.query.type as string;

    if (!currentTypeSlug || !props.make) return props.make;

    return props.make.filter((make) => {
      return make.attributes.vehicles_we_armors?.data.some((vehicleArmor) =>
        vehicleArmor.attributes.category?.data.some(
          (item) => item.attributes?.slug === currentTypeSlug
        )
      );
    });
  }, [router.query.type, props.make]);

  const filterTypesByMake = useMemo(() => {
    const currentMakeSlug = router.query.make as string;

    if (!currentMakeSlug || !props.type) return props.type;

    const selectedMake = props.make?.find(
      (make) => make.attributes.slug === currentMakeSlug
    );

    const categorySlugs = selectedMake?.attributes.vehicles_we_armors?.data
      .flatMap((vehicle) =>
        vehicle.attributes.category?.data.map((cat) => cat.attributes?.slug)
      )
      .filter(Boolean);

    return props.type.filter((type) =>
      categorySlugs?.includes(type.attributes.slug)
    );
  }, [router.query.make, props.make, props.type]);

  useEffect(() => {
    if (router.isReady) {
      const q = Array.isArray(router.query.q)
        ? router.query.q.join('')
        : router.query.q || '';
      setQuery(q);
    }
  }, [router.isReady, router.query]);

  const handleSearch = async () => {
    setFiltersOpen(false);
    document.body.classList.remove('no-scroll');

    // Get clean base URL without any path parameters or query strings
    const cleanBaseUrl = getBaseUrl();

    // For search, we only want the 'q' parameter, removing all others (type, make)
    const newQuery: { q?: string } = {};

    if (!query || query.trim().length === 0) {
      // If search is empty, just go to base URL without any parameters
      router.push(cleanBaseUrl, undefined);
    } else {
      // If we have a search query, use only that parameter
      newQuery.q = query;

      router.push(
        {
          pathname: cleanBaseUrl,
          query: newQuery,
        },
        undefined
      );
    }
  };

  const activateFilterItem = (slug: string) => {
    setActiveFilterItem((current) => (current === slug ? null : slug));
  };

  const openFilters = (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth <= 1280) {
      setOpenFiltersClicked(true);
      setFiltersOpen((filtersOpen) => {
        const newValue = !filtersOpen;
        if (newValue) {
          document.body.classList.add('no-scroll');
        } else {
          document.body.classList.remove('no-scroll');
        }
        return newValue;
      });
    }
    if (e.target instanceof HTMLElement && e.target.innerHTML == lang.all) {
      activeFilterTitles.make = lang.select;
    }
  };

  const currentFilterMake = router.query.make;

  // Get clean base URL without query parameters
  const getBaseUrl = () => {
    const pathParts = router.asPath.split('/');
    // Take the first two parts (language and base route)
    const baseUrl = pathParts.slice(0, 2).join('/');
    // Remove any query params
    return baseUrl.split('?')[0];
  };

  const baseUrl = getBaseUrl();
  const currentSlug = router.asPath.split('/').pop()?.split('?')[0] || '';

  const handleClearFilters = () => {
    setQuery('');
    activeFilterTitles.make = lang.select;
    router.push(baseUrl, undefined, { scroll: false });
  };

  useEffect(() => {
    if (!router.isReady) return;

    setActiveFilterItem(window.innerWidth < 1280 ? 'type' : 'default');

    ['type', 'make'].forEach((paramKey) => {
      const { [paramKey]: item } = router.query;

      if (paramKey === 'make' && !item) {
        // Reset make filter title when make query is removed
        setActiveFilterTitles((prevTitles) => ({
          ...prevTitles,
          make: lang.select,
        }));
        return;
      }

      if (props[paramKey]) {
        const selectedItem = props[paramKey].find(
          (i) => i.attributes.slug === item
        );
        if (selectedItem) {
          setActiveFilterTitles((prevTitles) => ({
            ...prevTitles,
            [paramKey]: selectedItem.attributes.title,
          }));
        }
      }
    });
  }, [router.isReady, router.query, props]);

  // Improved applyFilter function with consistent URL handling
  const applyFilter = (item: string, paramKey: string) => {
    if (paramKey == 'make') {
      setFiltersOpen(false);
      document.body.classList.remove('no-scroll');
    }

    // Get clean base URL
    const cleanBaseUrl = getBaseUrl();

    // Get current query parameters
    const newQuery = { ...router.query };
    delete newQuery['vehicles_we_armor'];
    // Remove 'q' parameter when applying type or make filters
    delete newQuery.q;

    // Skip if the parameter value hasn't changed
    if (newQuery[paramKey] === item) {
      return;
    }

    // Update the selected parameter
    newQuery[paramKey] = item;

    setActiveFilterItem(window.innerWidth >= 768 ? 'default' : 'type');

    // Update the filter title
    const selectedItem = props[paramKey].find(
      (i) => i.attributes.slug === item
    );
    if (selectedItem) {
      setActiveFilterTitles((prevTitles) => ({
        ...prevTitles,
        [paramKey]: selectedItem.attributes.title,
      }));
    }

    // Reset search query when applying filters
    setQuery('');

    // Handle URL construction based on parameter type
    if (paramKey === 'type') {
      // If it's a type filter, construct path-based URL
      const typeUrl = `${cleanBaseUrl}/${lang.type}/${item}`;

      // Remove type from query since it's now in the path
      delete newQuery.type;

      // Add remaining query parameters
      const queryString = new URLSearchParams();
      Object.entries(newQuery).forEach(([key, value]) => {
        if (typeof value === 'string') {
          queryString.append(key, value);
        }
      });
      const finalUrl = `${typeUrl}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

      router.push(finalUrl, undefined, { scroll: false });
    } else {
      // For other filters (make), use the query parameter approach
      // Check if we already have a type in the path
      const pathParts = router.asPath.split('/');

      if (pathParts.length > 2 && pathParts[2] === lang.type) {
        const typeSlug = pathParts[3]?.split('?')[0];
        if (typeSlug) {
          const typeUrl = `${cleanBaseUrl}/${lang.type}/${typeSlug}`;

          // Remove type from query since it's in the path
          delete newQuery.type;

          // Add remaining query parameters
          const queryString = new URLSearchParams();
          Object.entries(newQuery).forEach(([key, value]) => {
            if (typeof value === 'string') {
              queryString.append(key, value);
            }
          });
          const finalUrl = `${typeUrl}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

          router.push(finalUrl, undefined, { scroll: false });
          return;
        }
      }

      // If no type in path yet, just use query parameters
      const cleanQuery: Record<string, string> = {};
      Object.entries(newQuery).forEach(([key, value]) => {
        if (typeof value === 'string') {
          cleanQuery[key] = value;
        }
      });

      router.push(
        {
          pathname: cleanBaseUrl,
          query: cleanQuery,
        },
        undefined,
        { scroll: false }
      );
    }
  };

  // Improved constructFilterUrl function
  const constructFilterUrl = (
    baseUrl: string,
    slug: string,
    currentQuery: string
  ) => {
    // Parse the current query string into URLSearchParams
    const queryParams = new URLSearchParams(currentQuery || '');
    queryParams.delete('vehicles_we_armor');
    queryParams.delete('type'); // Remove type from query since it's in the path
    queryParams.delete('q'); // Remove search query when applying type filters

    // Create a clean query string
    const queryString = queryParams.toString();

    // Return the properly formatted URL
    return `${baseUrl}/${lang.type}/${slug}${queryString ? `?${queryString}` : ''}`;
  };

  const filtersRef = useRef(null);
  const filtersMainRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      const handleClickOutside = (event) => {
        if (filtersRef.current && !filtersRef.current.contains(event.target)) {
          setActiveFilterItem('default');
        }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    } else {
      const handleClickOutside = (event) => {
        if (filtersRef.current && !filtersRef.current.contains(event.target)) {
          const navigationPopup = document.getElementById('navigationPopup');
          const hasOpenClass = Array.from(navigationPopup.classList).some(
            (className) => className.includes('open')
          );

          if (!openFiltersClicked && !hasOpenClass) {
            setFiltersOpen(false);
            document.body.classList.remove('no-scroll');
          } else {
            setOpenFiltersClicked(false);
          }
        }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openFiltersClicked]);

  // Check if we have either a make query or a search query
  const hasValidMakeQuery =
    (router.query.make && (!router.query.type || router.query.type)) ||
    Boolean(router.query.q);

  return (
    <div
      className={`${styles.filters}
      ${plain ? `${styles.filters_plain}` : ''}
    `}
      ref={filtersMainRef}
    >
      <div className={`${styles.filters_top}`}>
        <div className={`${styles.filters_top_title}`} onClick={openFilters}>
          Filters
          <FiltersIcon />
        </div>

        {Object.keys(router.query).length > 0 && hasValidMakeQuery && (
          <div
            className={`${styles.filters_clear} bold`}
            onClick={handleClearFilters}
          >
            {lang.clearAllFilters}
          </div>
        )}
      </div>

      <div
        className={`
          ${styles.filters_wrap}
          ${filtersOpen ? styles.filters_wrap_open : ''}
        `}
      >
        <div className={`${styles.filters_wrap_inner}`} ref={filtersRef}>
          <div className={`${styles.filters_wrap_top}`}>
            <div className={`${styles.filters_wrap_top_title}`}>
              <div
                className={`${styles.filters_wrap_close}`}
                onClick={openFilters}
              >
                X
              </div>
              {lang.filters}
            </div>

            {(Object.keys(router.query).length > 0 ||
              Boolean(router.query.q)) && (
              <div
                className={`${styles.filters_clear}`}
                onClick={handleClearFilters}
              >
                {lang.clearAllFilters}
              </div>
            )}
          </div>

          <div className={`${styles.filters_search}`}>
            <input
              type="text"
              value={query}
              placeholder={lang.search}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <div
              onClick={handleSearch}
              className={`${styles.filters_search_icon}`}
            >
              <SearchIcon />
            </div>
          </div>

          {Object.keys(props).map((filter) => {
            return (
              <div
                key={filter}
                className={`
                  ${styles.filters_item}
                  ${
                    filter === activeFilterItem
                      ? styles.filters_item_active
                      : ''
                  }
                `}
                onClick={() => activateFilterItem(filter)}
              >
                <span className={`${styles.filters_item_title}`}>
                  {filter}
                  <ChevronIcon className={`${styles.filters_item_chevron}`} />
                </span>
                <span className={`${styles.filters_item_choice}`}>
                  {filter == 'make'
                    ? activeFilterTitles.make
                    : activeFilterTitles.type.replace('Armored', '')}
                </span>

                <div className={`${styles.filters_item_wrap}`}>
                  {filter == 'type' && (
                    <Link
                      href={baseUrl}
                      className={`${styles.checkbox_link} ${
                        'available-now' === currentSlug
                          ? styles.selected_filter
                          : ''
                      }`}
                      onClick={openFilters}
                      key="all"
                    >
                      <span className={`${styles.checkbox_span}`}>
                        {lang.all}
                      </span>
                    </Link>
                  )}

                  {filter === 'type'
                    ? sortFilterItems(filterTypesByMake).map((item) => {
                        if (
                          (baseUrl == lang.vehiclesWeArmorURL &&
                            (item.attributes.title == lang.armoredRental ||
                              item.attributes.title.toLowerCase() ==
                                'special of the month'.toLowerCase() ||
                              item.attributes.title == 'Armored Pre-Owned')) ||
                          (baseUrl == lang.availableNowURL &&
                            item.attributes.title == lang.vansAndBussesTitle)
                        ) {
                          return null;
                        }

                        // Construct URL using the improved function
                        const currentQueryString =
                          router.asPath.split('?')[1] || '';
                        const newUrl = constructFilterUrl(
                          baseUrl,
                          item.attributes.slug,
                          currentQueryString
                        );

                        // Conditional rendering based on inventory vehicles
                        return item.attributes.inventory_vehicles?.data.length <
                          1 ? (
                          <span
                            className={`
                              ${styles.checkbox_link} 
                              ${styles.checkbox_link_disabled}
                              ${
                                item.attributes.slug ===
                                currentSlug.split('/').pop().split('?')[0]
                                  ? styles.selected_filter
                                  : ''
                              }
                            `}
                            key={item.id}
                          >
                            <span className={`${styles.checkbox_span}`}>
                              {baseUrl == lang.vehiclesWeArmorURL
                                ? item.attributes.title.replace(
                                    lang.armored2,
                                    ''
                                  )
                                : item.attributes.title}
                            </span>
                          </span>
                        ) : (
                          <Link
                            href={newUrl}
                            className={`
                              ${styles.checkbox_link}
                              ${
                                item.attributes.slug ===
                                currentSlug.split('/').pop().split('?')[0]
                                  ? styles.selected_filter
                                  : ''
                              }
                            `}
                            onClick={openFilters}
                            key={item.id}
                          >
                            <span className={`${styles.checkbox_span}`}>
                              {baseUrl == lang.vehiclesWeArmorURL
                                ? item.attributes.title
                                    .replace(/Armored/gi, '')
                                    .replace(/[Bb]lindado(s)?/g, '')
                                    .replace(/[Bb]lindada(s)?/g, '')
                                    .replace(/\s+s\b/, '')
                                    .trim()
                                : item.attributes.title}
                            </span>
                          </Link>
                        );
                      })
                    : filterMakesByType.map((item) => (
                        <div
                          className={`${styles.checkbox_link} ${
                            item.attributes.slug === currentFilterMake
                              ? styles.selected_filter
                              : ''
                          }`}
                          onClick={() =>
                            applyFilter(item.attributes.slug, 'make')
                          }
                          key={item.id}
                        >
                          <span className={`${styles.checkbox_span}`}>
                            {item.attributes.title}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
