// export function getStrapiURL(path = '') {
//   return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
// }
import { API_URL } from 'config/index';
export async function fetchAPI(path) {
  // const requestUrl = getStrapiURL(path);
  const requestUrl = `${API_URL}${path}`;
  try {
    const [response] = await Promise.all([fetch(requestUrl)]);
    console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: error.message,
      },
    };
  }
}

interface PageDataProps {
  route?: string;
  slug?: string;
  type?: string;
  order?: boolean;
}

export async function getPageData({ route, slug, type, order }: PageDataProps) {
  const sort = order ? '&sort=order:asc' : '';
  const query = slug
    ? `/${route}?filters${type}[$eq]=${slug}&populate=deep${sort}`
    : `/${route}?populate=deep${sort}`;

  const pagesData = await fetchAPI(`/api${query}`);

  if (pagesData == null || pagesData.length === 0) {
    return null;
  }

  return pagesData;
}
