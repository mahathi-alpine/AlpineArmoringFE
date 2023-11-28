export function getStrapiURL(path = '') {
    return `${
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'
    }${path}`;
}

export async function fetchAPI(path) {
    const requestUrl = getStrapiURL(path);
    // console.log(requestUrl)
    try {
        const [response] = await Promise.all([
            fetch(requestUrl)
        ]);   
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
  
export async function getPageData(route, slug, type) {  
    let query = slug ? `/${route}?filters${type}[$eq]=${slug}&populate=deep` : `/${route}?populate=deep`;

    const pagesData = await fetchAPI(query);
  
    if (pagesData == null || pagesData.length === 0) {
      return null;
    }

    return pagesData;
}