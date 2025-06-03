import { connectStateResults } from 'react-instantsearch-dom';
import Link from 'next/link';
import useLocale from 'hooks/useLocale';

function SearchHits({ searchState, searchResults }) {
  const { lang } = useLocale();

  const validQuery = searchState.query?.length >= 1;

  // Function to get the correct URL path based on category and language
  function getLocalizedPath(category, slug) {
    if (!category || !slug) return '/';

    // Use localized URL paths from the language file
    switch (category) {
      case 'available-now':
        return `${'/' + lang.availableNowURL || '/available-now'}/${slug}`;
      case 'vehicles-we-armor':
        return `${lang.vehiclesWeArmorURL || '/vehicles-we-armor'}/${slug}`;
      case 'news':
        return `${lang.newsURL || '/news'}/${slug}`;
      case 'blogs':
        return `${lang.blogsURL || '/blog'}/${slug}`;
      case 'faqs':
        return `${lang.faqsURL || '/faqs'}/${slug}`;
      default:
        return `/${slug}`;
    }
  }

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
      {searchResults?.hits.length === 0 && <div>{lang.noResultsFound}</div>}
      {searchResults?.hits.length > 0 &&
        searchResults.hits.map((hit) => (
          <div key={hit.objectID}>
            {hit.category === 'url' ? (
              <a href={hit.slug} target="_blank" rel="noopener noreferrer">
                <span className="search_categories">PDF:</span>
                <span>{hit.title}</span>
              </a>
            ) : (
              <Link href={getLocalizedPath(hit.category, hit.slug)}>
                <span className="search_categories">
                  {formatString(hit.category)}:
                </span>
                <span>{hit.title.replace(/Armored /g, () => ' ')}</span>
              </Link>
            )}
          </div>
        ))}
    </div>
  ) : null;
}
export default connectStateResults(SearchHits);
