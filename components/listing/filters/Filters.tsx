import styles from './Filters.module.scss';
import Link from 'next/link';
import FiltersIcon from 'components/icons/Filters';
import ChevronIcon from 'components/icons/Chevron';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useMemo } from 'react';
import SearchIcon from 'components/icons/Search';
import useLocale from 'hooks/useLocale';

type FiltersProps = {
  props: {
    type?: any[];
    make?: any[];
  };
  plain?: boolean;
};

const Filters = ({ props, plain }: FiltersProps) => {
  const { lang } = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilterItem, setActiveFilterItem] = useState('default');
  const [activeFilterTitles, setActiveFilterTitles] = useState({
    make: lang.select,
    type: lang.all,
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

  // Create a mapping from localized slugs to English slugs
  const localizedToEnglishMap = useMemo(
    () => ({
      [lang.sedansURL]: 'armored-sedans',
      [lang.suvsURL]: 'armored-suvs',
      [lang.pickupTrucksURL]: 'armored-pickup-trucks',
      [lang.vansURL]: 'armored-vans-and-buses',
      [lang.lawEnforcementURL]: 'armored-law-enforcement',
      [lang.citURL]: 'armored-cash-in-transit-cit',
      [lang.specialtyURL]: 'armored-specialty-vehicles',
      [lang.preOwnedURL]: 'armored-pre-owned',
    }),
    [lang]
  );

  // Create a reverse mapping from English slugs to localized slugs
  const englishToLocalizedMap = useMemo(
    () =>
      Object.entries(localizedToEnglishMap).reduce(
        (acc, [localized, english]) => {
          acc[english] = localized;
          return acc;
        },
        {}
      ),
    [localizedToEnglishMap]
  );

  const sortFilterItems = (items: any[]) => {
    return items.sort((a, b) => {
      const aHasInventory = a.attributes.inventory_vehicles?.data.length > 0;
      const bHasInventory = b.attributes.inventory_vehicles?.data.length > 0;

      return aHasInventory === bHasInventory ? 0 : aHasInventory ? -1 : 1;
    });
  };

  const filterMakesByType = useMemo(() => {
    const currentTypeSlug = router.query.type as string;

    if (!currentTypeSlug || !props.make) return props.make;

    const englishTypeSlug =
      localizedToEnglishMap[currentTypeSlug] || currentTypeSlug;

    return props.make.filter((make) => {
      return make.attributes.vehicles_we_armors?.data.some((vehicleArmor) =>
        vehicleArmor.attributes.category?.data.some((item) => {
          const catSlug = item.attributes?.slug;
          return catSlug === englishTypeSlug || catSlug === currentTypeSlug;
        })
      );
    });
  }, [router.query.type, props.make, lang, localizedToEnglishMap]);

  const filterTypesByMake = useMemo(() => {
    const currentMakeSlug = router.query.make as string;

    if (!currentMakeSlug || !props.type) return props.type;

    const selectedMake = props.make?.find(
      (make) =>
        make.attributes.slug.toLowerCase() === currentMakeSlug.toLowerCase()
    );

    if (!selectedMake) return props.type;

    const categorySlugs = selectedMake?.attributes.vehicles_we_armors?.data
      .flatMap((vehicle) =>
        vehicle.attributes.category?.data.map((cat) => {
          const slug = cat.attributes?.slug;
          return englishToLocalizedMap[slug] || slug;
        })
      )
      .filter(Boolean);

    return props.type.filter((type) => {
      const typeSlug = type.attributes.slug;
      return (
        categorySlugs?.includes(typeSlug) ||
        (localizedToEnglishMap[typeSlug] &&
          categorySlugs?.includes(localizedToEnglishMap[typeSlug]))
      );
    });
  }, [
    router.query.make,
    props.make,
    props.type,
    englishToLocalizedMap,
    localizedToEnglishMap,
  ]);

  useEffect(() => {
    if (router.isReady) {
      const q = Array.isArray(router.query.q)
        ? router.query.q.join('')
        : router.query.q || '';
      setQuery(q);
    }
  }, [router.isReady, router.query]);

  const handleSearch = async () => {
    setFiltersOpen(false);
    document.body.classList.remove('no-scroll');

    const cleanBaseUrl = getBaseUrl();

    const newQuery: { q?: string } = {};

    if (!query || query.trim().length === 0) {
      router.push(cleanBaseUrl, cleanBaseUrl, { locale: false });
    } else {
      newQuery.q = query;

      router.push(
        {
          pathname: cleanBaseUrl,
          query: newQuery,
        },
        undefined,
        { locale: false }
      );
    }
  };

  const activateFilterItem = (slug: string) => {
    setActiveFilterItem((current) => (current === slug ? null : slug));
  };

  const openFilters = (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth <= 1280) {
      setOpenFiltersClicked(true);
      setFiltersOpen((filtersOpen) => {
        const newValue = !filtersOpen;
        if (newValue) {
          document.body.classList.add('no-scroll');
        } else {
          document.body.classList.remove('no-scroll');
        }
        return newValue;
      });
    }
    if (e.target instanceof HTMLElement && e.target.innerHTML == lang.all) {
      activeFilterTitles.make = lang.select;
    }
  };

  const currentFilterMake = router.query.make;

  const getBaseUrl = () => {
    const pathParts = router.asPath.split('/');
    const baseUrl = pathParts.slice(0, 2).join('/');
    return baseUrl.split('?')[0];
  };

  const baseUrl = getBaseUrl();
  const currentSlug = router.asPath.split('/').pop()?.split('?')[0] || '';

  const handleClearFilters = () => {
    setQuery('');
    activeFilterTitles.make = lang.select;
    router.push(baseUrl, undefined, { scroll: false });
  };

  useEffect(() => {
    if (!router.isReady) return;

    setActiveFilterItem(window.innerWidth < 1280 ? 'type' : 'default');

    ['type', 'make'].forEach((paramKey) => {
      const { [paramKey]: item } = router.query;

      if (paramKey === 'make' && !item) {
        setActiveFilterTitles((prevTitles) => ({
          ...prevTitles,
          make: lang.select,
        }));
        return;
      }

      if (props[paramKey]) {
        const selectedItem = props[paramKey].find(
          (i) => i.attributes.slug === item
        );
        if (selectedItem) {
          setActiveFilterTitles((prevTitles) => ({
            ...prevTitles,
            [paramKey]: selectedItem.attributes.title,
          }));
        }
      }
    });
  }, [router.isReady, router.query, props]);

  const applyFilter = (item: string, paramKey: string) => {
    if (paramKey == 'make') {
      setFiltersOpen(false);
      document.body.classList.remove('no-scroll');
    }

    const cleanBaseUrl = getBaseUrl();

    const newQuery = { ...router.query };
    delete newQuery['vehicles_we_armor'];
    delete newQuery.q;
    delete newQuery.nextInternalLocale;
    delete newQuery['nxtPtype'];

    const currentValue = newQuery[paramKey];
    const isSameValue =
      paramKey === 'make'
        ? typeof currentValue === 'string' &&
          currentValue.toLowerCase() === item.toLowerCase()
        : currentValue === item;

    if (isSameValue) {
      return;
    }

    newQuery[paramKey] = paramKey === 'make' ? item.toLowerCase() : item;

    setActiveFilterItem(window.innerWidth >= 768 ? 'default' : 'type');

    const selectedItem = props[paramKey].find((i) =>
      paramKey === 'make'
        ? i.attributes.slug.toLowerCase() === item.toLowerCase()
        : i.attributes.slug === item
    );

    if (selectedItem) {
      setActiveFilterTitles((prevTitles) => ({
        ...prevTitles,
        [paramKey]: selectedItem.attributes.title,
      }));
    }

    setQuery('');

    if (paramKey === 'type') {
      const typeUrl = `${cleanBaseUrl}/${lang.type}/${item}`;

      delete newQuery.type;

      const queryString = new URLSearchParams();
      Object.entries(newQuery).forEach(([key, value]) => {
        if (typeof value === 'string') {
          queryString.append(key, value);
        }
      });
      const finalUrl = `${typeUrl}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

      router.push(finalUrl, finalUrl, { scroll: false, locale: false });
    } else {
      const pathParts = router.asPath.split('/');

      if (pathParts.length > 2 && pathParts[2] === lang.type) {
        const typeSlug = pathParts[3]?.split('?')[0];
        if (typeSlug) {
          const typeUrl = `${cleanBaseUrl}/${lang.type}/${typeSlug}`;

          delete newQuery.type;

          const queryString = new URLSearchParams();
          Object.entries(newQuery).forEach(([key, value]) => {
            if (typeof value === 'string') {
              queryString.append(key, value);
            }
          });
          const finalUrl = `${typeUrl}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

          router.push(finalUrl, undefined, { scroll: false });
          return;
        }
      }

      const cleanQuery: Record<string, string> = {};
      Object.entries(newQuery).forEach(([key, value]) => {
        if (typeof value === 'string') {
          cleanQuery[key] = value;
        }
      });

      router.push(
        {
          pathname: cleanBaseUrl,
          query: cleanQuery,
        },
        undefined,
        { scroll: false }
      );
    }
  };

  const constructFilterUrl = (
    baseUrl: string,
    slug: string,
    currentQuery: string
  ) => {
    const queryParams = new URLSearchParams(currentQuery || '');

    queryParams.delete('vehicles_we_armor');
    queryParams.delete('type');
    queryParams.delete('q');
    queryParams.delete('nxtPtype');
    queryParams.delete('nextInternalLocale');

    const queryString = queryParams.toString();

    return `${baseUrl}/${lang.type}/${slug}${queryString ? `?${queryString}` : ''}`;
  };

  const filtersRef = useRef(null);
  const filtersMainRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      const handleClickOutside = (event) => {
        if (filtersRef.current && !filtersRef.current.contains(event.target)) {
          setActiveFilterItem('default');
        }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    } else {
      const handleClickOutside = (event) => {
        if (filtersRef.current && !filtersRef.current.contains(event.target)) {
          const navigationPopup = document.getElementById('navigationPopup');
          const hasOpenClass = Array.from(navigationPopup.classList).some(
            (className) => className.includes('open')
          );

          if (!openFiltersClicked && !hasOpenClass) {
            setFiltersOpen(false);
            document.body.classList.remove('no-scroll');
          } else {
            setOpenFiltersClicked(false);
          }
        }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openFiltersClicked]);

  const hasValidMakeQuery =
    (router.query.make && (!router.query.type || router.query.type)) ||
    Boolean(router.query.q);

  return (
    <div
      className={`${styles.filters}
      ${plain ? `${styles.filters_plain}` : ''}
    `}
      ref={filtersMainRef}
    >
      <div className={`${styles.filters_top}`}>
        <div className={`${styles.filters_top_title}`} onClick={openFilters}>
          {lang.filters}
          <FiltersIcon />
        </div>

        {Object.keys(router.query).length > 0 && hasValidMakeQuery && (
          <div
            className={`${styles.filters_clear} bold`}
            onClick={handleClearFilters}
          >
            {lang.clearAllFilters}
          </div>
        )}
      </div>

      <div
        className={`
          ${styles.filters_wrap}
          ${filtersOpen ? styles.filters_wrap_open : ''}
        `}
      >
        <div className={`${styles.filters_wrap_inner}`} ref={filtersRef}>
          <div className={`${styles.filters_wrap_top}`}>
            <div className={`${styles.filters_wrap_top_title}`}>
              <div
                className={`${styles.filters_wrap_close}`}
                onClick={openFilters}
              >
                X
              </div>
              {lang.filters}
            </div>

            {(Object.keys(router.query).length > 0 ||
              Boolean(router.query.q)) && (
              <div
                className={`${styles.filters_clear}`}
                onClick={handleClearFilters}
              >
                {lang.clearAllFilters}
              </div>
            )}
          </div>

          <div className={`${styles.filters_search}`}>
            <input
              type="text"
              value={query}
              placeholder={lang.search}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <div
              onClick={handleSearch}
              className={`${styles.filters_search_icon}`}
            >
              <SearchIcon />
            </div>
          </div>

          {Object.keys(props).map((filter) => {
            return (
              <div
                key={filter}
                className={`
                  ${styles.filters_item}
                  ${
                    filter === activeFilterItem
                      ? styles.filters_item_active
                      : ''
                  }
                `}
                onClick={() => activateFilterItem(filter)}
              >
                <span className={`${styles.filters_item_title}`}>
                  {filter == 'type' ? lang.type : lang.make}
                  <ChevronIcon className={`${styles.filters_item_chevron}`} />
                </span>
                <span className={`${styles.filters_item_choice}`}>
                  {filter == 'make'
                    ? activeFilterTitles.make
                    : activeFilterTitles.type
                        .replace('Armored', '')
                        .replace(/[Bb]lindado(s)?/g, '')
                        .replace(/[Bb]lindada(s)?/g, '')}
                </span>

                <div className={`${styles.filters_item_wrap}`}>
                  {filter == 'type' && (
                    <Link
                      href={baseUrl}
                      className={`${styles.checkbox_link} ${
                        lang.availableNowURL === currentSlug
                          ? styles.selected_filter
                          : ''
                      }`}
                      onClick={openFilters}
                      key="all"
                    >
                      <span className={`${styles.checkbox_span}`}>
                        {lang.all}
                      </span>
                    </Link>
                  )}

                  {filter === 'type'
                    ? sortFilterItems(filterTypesByMake).map((item) => {
                        if (
                          (baseUrl == lang.vehiclesWeArmorURL &&
                            (item.attributes.title == lang.armoredRental ||
                              item.attributes.title.toLowerCase() ==
                                lang.specialOfTheMonth.toLowerCase() ||
                              item.attributes.title == lang.armoredPreOwned)) ||
                          (baseUrl == '/' + lang.availableNowURL &&
                            item.attributes.title == lang.vansAndBussesTitle)
                        ) {
                          return null;
                        }

                        const currentQueryString =
                          router.asPath.split('?')[1] || '';
                        const newUrl = constructFilterUrl(
                          baseUrl,
                          item.attributes.slug,
                          currentQueryString
                        );

                        return baseUrl === '/' + lang.availableNowURL &&
                          item.attributes.inventory_vehicles?.data.length <
                            1 ? (
                          <span
                            className={`
                              ${styles.checkbox_link} 
                              ${styles.checkbox_link_disabled}
                              ${
                                item.attributes.slug ===
                                currentSlug.split('/').pop().split('?')[0]
                                  ? styles.selected_filter
                                  : ''
                              }
                            `}
                            key={item.id}
                          >
                            <span className={`${styles.checkbox_span}`}>
                              {baseUrl == lang.vehiclesWeArmorURL
                                ? item.attributes.title.replace(
                                    lang.armored2,
                                    ''
                                  )
                                : item.attributes.title}
                            </span>
                          </span>
                        ) : (
                          <Link
                            href={newUrl}
                            className={`
                              ${styles.checkbox_link}
                              ${
                                item.attributes.slug ===
                                currentSlug.split('/').pop().split('?')[0]
                                  ? styles.selected_filter
                                  : ''
                              }
                            `}
                            onClick={openFilters}
                            key={item.id}
                          >
                            <span className={`${styles.checkbox_span}`}>
                              {baseUrl == lang.vehiclesWeArmorURL
                                ? item.attributes.title
                                    .replace(/Armored/gi, '')
                                    .replace(/[Bb]lindado(s)?/g, '')
                                    .replace(/[Bb]lindada(s)?/g, '')
                                    .replace(/\s+s\b/, '')
                                    .trim()
                                : item.attributes.title}
                            </span>
                          </Link>
                        );
                      })
                    : filterMakesByType.map((item) => (
                        <div
                          className={`${styles.checkbox_link} ${
                            item.attributes.slug === currentFilterMake
                              ? styles.selected_filter
                              : ''
                          }`}
                          onClick={() =>
                            applyFilter(item.attributes.slug, 'make')
                          }
                          key={item.id}
                        >
                          <span className={`${styles.checkbox_span}`}>
                            {item.attributes.title}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
