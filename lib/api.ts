import { API_URL } from 'config/index';

export async function fetchAPI(path) {
  const requestUrl = `${API_URL}${path}`;

  // console.log(requestUrl);

  try {
    const [response] = await Promise.all([fetch(requestUrl)]);
    const data = await response.json();
    return data;
  } catch (error) {
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
  order?: boolean;
  populate?: string;
  fields?: string;
  limit?: number;
}

export async function getPageData({
  route,
  params,
  order,
  populate,
  limit,
  fields,
}: PageDataProps) {
  const sort = order ? '&sort=order:asc' : '';
  const populateQuery = populate ? 'populate=' + populate : '';
  const fieldsQuery = fields ? '&' + fields : '';
  const limitQuery = limit ? '&' + limit : '';

  const query = params
    ? `/${route}?${params}&${populateQuery}${sort}${fieldsQuery}${limitQuery}`
    : `/${route}?${populateQuery}${sort}${fieldsQuery}${limitQuery}`;

  const pagesData = await fetchAPI(`/api${query}`);

  if (pagesData == null || pagesData.length === 0) {
    return null;
  }

  return pagesData;
}
