import styles from './Sidebar.module.scss';
import Image from 'next/image';
import filtersIcon from '../../public/assets/filters.svg';
import { useRouter } from 'next/router';
import Link from "next/link";


const Sidebar = ( props ) => {
  // console.log(props)
  const router = useRouter();
  const currentFilter = router.query.category;

  return (
    <div className={`${styles.sidebar}`}>
      <div className={`${styles.sidebar_top}`}>
        <div className={`${styles.sidebar_top_title}`}>
          Filters
          <Image
            src={filtersIcon}
            width={21}                    
            height={12}
            alt="Alpine Armoring Filters"
          />
        </div>
        
        <Link 
          className={`${styles.sidebar_clear}`} 
          href='/inventory'
          scroll={false}
        >
          Clear all filters
        </Link>
      </div>

      <div className={`${styles.sidebar_column}`}>
        <h4 className={`${styles.sidebar_column_title}`}>Type</h4>        
       
        {props.props?.data.map((item) => (
          <Link 
            className={`${styles.sidebar_column_item} ${item.attributes.slug === currentFilter ? styles.selected_filter : ''}`} 
            href={`/inventory?category=${item.attributes.slug}`}
            scroll={false}
            key={item.id}
          >
            <span className={`${styles.sidebar_column_item_checkbox}`}></span>
            { item.attributes.heading }
          </Link>
          // <div 
          //   className={`${styles.sidebar_column_item} ${item.attributes.slug === currentFilter ? styles.selected_filter : ''}`} 
          //   key={item.id}
          //   onClick={() => router.push({ pathname: '/inventory', query: { category: item.attributes.slug } })}
          // >
          //   <span className={`${styles.sidebar_column_item_checkbox}`}></span>
          //   { item.attributes.heading }
          // </div>
        ))}  
      </div>
    </div>
  );
};

export default Sidebar;