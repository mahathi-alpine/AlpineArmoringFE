import styles from './Sidebar.module.scss';
import Image from 'next/image';
import filtersIcon from '../../public/assets/filters.svg';

const Sidebar = ({ props, error }) => {
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
        <div className={`${styles.sidebar_clear}`}>Clear all filters</div>
      </div>
    </div>
  );
};

export default Sidebar;