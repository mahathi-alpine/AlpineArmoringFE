// import { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import styles from './Search.module.scss';
import SearchBox from './SearchBox';
import SearchHits from './SearchHits';
import { useRef } from 'react';
import { useOutsideClick } from 'hooks/useOutsideClick';
// const searchClient = algoliasearch(
//   'BWXO30HFNW',
//   'd152ea74492bb9a3eea96657ac73f8b8'
// );

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
);

export default function Search({ openSearchPopup }) {
  const searchInnerRef = useRef(null);

  useOutsideClick(searchInnerRef, () => {
    openSearchPopup(false);
    document.body.style.marginRight = '0';
    document.body.classList.remove('no-scroll');
  });

  // const [searchClient, setSearchClient] = useState(null);

  // useEffect(() => {
  //   setSearchClient(algoliasearch(
  //     process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
  //     process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY,
  //   ));
  // }, []);

  // if (!searchClient) {
  //   return null;
  // }

  return (
    <div className={`${styles.search}`}>
      <InstantSearch searchClient={searchClient} indexName="dev_alpine">
        <div className={`${styles.search_inner}`} ref={searchInnerRef}>
          <SearchBox />
          <SearchHits />
        </div>
      </InstantSearch>
    </div>
  );
}
