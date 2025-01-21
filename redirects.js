const { parse } = require('url');
// const cache = require('./cache');

// const CACHE_KEY = 'redirects_data';

async function fetchAllRedirectPages() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
  let allRedirects = [];
  let currentPage = 1;
  let hasMorePages = true;

  // console.log('Starting to fetch redirects from API:', apiUrl);

  while (hasMorePages) {
    const response = await fetch(
      `${apiUrl}/api/redirects?pagination[page]=${currentPage}&pagination[pageSize]=100`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { pagination } = data.meta;

    allRedirects = [...allRedirects, ...data.data];

    hasMorePages = currentPage < pagination.pageCount;
    currentPage++;
  }

  return allRedirects;
}

async function fetchRedirects() {
  try {
    // Check cache first
    // const cachedData = cache.get(CACHE_KEY);
    // if (cachedData) {
    //   return cachedData;
    // }

    // If no cache, fetch fresh data
    const redirectsData = await fetchAllRedirectPages();

    const transformedRedirects = redirectsData.map((redirect) => {
      const { from, to } = redirect.attributes;
      const parsedFrom = parse(from, true);

      const redirectConfig = {
        source: `/:locale${parsedFrom.pathname || from}`,
        destination: to,
        permanent: true,
        locale: false,
      };

      // If there are query parameters, add exact matching
      if (parsedFrom.query && Object.keys(parsedFrom.query).length > 0) {
        const queryConditions = Object.entries(parsedFrom.query).map(
          ([key, value]) => ({
            type: 'query',
            key,
            value: value.toString(),
          })
        );
        redirectConfig.has = queryConditions;
      }

      return redirectConfig;
    });

    // Store in cache
    // cache.set(CACHE_KEY, transformedRedirects);

    return transformedRedirects;
  } catch (error) {
    console.error('Error fetching redirects:', error);

    // Try to return cached data as fallback if available
    // const cachedData = cache.get(CACHE_KEY);
    // if (cachedData) {
    //   console.log('Returning cached data due to fetch error');
    //   return cachedData;
    // }

    return [];
  }
}

module.exports = fetchRedirects;
