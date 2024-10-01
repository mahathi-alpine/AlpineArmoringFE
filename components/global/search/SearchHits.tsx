import { connectStateResults } from 'react-instantsearch-dom';
import Link from 'next/link';

function SearchHits({ searchState, searchResults }) {
  const validQuery = searchState.query?.length >= 1;

  function formatString(input) {
    const words = input.split('-');

    let formatted = '';
    for (let i = 0; i < words.length; i++) {
      if (i > 0 && i < words.length - 1) {
        formatted += words[i] + ' ';
      } else if (i === 0 || i === words.length - 1) {
        formatted += capitalizeWord(words[i]) + ' ';
      }
    }

    return formatted.trim();
  }

  function capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return searchState.query && validQuery ? (
    <div className={'search-hits'}>
      {searchResults?.hits.length === 0 && <div>No results found!</div>}
      {searchResults?.hits.length > 0 &&
        searchResults.hits.map((hit) => (
          <div key={hit.objectID}>
            <Link
              href={`${hit.category && ['available-now', 'vehicles-we-armor', 'news'].includes(hit.category) ? `/${hit.category}` : ''}/${hit.slug}`}
            >
              <span className="search_categories">
                {formatString(hit.category)}:
              </span>
              <span>{hit.title.replace(/Armored /g, () => ' ')}</span>
            </Link>
          </div>
        ))}
    </div>
  ) : null;
}
export default connectStateResults(SearchHits);
