import { useEffect } from 'react';

export const useOutsideClick = (ref, callback, excludeSelectors = []) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        const isExcluded = excludeSelectors.some((selector) =>
          event.target.closest(selector)
        );
        if (!isExcluded) {
          callback();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, excludeSelectors]);
};
