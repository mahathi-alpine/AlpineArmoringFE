import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import SearchBox from './SearchBox';
import SearchHits from './SearchHits';

// const searchClient = algoliasearch(
//     process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
//     process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY,
// );
const searchClient = algoliasearch(
  'BWXO30HFNW',
  'd152ea74492bb9a3eea96657ac73f8b8'
);

export default function Search() {
  return (
    <div className={'algolia-search'}>
      <InstantSearch searchClient={searchClient} indexName="dev_alpine">
        <SearchBox />
        <SearchHits />
      </InstantSearch>
    </div>
  );
}
