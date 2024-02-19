import { useEffect, useRef } from 'react';

const useIntersectionObserver = (options = {}) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
      ...options,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
          observerRef.current.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

  return observerRef;
};

export default useIntersectionObserver;
