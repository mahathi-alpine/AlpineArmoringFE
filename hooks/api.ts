export async function fetchAPI(path) {
  const requestUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  // Debug logging for contact-related API calls
  if (path.includes('contact')) {
    console.log('=== API FETCH DEBUG ===');
    console.log('Fetching URL:', requestUrl);
    console.log('=======================');
  }

  try {
    const [response] = await Promise.all([fetch(requestUrl)]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();

      // Debug logging for contact-related API responses
      if (path.includes('contact')) {
        console.log('=== API RESPONSE DEBUG ===');
        console.log('Response data exists:', !!data);
        console.log('Response data structure:', Object.keys(data || {}));
        console.log('=========================');
      }

      return data;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        error: error.message,
      },
    };
  }
}

interface PageDataProps {
  route?: string;
  params?: string;
  slug?: string;
  sort?: string;
  sortType?: string;
  populate?: string;
  fields?: string;
  limit?: number;
  page?: number;
  pageSize?: number;
  custom?: string;
  locale?: string;
}

export async function getPageData({
  route,
  params,
  sort,
  sortType = 'asc',
  populate,
  limit,
  fields,
  page,
  pageSize,
  custom,
  locale = 'en',
}: PageDataProps) {
  const sortQuery = sort ? `&sort=${sort}:${sortType}` : '';
  const paramsQuery = params ? params : '';
  const populateQuery = populate ? 'populate=' + populate : '';
  const fieldsQuery = fields ? '&' + fields : '';
  const limitQuery = limit ? '&' + limit : '';
  const pageQuery = page ? '&pagination[page]=' + page : '';
  const pageSizeQuery = pageSize ? '&pagination[pageSize]=' + pageSize : '';
  const localeQuery = `&locale=${locale}`;

  const query = custom
    ? `/${route}?${custom}${localeQuery}`
    : `/${route}?${paramsQuery}&${populateQuery}${sortQuery}${fieldsQuery}${limitQuery}${pageQuery}${pageSizeQuery}${localeQuery}`;

  // Debug logging for contact page data fetching
  if (route === 'contact-page') {
    console.log('=== getPageData DEBUG ===');
    console.log(`Fetching ${route} with locale:`, locale);
    console.log('Full query:', query);
    console.log('========================');
  }

  const pagesData = await fetchAPI(`/api${query}`);

  // Additional debug logging for contact page
  if (route === 'contact-page') {
    console.log('=== getPageData RESPONSE ===');
    console.log('Pages data received:', !!pagesData);
    console.log('Data structure:', pagesData ? Object.keys(pagesData) : 'null');
    console.log('===========================');
  }

  if (pagesData == null || pagesData.length === 0) {
    return null;
  }

  return pagesData;
}

// New utility function for client-side data fetching
export async function getPageDataClient({
  route,
  locale = 'en',
  populate = 'deep',
}: {
  route: string;
  locale?: string;
  populate?: string;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${route}?populate=${populate}&locale=${locale}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.attributes || null;
  } catch (error) {
    console.error('Client-side data fetch error:', error);
    return null;
  }
}
