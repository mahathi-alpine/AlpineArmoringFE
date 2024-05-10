export async function fetchAPI(path) {
  const requestUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  // console.log(requestUrl);

  try {
    const [response] = await Promise.all([fetch(requestUrl)]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    // console.error('Error fetching data:', error);
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
}: PageDataProps) {
  const sortQuery = sort ? `&sort=${sort}:${sortType}` : '';
  const paramsQuery = params ? params : '';
  const populateQuery = populate ? 'populate=' + populate : '';
  const fieldsQuery = fields ? '&' + fields : '';
  const limitQuery = limit ? '&' + limit : '';
  const pageQuery = page ? '&pagination[page]=' + page : '';
  const pageSizeQuery = pageSize ? '&pagination[pageSize]=' + pageSize : '';

  const query = custom
    ? `/${route}?${custom}`
    : `/${route}?${paramsQuery}&${populateQuery}${sortQuery}${fieldsQuery}${limitQuery}${pageQuery}${pageSizeQuery}`;

  const pagesData = await fetchAPI(`/api${query}`);

  if (pagesData == null || pagesData.length === 0) {
    return null;
  }

  return pagesData;
}
