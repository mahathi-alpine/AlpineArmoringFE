import { useRouter } from 'next/router';
import styles from './LangSwitcher.module.scss';
import { routeTranslations } from 'hooks/routes';
import useLocale from 'hooks/useLocale';
import routes from 'routes';

const sanitizePath = (path: string): string => {
  if (!path) return '';

  return (
    path
      // Remove duplicate domain patterns
      .replace(/\/www\.alpineco\.com\/www\.alpineco\.com/gi, '')
      .replace(/\/alpineco\.com\/alpineco\.com/gi, '')
      .replace(/\/www\.alpineco\.com\/alpineco\.com/gi, '')
      .replace(/\/alpineco\.com\/www\.alpineco\.com/gi, '')
      // Remove domain prefixes that shouldn't be in paths
      .replace(/^\/www\.alpineco\.com/, '')
      .replace(/^\/alpineco\.com/, '')
      // Clean up multiple slashes
      .replace(/\/+/g, '/')
      // Ensure proper leading slash
      .replace(/^(?!\/)(.+)/, '/$1')
  );
};

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { lang } = useLocale();
  const router = useRouter();
  const { pathname, query, asPath } = router;

  const languages = router.locales.map((locale) => ({
    code: locale,
    label: locale.toUpperCase(),
  }));

  const currentLanguage =
    languages.find((lang) => lang.code === router.locale) || languages[0];

  interface SlugMappings {
    [key: string]: string;
  }

  async function getLocalizedSlugs(): Promise<SlugMappings> {
    const pathname = router.pathname;
    let apiUrl;

    if (pathname.includes('vehicles-we-armor')) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles-we-armors?pagination[limit]=-1&populate=localizations`;
    } else if (
      pathname.includes('available-now') ||
      pathname.includes('armored-vehicles-for-sale') ||
      pathname.includes('rental-vehicles') ||
      pathname.includes('vehiculos-de-renta')
    ) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/inventories?pagination[limit]=-1&populate=localizations`;
    } else if (pathname.includes('author')) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/authors?pagination[limit]=-1&populate=localizations`;
    } else if (pathname.includes('locations-we-serve')) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/articles?pagination[limit]=-1&populate=localizations`;
    } else if (pathname.includes('blog')) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/blog-evergreens?pagination[limit]=-1&populate=localizations`;
    } else if (pathname.includes('news')) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?pagination[limit]=-1&populate=localizations`;
    } else if (pathname.includes('faqs')) {
      // Check if it's a category or a knowledge base item
      const currentSlug = router.query.slug as string;

      // First try knowledge base categories
      const categoryApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/knowledge-base-categories?pagination[limit]=-1&populate=localizations`;
      const categoryResponse = await fetch(categoryApiUrl);
      const categoryData = await categoryResponse.json();

      // Check if current slug exists in categories
      const categoryExists = categoryData?.data?.some(
        (item) =>
          item?.attributes?.slug === currentSlug ||
          item?.attributes?.localizations?.data?.[0]?.attributes?.slug ===
            currentSlug
      );

      if (categoryExists) {
        // It's a category, use the category API
        apiUrl = categoryApiUrl;
      } else {
        // It's a knowledge base item, use the original API
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/knowledge-bases?pagination[limit]=-1&populate=localizations`;
      }
    }

    if (!apiUrl) return {};

    const response = await fetch(apiUrl);
    const data = await response.json();

    const slugMappings = {};
    if (data?.data) {
      data.data.forEach((item) => {
        if (item?.attributes) {
          const enSlug = item.attributes.slug;
          const esSlug =
            item.attributes.localizations?.data?.[0]?.attributes?.slug;

          if (enSlug && esSlug) {
            slugMappings[enSlug] = esSlug;
            slugMappings[esSlug] = enSlug;
          }
        }
      });
    }

    return slugMappings;
  }

  // Helper to extract and preserve query parameters
  const extractQueryParams = (path) => {
    // First sanitize the path to remove any domain duplications
    const sanitizedPath = sanitizePath(normalizeUrl(path));

    const [pathPart, queryPart] = sanitizedPath.split('?');
    if (!queryPart) return { path: pathPart, queryString: '' };

    return {
      path: pathPart,
      queryString: `?${queryPart}`,
    };
  };

  const normalizePath = (path) => {
    // First sanitize to remove domain duplications
    const sanitized = sanitizePath(path);

    // Then remove domain if present in the path
    const domainRegex = new RegExp(
      `^(https?://)?(www\\.)?${window.location.hostname.replace('.', '\\.')}`,
      'i'
    );
    return sanitized.replace(domainRegex, '');
  };

  const normalizeUrl = (url) => {
    if (!url) return '';
    // Remove any protocol and domain part if present
    return url.replace(/^(https?:\/\/)?(www\.)?alpineco\.com/i, '');
  };

  const switchLanguage = async (langCode) => {
    const { path: rawPath, queryString } = extractQueryParams(asPath);
    const cleanPath = sanitizePath(normalizePath(rawPath));

    // Handle main listing page
    if (
      cleanPath.includes('/armored-vehicles-for-sale') ||
      cleanPath.includes('/vehiculos-blindados-en-venta')
    ) {
      const newPath =
        langCode === 'es'
          ? '/vehiculos-blindados-en-venta'
          : '/armored-vehicles-for-sale';
      await router.push(`${newPath}${queryString}`, undefined, {
        locale: langCode,
      });
      return;
    }

    const isIndividualVehiclePage =
      (cleanPath.includes('/available-now/') &&
        !cleanPath.includes('/available-now/type/')) ||
      (cleanPath.includes('/disponible-ahora/') &&
        !cleanPath.includes('/disponible-ahora/tipo/'));

    if (isIndividualVehiclePage) {
      const segments = cleanPath.split('/').filter((segment) => segment);
      const vehicleSlug = segments[segments.length - 1];

      const newPath =
        langCode === 'es'
          ? `/disponible-ahora/${vehicleSlug}`
          : `/available-now/${vehicleSlug}`;

      await router.push(`${newPath}${queryString}`, undefined, {
        locale: langCode,
      });

      return;
    }

    // Handle category pages with type parameter
    const hasTypeParameter = cleanPath.includes(lang.type);
    if (hasTypeParameter) {
      const segments = cleanPath.split('/').filter((segment) => segment);
      const isInventoryPage = segments.some(
        (s) => s === 'available-now' || s === 'disponible-ahora'
      );
      const isVehiclesWeArmorPage = segments.some(
        (s) => s === lang.vehiclesWeArmorURL.replace(/^\//, '')
      );

      if (isInventoryPage || isVehiclesWeArmorPage) {
        const routeKey = isInventoryPage ? 'inventory' : 'vehiclesWeArmor';
        const routeConfig = routes[routeKey];

        if (!routeConfig) return;

        // Find type slug
        const typePathIndex = segments.findIndex(
          (s) =>
            s === 'type' ||
            s === 'tipo' ||
            s === routeConfig.typePath.en ||
            s === routeConfig.typePath.es
        );
        if (typePathIndex === -1 || typePathIndex + 1 >= segments.length)
          return;

        const currentTypeValue = segments[typePathIndex + 1];
        const typeKey = Object.keys(routeConfig.types).find(
          (key) =>
            routeConfig.types[key].en === currentTypeValue ||
            routeConfig.types[key].es === currentTypeValue
        );

        if (!typeKey) return;

        // Build new path
        let newPath;
        if (isInventoryPage) {
          // Use old available-now structure for inventory categories
          const basePath =
            langCode === 'es' ? '/disponible-ahora' : '/available-now';
          const typePath = langCode === 'es' ? 'tipo' : 'type';
          newPath = `${basePath}/${typePath}/${routeConfig.types[typeKey][langCode]}`;
        } else {
          // Use routes config for vehicles-we-armor
          const translatedBasePath = sanitizePath(
            normalizeUrl(routeConfig.paths[langCode])
          );
          const translatedTypePath = routeConfig.typePath[langCode];
          newPath = `${translatedBasePath}/${translatedTypePath}/${routeConfig.types[typeKey][langCode]}`;
        }

        await router.push(`${newPath}${queryString}`, undefined, {
          locale: langCode,
        });
        return;
      }
    }

    // Handle slug-based pages
    if (query.slug) {
      const slugMappings = await getLocalizedSlugs();
      const localizedSlug = slugMappings[query.slug as string] || query.slug;

      const currentRoute = Object.entries(routeTranslations).find(
        ([, paths]) => {
          const pathToCheck = pathname.replace(/\/\[.*\]$/, '');
          return Object.values(paths).some((path) => path === pathToCheck);
        }
      );

      if (currentRoute) {
        const translatedBasePath = sanitizePath(
          normalizeUrl(routeTranslations[currentRoute[0]][langCode])
        );
        const queryParams = { ...query };
        delete queryParams.slug;

        let queryStr = '';
        if (Object.keys(queryParams).length > 0) {
          queryStr =
            '?' +
            new URLSearchParams(
              queryParams as Record<string, string>
            ).toString();
        }

        const fullPath = `${translatedBasePath}/${localizedSlug}${queryStr}`;
        await router.push(fullPath, undefined, { locale: langCode });
      } else {
        router.push(
          {
            pathname,
            query: { ...query, slug: localizedSlug },
          },
          undefined,
          { locale: langCode }
        );
      }
    } else {
      // Handle other route translations
      const currentRoute = Object.entries(routeTranslations).find(
        ([, paths]) => {
          const pathToCheck = cleanPath.replace(/^\/[a-z]{2}\//, '/');
          return Object.values(paths).some((path) => path === pathToCheck);
        }
      );

      if (currentRoute) {
        const translatedPath = sanitizePath(
          normalizeUrl(routeTranslations[currentRoute[0]][langCode])
        );
        await router.push(`${translatedPath}${queryString}`, undefined, {
          locale: langCode,
        });
      } else {
        await router.push(
          {
            pathname,
            search: queryString,
          },
          undefined,
          { locale: langCode }
        );
      }
    }
  };

  return (
    <div className={`${className} ${styles.langSwitcher}`}>
      <button
        className={`${styles.langSwitcher_flag} ${styles[`langSwitcher_flag_${currentLanguage.label}`]}`}
      >
        <span>{currentLanguage.label}</span>
      </button>

      <ul className={styles.langSwitcher_wrap}>
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              onClick={() => switchLanguage(lang.code)}
              className={`${styles.langSwitcher_flag} ${styles[`langSwitcher_flag_${lang.label}`]}`}
            >
              <span className={styles.langSwitcher_name}>{lang.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
