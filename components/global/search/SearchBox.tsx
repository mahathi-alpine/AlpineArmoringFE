import { connectSearchBox } from 'react-instantsearch-dom';
import useLocale from 'hooks/useLocale';

function SearchBox({ refine }) {
  const { lang } = useLocale();

  return (
    <input
      className="search-box"
      type="search"
      placeholder={lang.searchPlaceholder}
      onChange={(e) => refine(e.currentTarget.value)}
    />
  );
}
export default connectSearchBox(SearchBox);
