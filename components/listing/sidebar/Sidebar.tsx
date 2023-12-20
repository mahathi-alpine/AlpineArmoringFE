import styles from './Sidebar.module.scss';
import FiltersIcon from 'components/icons/Filters';
import ChevronIcon from 'components/icons/Chevron';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

const Sidebar = (props) => {
  const [activeFilterItem, setactiveFilterItem] = useState('type');
  const [filtersOpen, setFiltersOpen] = useState(false);  
  
  const activateFilterItem = (slug) => {
    setactiveFilterItem(current => current === slug ? null : slug);
  };

  const openFilters = () => {
    // setFiltersOpen(filtersOpen => !filtersOpen);
    setFiltersOpen(filtersOpen => {
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
  const currentFilter = router.query.category;

  const handleClearFilters = () => {
    router.push({
      pathname: router.pathname,
    }, undefined, { scroll: false });
  }

  return (
    <div className={`${styles.sidebar}`}>
      <div className={`${styles.sidebar_top}`}>
        <div 
          className={`${styles.sidebar_top_title}`}
          onClick={openFilters}
        >
          Filters
          <FiltersIcon className={`mobile-only`}/>
        </div>

        <div
          className={`${styles.sidebar_clear}`}
          onClick={handleClearFilters}
          style={{display: 'none'}}
        >
          Clear all filters
        </div>
      </div>

      <div className={`
        ${styles.sidebar_wrap}
        ${filtersOpen ? styles.sidebar_wrap_open : ''}
      `}>
        <div className={`${styles.sidebar_wrap_inner}`}>
          
          <div 
            className={`${styles.sidebar_wrap_close} mobile-only`}
            onClick={openFilters}
          >X</div>

          <div className={`${styles.sidebar_wrap_top} mobile-only`}>
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

          <div className={`
            ${styles.sidebar_column}
            ${'type' === activeFilterItem ? styles.sidebar_column_active : ''}
          `}>

            <h4 
              className={`${styles.sidebar_column_title}`}
              onClick={() => activateFilterItem('type')}
            > 
              Type
              <ChevronIcon className={`${styles.sidebar_column_chevron} mobile-only`} />
            </h4>

            <div className={`${styles.sidebar_column_wrap}`}>
              {props.props?.data.map((item) => (
                <Link
                  className={`${styles.checkbox_link} ${
                    item.attributes.slug === currentFilter
                      ? styles.selected_filter
                      : ''
                  }`}
                  href={`?category=${item.attributes.slug}`}
                  scroll={false}
                  key={item.id}
                >
                  <span className={`${styles.checkbox_span}`}>{item.attributes.title}</span>          
                </Link>
              ))}
            </div>
          </div>
          <div className={`
            ${styles.sidebar_column}
            ${'model' === activeFilterItem ? styles.sidebar_column_active : ''}
          `}>

            <h4 
              className={`${styles.sidebar_column_title}`}
              onClick={() => activateFilterItem('model')}
            > 
              Model
              <ChevronIcon className={`${styles.sidebar_column_chevron} mobile-only`} />
            </h4>

            <div className={`${styles.sidebar_column_wrap}`}>
              {props.props?.data.map((item) => (
                <Link
                  className={`${styles.checkbox_link} ${
                    item.attributes.slug === currentFilter
                      ? styles.selected_filter
                      : ''
                  }`}
                  href={`?category=${item.attributes.slug}`}
                  scroll={false}
                  key={item.id}
                >
                  <span className={`${styles.checkbox_span}`}>{item.attributes.title}</span>          
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
