import styles from './Filters.module.scss';
import Link from 'next/link';
import FiltersIcon from 'components/icons/Filters';
import ChevronIcon from 'components/icons/Chevron';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import SearchIcon from 'components/icons/Search';

type FiltersProps = {
  props: any;
  plain?: boolean;
};

const Filters = ({ props, plain }: FiltersProps) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

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

    const newQuery = { ...router.query };

    // If the query is empty, remove 'q' from the new query object
    if (!query || query.trim().length === 0) {
      delete newQuery.q;
    } else {
      // If the query is not empty, add or update 'q' in the new query object
      newQuery.q = query;
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined
      // { scroll: false }
    );
  };

  const [activeFilterItem, setActiveFilterItem] = useState('default');
  const [activeFilterTitles, setActiveFilterTitles] = useState({
    make: 'Select',
    type: 'All',
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

  const activateFilterItem = (slug) => {
    setActiveFilterItem((current) => (current === slug ? null : slug));
  };

  const openFilters = (e) => {
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
    if (e.target.innerHTML == 'All') {
      activeFilterTitles.make = 'Select';
    }
  };

  const currentFilterMake = router.query.make;

  const pathParts = router.pathname.split('/');
  const baseUrl = pathParts.slice(0, 2).join('/');

  const currentSlug = router.asPath.split('/').pop();

  const handleClearFilters = () => {
    setQuery('');
    activeFilterTitles.make = 'Select';
    router.push(`${baseUrl}`, undefined, { scroll: false });
  };

  useEffect(() => {
    if (!router.isReady) return;

    setActiveFilterItem(window.innerWidth < 1280 ? 'type' : 'default');

    ['type', 'make'].forEach((paramKey) => {
      const { [paramKey]: item } = router.query;

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

  const applyFilter = (item, paramKey) => {
    if (paramKey == 'make') {
      setFiltersOpen(false);
      document.body.classList.remove('no-scroll');
    }

    const newQuery = { ...router.query };
    delete newQuery['vehicles_we_armor'];

    if (newQuery[paramKey] === item) {
      return;
    }

    newQuery[paramKey] = item;

    setActiveFilterItem(window.innerWidth >= 768 ? 'default' : 'type');

    const selectedItem = props[paramKey].find(
      (i) => i.attributes.slug === item
    );
    if (selectedItem) {
      setActiveFilterTitles((prevTitles) => ({
        ...prevTitles,
        [paramKey]: selectedItem.attributes.title,
      }));
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { scroll: false }
    );
  };

  // Close filters dropdown on click outside
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

        {Object.keys(router.query).length > 0 && (
          <div
            className={`${styles.filters_clear} bold`}
            onClick={handleClearFilters}
          >
            Clear all filters
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
              Filters
            </div>

            {Object.keys(router.query).length > 0 && (
              <div
                className={`${styles.filters_clear}`}
                onClick={handleClearFilters}
              >
                Clear all filters
              </div>
            )}
          </div>

          <div className={`${styles.filters_search}`}>
            <input
              type="text"
              value={query}
              placeholder="Search"
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
                <h4 className={`${styles.filters_item_title}`}>
                  {filter}
                  <ChevronIcon className={`${styles.filters_item_chevron}`} />
                </h4>
                <span className={`${styles.filters_item_choice}`}>
                  {filter == 'make'
                    ? activeFilterTitles.make
                    : activeFilterTitles.type.replace('Armored', '')}
                </span>

                <div className={`${styles.filters_item_wrap}`}>
                  {props[filter].map((item) => {
                    if (filter == 'type') {
                      const newUrl = `${baseUrl}/type/${item.attributes.slug}${
                        router.asPath.includes('?')
                          ? '?' + router.asPath.split('?')[1]
                          : ''
                      }`;
                      if (
                        (baseUrl == '/vehicles-we-armor' &&
                          item.attributes.title == 'Armored Rental') ||
                        (baseUrl == '/vehicles-we-armor' &&
                          item.attributes.title.toLowerCase() ==
                            'special of the month'.toLowerCase()) ||
                        (baseUrl == '/vehicles-we-armor' &&
                          item.attributes.title == 'Armored Pre-Owned')
                      ) {
                        return;
                      }
                      return (
                        <Link
                          href={newUrl}
                          // scroll={false}
                          className={`
                            ${styles.checkbox_link} 
                            ${
                              item.attributes.inventory_vehicles?.data.length <
                              1
                                ? styles.checkbox_link_disabled
                                : ''
                            }
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
                            {baseUrl == '/vehicles-we-armor'
                              ? item.attributes.title.replace('Armored', '')
                              : item.attributes.title}
                          </span>
                        </Link>
                      );
                    } else {
                      return (
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
                      );
                    }
                  })}

                  {filter == 'type' && (
                    <Link
                      href={baseUrl}
                      // scroll={false}
                      className={`${styles.checkbox_link} ${
                        'available-now' === currentSlug
                          ? styles.selected_filter
                          : ''
                      }`}
                      onClick={openFilters}
                      key="all"
                    >
                      <span className={`${styles.checkbox_span}`}>All</span>
                    </Link>
                  )}
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
