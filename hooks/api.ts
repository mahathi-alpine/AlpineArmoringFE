export async function fetchAPI(path) {
  const requestUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  console.log('🐛 API Request:', requestUrl);

  try {
    const [response] = await Promise.all([fetch(requestUrl)]);

    console.log(
      '🐛 API Response Status:',
      response.status,
      response.statusText
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();

      console.log('🐛 API Response Data:', {
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        dataType: Array.isArray(data?.data) ? 'array' : typeof data?.data,
        dataLength: Array.isArray(data?.data) ? data.data.length : 'not array',
      });

      return data;
    }
  } catch (error) {
    console.error('🐛 API Error:', error);
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

  console.log('🐛 getPageData called:', {
    route,
    locale,
    finalQuery: query,
    environment: process.env.NODE_ENV,
  });

  const pagesData = await fetchAPI(`/api${query}`);

  console.log('🐛 getPageData result:', {
    hasResult: !!pagesData,
    resultType: typeof pagesData,
    isNull: pagesData === null,
    isEmpty: Array.isArray(pagesData) && pagesData.length === 0,
    hasError: !!pagesData?.props?.error,
  });

  if (pagesData == null || pagesData.length === 0) {
    console.log('🐛 No data returned from API');
    return null;
  }

  return pagesData;
}
