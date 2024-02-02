import styles from './Sidebar.module.scss';
import Link from 'next/link';
import FiltersIcon from 'components/icons/Filters';
import ChevronIcon from 'components/icons/Chevron';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from 'hooks/useIsMobile';
import SearchIcon from 'components/icons/Search';

type SidebarProps = {
  props: any;
  plain?: boolean;
};

const Sidebar = ({ props, plain }: SidebarProps) => {
  const [query, setQuery] = useState('');
  const handleSearch = async () => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, q: query },
      },
      undefined,
      { scroll: false }
    );
  };

  const [activeFilterItem, setActiveFilterItem] = useState('default');
  const [activeFilterTitles, setActiveFilterTitles] = useState({
    make: 'Select',
    type: 'Select',
  });

  const [filtersOpen, setFiltersOpen] = useState(false);

  const activateFilterItem = (slug) => {
    setActiveFilterItem((current) => (current === slug ? null : slug));
  };

  const isMobile = useIsMobile();
  const openFilters = () => {
    if (isMobile) {
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
  };

  const router = useRouter();
  const currentFilterMake = router.query.make;

  const pathParts = router.pathname.split('/');
  const baseUrl = pathParts.slice(0, 2).join('/');

  const currentSlug = router.asPath.split('/').pop();

  const handleClearFilters = () => {
    setQuery('');
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
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setActiveFilterItem('default');
        }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, []);

  return (
    <div
      className={`${styles.sidebar}
      ${plain ? `${styles.sidebar_plain}` : ''}
    `}
    >
      <div className={`${styles.sidebar_top}`}>
        <div className={`${styles.sidebar_top_title}`} onClick={openFilters}>
          Filters
          <FiltersIcon />
        </div>

        {Object.prototype.hasOwnProperty.call(router.query, 'make') &&
          Object.keys(router.query).length > 0 && (
            <div
              className={`${styles.sidebar_clear} bold`}
              onClick={handleClearFilters}
            >
              Clear all filters
            </div>
          )}
      </div>

      <div
        ref={sidebarRef}
        className={`
          ${styles.sidebar_wrap}
          ${filtersOpen ? styles.sidebar_wrap_open : ''}
        `}
      >
        <div className={`${styles.sidebar_wrap_inner}`}>
          <div className={`${styles.sidebar_wrap_top}`}>
            <div className={`${styles.sidebar_wrap_top_title}`}>
              <div
                className={`${styles.sidebar_wrap_close}`}
                onClick={openFilters}
              >
                X
              </div>
              Filters
            </div>

            {Object.keys(router.query).length > 0 && (
              <div
                className={`${styles.sidebar_clear}`}
                onClick={handleClearFilters}
              >
                Clear all filters
              </div>
            )}
          </div>

          <div className={`${styles.sidebar_search}`}>
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
              className={`${styles.sidebar_search_icon}`}
            >
              <SearchIcon />
            </div>
          </div>

          {Object.keys(props).map((filter) => {
            return (
              <div
                key={filter}
                className={`
                  ${styles.sidebar_item}
                  ${
                    filter === activeFilterItem
                      ? styles.sidebar_item_active
                      : ''
                  }
                `}
                onClick={() => activateFilterItem(filter)}
              >
                <h4 className={`${styles.sidebar_item_title}`}>
                  {filter}
                  <ChevronIcon className={`${styles.sidebar_item_chevron}`} />
                </h4>
                <span className={`${styles.sidebar_item_choice}`}>
                  {filter == 'make'
                    ? activeFilterTitles.make
                    : activeFilterTitles.type.replace('Armored', '')}
                </span>

                <div className={`${styles.sidebar_item_wrap}`}>
                  {props[filter].map((item) => {
                    if (filter == 'type') {
                      const newUrl = `${baseUrl}/type/${item.attributes.slug}${
                        router.asPath.includes('?')
                          ? '?' + router.asPath.split('?')[1]
                          : ''
                      }`;
                      return (
                        <Link
                          href={newUrl}
                          scroll={false}
                          className={`${styles.checkbox_link} ${
                            item.attributes.slug ===
                            currentSlug.split('/').pop().split('?')[0]
                              ? styles.selected_filter
                              : ''
                          }`}
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
                      scroll={false}
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

export default Sidebar;
