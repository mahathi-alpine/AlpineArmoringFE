import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch';
import { useState } from 'react';
// import styles from './Search.module.css';

const ALGOLIA_APP_ID = 'BWXO30HFNW';
const ALGOLIA_SEARCH_API_KEY = 'd152ea74492bb9a3eea96657ac73f8b8';
const ALGOLIA_INDEX_NAME = 'dev_alpine';

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

function Search() {
  const [query, setQuery] = useState('');

  const handleSearch = (
    event: React.SyntheticEvent<HTMLInputElement, Event>
  ) => {
    setQuery(event.currentTarget.value);
  };

  return (
    // Pass our index name and the search client into the InstantSearch components parameters
    <InstantSearch
      indexName={ALGOLIA_INDEX_NAME}
      searchClient={algoliaClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <div className="search_input">
        <SearchBox onChange={handleSearch} />
      </div>

      {query && (
        <div className="search_results">
          <Hits hitComponent={Hit} />
        </div>
      )}
    </InstantSearch>
  );
}
// Define our result template here
function Hit({ hit }: { hit: any }) {
  return (
    <div className="search_hit">
      <a href={hit.url}>{hit.title}</a>
    </div>
  );
}

export default Search;
