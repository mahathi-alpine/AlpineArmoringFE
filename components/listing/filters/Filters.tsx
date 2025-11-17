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
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);

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
    // Special handling for items with sold vehicles category
    const soldCategory = items.find(
      (item) =>
        item.attributes.slug?.includes('recently-sold-armored-vehicles') ||
        item.attributes.slug?.includes(
          'vehiculos-blindados-vendidos-recientemente'
        )
    );

    if (soldCategory) {
      // Remove sold category temporarily
      const itemsWithoutSold = items.filter(
        (item) =>
          !item.attributes.slug?.includes('recently-sold-armored-vehicles') &&
          !item.attributes.slug?.includes(
            'vehiculos-blindados-vendidos-recientemente'
          )
      );

      // Sort other items normally
      const sortedItems = itemsWithoutSold.sort((a, b) => {
        const aHasInventory = a.attributes.inventory_vehicles?.data.length > 0;
        const bHasInventory = b.attributes.inventory_vehicles?.data.length > 0;
        return aHasInventory === bHasInventory ? 0 : aHasInventory ? -1 : 1;
      });

      // Find where to insert sold category (after pre-owned, before rental)
      const preOwnedIndex = sortedItems.findIndex(
        (item) =>
          item.attributes.slug === 'armored-pre-owned' ||
          item.attributes.slug === 'blindados-pre-usados'
      );

      if (preOwnedIndex !== -1) {
        // Insert after pre-owned
        sortedItems.splice(preOwnedIndex + 1, 0, soldCategory);
      } else {
        // If no pre-owned, try to insert before rental
        const rentalIndex = sortedItems.findIndex(
          (item) =>
            item.attributes.slug === 'armored-rental' ||
            item.attributes.slug === 'alquiler-blindados'
        );
        if (rentalIndex !== -1) {
          sortedItems.splice(rentalIndex, 0, soldCategory);
        } else {
          // As last resort, add at end
          sortedItems.push(soldCategory);
        }
      }

      return sortedItems;
    }

    // Normal sorting if no sold category
    return items.sort((a, b) => {
      const aHasInventory = a.attributes.inventory_vehicles?.data.length > 0;
      const bHasInventory = b.attributes.inventory_vehicles?.data.length > 0;
      return aHasInventory === bHasInventory ? 0 : aHasInventory ? -1 : 1;
    });
  };

  const filterMakesByType = useMemo(() => {
    const currentTypeSlug = router.query.type as string;

    if (!props.make) return props.make;

    if (!currentTypeSlug) {
      return props.make.filter((make) => {
        return make.attributes.vehicles_we_armors?.data?.length > 0;
      });
    }

    const englishTypeSlug =
      localizedToEnglishMap[currentTypeSlug] || currentTypeSlug;

    return props.make.filter((make) => {
      if (!make.attributes.vehicles_we_armors?.data?.length) {
        return false;
      }

      return make.attributes.vehicles_we_armors.data.some((vehicleArmor) =>
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

    const baseUrl =
      router.locale === 'es'
        ? router.pathname === '/vehicles-we-armor' ||
          router.pathname === '/vehicles-we-armor/type/[type]'
          ? '/es/vehiculos-que-blindamos'
          : '/es/vehiculos-blindados-en-venta'
        : router.pathname === '/vehicles-we-armor' ||
            router.pathname === '/vehicles-we-armor/type/[type]'
          ? '/vehicles-we-armor'
          : '/armored-vehicles-for-sale';

    const newQuery: { q?: string } = {};

    if (!query || query.trim().length === 0) {
      router.push(baseUrl, baseUrl, { locale: false });
    } else {
      newQuery.q = query;

      router.push(
        {
          pathname: baseUrl,
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
    if (router.locale === 'en') {
      if (router.pathname === '/armored-vehicles-for-sale') {
        return '/available-now';
      }
      if (router.pathname === '/available-now/type/[type]') {
        return '/available-now';
      }
      if (
        router.pathname === '/vehicles-we-armor' ||
        router.pathname === '/vehicles-we-armor/type/[type]'
      ) {
        return '/vehicles-we-armor';
      }
    } else {
      if (router.pathname === '/armored-vehicles-for-sale') {
        return `/${router.locale}/${lang.availableNowURL}`;
      }
      if (router.pathname === '/available-now/type/[type]') {
        return `/${router.locale}/${lang.availableNowURL}`;
      }
      if (
        router.pathname === '/vehicles-we-armor' ||
        router.pathname === '/vehicles-we-armor/type/[type]'
      ) {
        return `/${router.locale}${lang.vehiclesWeArmorURL}`;
      }
    }

    return '/';
  };
  const baseUrl = getBaseUrl();
  const currentSlug = router.asPath.split('/').pop()?.split('?')[0] || '';

  const handleClearFilters = () => {
    setQuery('');
    activeFilterTitles.make = lang.select;

    router.push(
      baseUrl === '/available-now' || baseUrl === '/es/disponible-ahora'
        ? `${router.locale === 'en' ? '' : `/${router.locale}`}/${lang.armoredVehiclesForSaleURL}`
        : baseUrl,
      undefined,
      { scroll: false }
    );
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
    delete newQuery['vehiculos_que_blindamos'];
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

    // Remove Next.js internal parameters and filter-specific params
    queryParams.delete('vehicles_we_armor');
    queryParams.delete('vehiculos_que_blindamos');
    queryParams.delete('type');
    queryParams.delete('tipo');
    queryParams.delete('q');
    queryParams.delete('nxtPtype');
    queryParams.delete('nextInternalLocale');

    // Remove any other Next.js internal parameters
    const paramsToRemove = Array.from(queryParams.keys()).filter(
      (key) => key.startsWith('nxt') || key.startsWith('next')
    );
    paramsToRemove.forEach((param) => queryParams.delete(param));

    const queryString = queryParams.toString();

    // Hardcoded type segment based on language
    let result;
    if (router.locale === 'en') {
      result = `${baseUrl}/type/${slug}`;
    } else {
      result = `${baseUrl}/tipo/${slug}`;
    }

    // Add query string if it exists
    if (queryString) {
      result += `?${queryString}`;
    }

    return result;
  };

  const filtersRef = useRef(null);
  const filtersMainRef = useRef(null);
  const searchPopupRef = useRef(null);

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

  // Toggle search popup
  const toggleSearchPopup = () => {
    setSearchPopupOpen((prev) => !prev);
  };

  // Handle search popup click outside and ESC key
  useEffect(() => {
    if (!plain || window.innerWidth < 1280) return;

    const handleClickOutside = (event) => {
      if (
        searchPopupRef.current &&
        !searchPopupRef.current.contains(event.target)
      ) {
        setSearchPopupOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setSearchPopupOpen(false);
      }
    };

    if (searchPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [searchPopupOpen, plain]);

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
            {lang.clearAll}
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
                {lang.clearAll}
              </div>
            )}
          </div>

          <div
            className={`${styles.filters_search} ${
              plain ? styles.filters_search_plain : ''
            }`}
            ref={searchPopupRef}
          >
            {plain ? (
              <>
                <div
                  onClick={toggleSearchPopup}
                  className={`${styles.filters_search_icon_trigger}`}
                >
                  <SearchIcon />
                </div>
                {searchPopupOpen && (
                  <div className={`${styles.filters_search_popup}`}>
                    <input
                      type="text"
                      value={query}
                      placeholder={lang.search}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                          setSearchPopupOpen(false);
                        }
                      }}
                      autoFocus
                    />
                    <div
                      onClick={() => {
                        handleSearch();
                        setSearchPopupOpen(false);
                      }}
                      className={`${styles.filters_search_icon}`}
                    >
                      <SearchIcon />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
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
                {((filter === 'make' &&
                  activeFilterTitles.make !== lang.select) ||
                  (filter === 'type' &&
                    activeFilterTitles.type !== lang.all)) && (
                  <span className={`${styles.filters_item_choice}`}>
                    {filter == 'make'
                      ? activeFilterTitles.make
                      : activeFilterTitles.type
                          .replace('Armored', '')
                          .replace(/[Bb]lindado(s)?/g, '')
                          .replace(/[Bb]lindada(s)?/g, '')}
                  </span>
                )}

                <div className={`${styles.filters_item_wrap}`}>
                  {filter == 'type' && (
                    <Link
                      href={
                        baseUrl === '/available-now' ||
                        baseUrl === '/es/disponible-ahora'
                          ? `/${lang.armoredVehiclesForSaleURL}`
                          : baseUrl
                      }
                      className={`${styles.checkbox_link} ${
                        lang.armoredVehiclesForSaleURL === currentSlug
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
                    ? (() => {
                        const typesToProcess = [...filterTypesByMake];

                        // Add sold vehicles category only on available now and armored vehicles for sale pages
                        const isInventoryPage =
                          router.pathname === '/armored-vehicles-for-sale' ||
                          router.pathname === '/available-now' ||
                          router.pathname.startsWith('/available-now/type/');

                        const isSoldVehiclesPage =
                          router.asPath.includes(
                            'recently-sold-armored-vehicles'
                          ) ||
                          router.asPath.includes(
                            'vehiculos-blindados-vendidos-recientemente'
                          );

                        if (isInventoryPage && !isSoldVehiclesPage) {
                          // Add sold vehicles category between pre-owned and rental BEFORE sorting
                          const soldCategory = {
                            id: 'sold-category',
                            attributes: {
                              slug:
                                router.locale === 'en'
                                  ? 'recently-sold-armored-vehicles'
                                  : 'vehiculos-blindados-vendidos-recientemente',
                              title:
                                router.locale === 'en'
                                  ? 'Recently Sold Armored Vehicles'
                                  : 'Vehículos Blindados Vendidos Recientemente',
                              inventory_vehicles: { data: [] },
                            },
                          };

                          // Just add it to the array - the sortFilterItems function will position it correctly
                          typesToProcess.push(soldCategory);
                        }

                        // Apply sorting after insertion
                        const sortedTypes = sortFilterItems(typesToProcess);

                        return sortedTypes;
                      })().map((item) => {
                        if (
                          (baseUrl.endsWith(lang.vehiclesWeArmorURL) &&
                            (item.attributes.title == lang.armoredRental ||
                              item.attributes.title.toLowerCase() ==
                                lang.specialOfTheMonth.toLowerCase() ||
                              item.attributes.title == lang.armoredPreOwned)) ||
                          (baseUrl.endsWith('/' + lang.availableNowURL) &&
                            item.attributes.title == lang.vansAndBussesTitle)
                        ) {
                          return null;
                        }

                        const currentQueryString =
                          router.asPath.split('?')[1] || '';
                        let newUrl = constructFilterUrl(
                          baseUrl,
                          item.attributes.slug,
                          currentQueryString
                        );
                        newUrl = newUrl.startsWith('//')
                          ? newUrl.substring(1)
                          : newUrl;

                        const isSoldCategory =
                          item.attributes.slug ===
                            'recently-sold-armored-vehicles' ||
                          item.attributes.slug ===
                            'vehiculos-blindados-vendidos-recientemente';

                        return baseUrl.endsWith('/' + lang.availableNowURL) &&
                          item.attributes.inventory_vehicles?.data.length < 1 &&
                          !isSoldCategory ? (
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
                              {item.attributes.title}
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
                              {baseUrl.endsWith(lang.vehiclesWeArmorURL)
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
