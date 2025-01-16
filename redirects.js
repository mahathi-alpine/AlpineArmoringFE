const { parse } = require('url');

async function fetchAllRedirectPages() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
  let allRedirects = [];
  let currentPage = 1;
  let hasMorePages = true;

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
    const redirectsData = await fetchAllRedirectPages();

    const transformedRedirects = redirectsData.map((redirect) => {
      const { from, to } = redirect.attributes;

      const parsedFrom = parse(from, true);

      // Basic configuration
      const redirectConfig = {
        source: parsedFrom.pathname || from,
        destination: to,
        permanent: true,
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

    return transformedRedirects;
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return [];
  }
}

module.exports = fetchRedirects;
