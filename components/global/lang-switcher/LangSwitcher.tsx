import { useRouter } from 'next/router';
import styles from './LangSwitcher.module.scss';
import { routeTranslations } from 'hooks/routes';

export const LanguageSwitcher = ({ className }: { className?: string }) => {
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
    } else if (pathname.includes('news')) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/blog?pagination[limit]=-1&populate=localizations`;
    } else if (pathname.includes('available-now')) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/inventories?pagination[limit]=-1&populate=localizations`;
    }

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

  const switchLanguage = async (langCode) => {
    if (query.slug) {
      const slugMappings = await getLocalizedSlugs();
      const localizedSlug = slugMappings[query.slug as string] || query.slug;

      router.push(
        {
          pathname,
          query: { ...query, slug: localizedSlug },
        },
        undefined,
        { locale: langCode }
      );
    } else {
      const currentRoute = Object.entries(routeTranslations).find(
        ([, paths]) => {
          const pathToCheck = asPath.replace(/^\/[a-z]{2}\//, '/');
          const matches = Object.values(paths).some(
            (path) => pathToCheck === path
          );
          return matches;
        }
      );

      if (currentRoute) {
        const translatedPath = routeTranslations[currentRoute[0]][langCode];
        await router.push(translatedPath, undefined, { locale: langCode });
      } else {
        await router.push(pathname, undefined, { locale: langCode });
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
