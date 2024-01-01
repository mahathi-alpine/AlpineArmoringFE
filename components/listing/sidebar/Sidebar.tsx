import styles from './Sidebar.module.scss';
import FiltersIcon from 'components/icons/Filters';
import ChevronIcon from 'components/icons/Chevron';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

type SidebarProps = {
  props: any;
  plain?: any;
};

const Sidebar = ({ props, plain }: SidebarProps) => {
  // console.log(props)
  // return null;
  const [activeFilterItem, setActiveFilterItem] = useState('default');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        // setActiveFilterItem('type');
      } else {
        setActiveFilterItem('default');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activateFilterItem = (slug) => {
    setActiveFilterItem((current) => (current === slug ? null : slug));
  };

  const openFilters = () => {
    setFiltersOpen((filtersOpen) => {
      const newValue = !filtersOpen;
      if (newValue) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
      return newValue;
    });
  };

  const router = useRouter();
  const currentFilterCategory = router.query.category;
  const currentFilterMake = router.query.make;

  const handleClearFilters = () => {
    router.push(
      {
        pathname: router.pathname,
      },
      undefined,
      { scroll: false }
    );
  };

  const applyFilter = (item, paramKey) => {
    const newQuery = { ...router.query };

    // Always remove the vehicles_we_armor parameter
    delete newQuery['vehicles_we_armor'];

    if (newQuery[paramKey] === item) {
      // If the clicked item is the same as the current value, remove it
      delete newQuery[paramKey];
    } else {
      // Otherwise, update the query parameter
      newQuery[paramKey] = item;
    }

    if (window.innerWidth < 768) {
      openFilters();
    } else {
      activateFilterItem('default');
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

        <div
          className={`${styles.sidebar_clear}`}
          onClick={handleClearFilters}
          style={{ display: 'none' }}
        >
          Clear all filters
        </div>
      </div>

      <div
        className={`
        ${styles.sidebar_wrap}
        ${filtersOpen ? styles.sidebar_wrap_open : ''}
      `}
      >
        <div className={`${styles.sidebar_wrap_inner}`}>
          <div className={`${styles.sidebar_wrap_close}`} onClick={openFilters}>
            X
          </div>

          <div className={`${styles.sidebar_wrap_top}`}>
            <div className={`${styles.sidebar_wrap_top_title}`}>
              Filters
              <FiltersIcon />
            </div>
            <div
              className={`${styles.sidebar_clear}`}
              onClick={handleClearFilters}
            >
              Clear all filters
            </div>
          </div>

          <div
            className={`
            ${styles.sidebar_column}
            ${'type' === activeFilterItem ? styles.sidebar_column_active : ''}
          `}
          >
            <h4
              className={`${styles.sidebar_column_title}`}
              onClick={() => activateFilterItem('type')}
            >
              <span>Type</span>
              <ChevronIcon className={`${styles.sidebar_column_chevron}`} />
            </h4>

            <div className={`${styles.sidebar_column_wrap}`}>
              {props.type.map((item) => (
                <div
                  className={`${styles.checkbox_link} ${
                    item.attributes.slug === currentFilterCategory
                      ? styles.selected_filter
                      : ''
                  }`}
                  onClick={() => applyFilter(item.attributes.slug, 'category')}
                  key={item.id}
                >
                  <span className={`${styles.checkbox_span}`}>
                    {item.attributes.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {props.make ? (
            <div
              className={`
              ${styles.sidebar_column}
              ${'make' === activeFilterItem ? styles.sidebar_column_active : ''}
            `}
            >
              <h4
                className={`${styles.sidebar_column_title}`}
                onClick={() => activateFilterItem('make')}
              >
                Make
                <ChevronIcon className={`${styles.sidebar_column_chevron}`} />
              </h4>

              <div className={`${styles.sidebar_column_wrap}`}>
                {props.make.map((item) => (
                  <div
                    className={`${styles.checkbox_link} ${
                      item.attributes.slug === currentFilterMake
                        ? styles.selected_filter
                        : ''
                    }`}
                    onClick={() => applyFilter(item.attributes.slug, 'make')}
                    key={item.id}
                  >
                    <span className={`${styles.checkbox_span}`}>
                      {item.attributes.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
