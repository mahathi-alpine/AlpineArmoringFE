import styles from './Sidebar.module.scss';
import Image from 'next/image';
import filtersIcon from '../../public/assets/filters.svg';
import { useRouter } from 'next/router';

const Sidebar = ({ props, error }) => {
  const router = useRouter();

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
        <div 
          className={`${styles.sidebar_clear}`} 
          onClick={() => router.push({ pathname: '/inventory' })}
        >Clear all filters</div>
      </div>

      <button onClick={() => router.push({ pathname: '/inventory', query: { category: 'suvs' } })}>SUVs</button>
      <button onClick={() => router.push({ pathname: '/inventory', query: { category: 'sedans' } })}>Sedans</button>

    </div>
  );
};

export default Sidebar;