import styles from './Sidebar.module.scss';
import Image from 'next/image';
// import filtersIcon from '../../public/assets/filters.svg';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Sidebar = (props) => {
  const router = useRouter();
  const currentFilter = router.query.category;

  const handleClearFilters = () => {
    const { category, ...otherQueryParams } = router.query;

    router.push({
      pathname: router.pathname,
      query: otherQueryParams,
    }, undefined, { scroll: false });
  }

  return (
    <div className={`${styles.sidebar}`}>
      <div className={`${styles.sidebar_top}`}>
        <div className={`${styles.sidebar_top_title}`}>
          Filters
          <Image
            src={'/assets/filters.svg'}
            width={21}
            height={12}
            alt="Alpine Armoring Filters"
          />
        </div>

        <div
          className={`${styles.sidebar_clear}`}
          onClick={handleClearFilters}
        >
          Clear all filters
        </div>
      </div>

      <div className={`${styles.sidebar_column}`}>
        <h4 className={`${styles.sidebar_column_title}`}>Type</h4>
        {/* <form> */}
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
              {/* <input type="radio" name="radio" className={`${styles.checkbox_input}`} /> */}
              <span className={`${styles.checkbox_span}`}>{item.attributes.title}</span>
           
          </Link>
          ))}
        {/* </form> */}

        {/* {props.props?.data.map((item) => (
          <Link
            className={`${styles.sidebar_column_item} ${
              item.attributes.slug === currentFilter
                ? styles.selected_filter
                : ''
            }`}
            href={`/inventory?category=${item.attributes.slug}`}
            scroll={false}
            key={item.id}
          >
            <span className={`${styles.sidebar_column_item_checkbox}`}></span>
            {item.attributes.heading}
          </Link>
        ))} */}
      </div>
    </div>
  );
};

export default Sidebar;
