import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Hook to handle animations triggered by IntersectionObserver
 * @param {Object} options - Configuration options
 * @param {string} options.selector - CSS selector for elements to observe (default: '.observe')
 * @param {number} options.threshold - Intersection threshold (default: 0.2)
 * @param {string} options.className - Class to add when element is in view (default: 'in-view')
 * @param {string} options.defaultLocale - Default locale (default: 'en')
 * @param {number} options.delayMs - Delay in milliseconds for non-default locales (default: 100)
 * @param {any[]} options.dependencies - Additional dependencies to trigger re-initialization
 */
const useAnimationObserver = ({
  selector = '.observe',
  threshold = 0.2,
  className = 'in-view',
  defaultLocale = 'en',
  delayMs = 100,
  dependencies = [],
} = {}) => {
  const router = useRouter();
  const isDefaultLanguage = router.locale === defaultLocale;

  useEffect(() => {
    // For default language, use the original behavior without delays
    if (isDefaultLanguage) {
      const targets = document.querySelectorAll(selector);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.toggle(className, entry.isIntersecting);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: threshold,
        }
      );

      targets.forEach((item) => observer.observe(item));

      return () => {
        targets.forEach((item) => observer.unobserve(item));
        observer.disconnect();
      };
    }
    // For non-default languages, use the delay and reset approach
    else {
      // Short delay to ensure the DOM is updated with new content
      const animationTimeout = setTimeout(() => {
        const targets = document.querySelectorAll(selector);

        // Reset any existing in-view classes first to ensure animations replay
        targets.forEach((item) => {
          item.classList.remove(className);
        });

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.toggle(className, entry.isIntersecting);
              }
            });
          },
          {
            root: null,
            rootMargin: '0px',
            threshold: threshold,
          }
        );

        targets.forEach((item) => observer.observe(item));

        return () => {
          targets.forEach((item) => observer.unobserve(item));
          observer.disconnect();
        };
      }, delayMs);

      return () => {
        clearTimeout(animationTimeout);
      };
    }
    // Include router.locale, isDefaultLanguage, and all the configuration options as dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.locale,
    isDefaultLanguage,
    selector,
    threshold,
    className,
    delayMs,
    ...dependencies,
  ]);
};

export default useAnimationObserver;
