import { useEffect, useRef } from 'react';

const useIntersectionObserver = () => {
  const observer = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // entry.target.classList.add('in-view');
              entry.target.classList.toggle('in-view', entry.isIntersecting);
              observer.current.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        }
      );
    }
  }, []);

  return observer;
};

export default useIntersectionObserver;
