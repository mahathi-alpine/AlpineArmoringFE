// export function getStrapiURL(path = '') {
//   return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
// }
import { API_URL } from 'config/index';

export async function fetchAPI(path) {
  // const requestUrl = getStrapiURL(path);
  const requestUrl = `${API_URL}${path}`;
  // console.log(requestUrl)
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
}

export async function getPageData({ route, params, order }: PageDataProps) {
  const sort = order ? '&sort=order:asc' : '';

  const query = params
    ? `/${route}?${params}&populate=deep${sort}`
    : `/${route}?populate=deep${sort}`;

  const pagesData = await fetchAPI(`/api${query}`);

  if (pagesData == null || pagesData.length === 0) {
    return null;
  }

  return pagesData;
}
