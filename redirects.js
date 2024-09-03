const escapeSpecialChars = (str) => {
  return str.replace(/[-[\]{}()*+?.:,\\^$|#\s]/g, '\\$&');
};

const redirects = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
  const limit = 100;
  let page = 0;
  const allRedirects = [];

  try {
    /* eslint-disable-next-line no-constant-condition */
    while (true) {
      const response = await fetch(
        `${apiUrl}/redirects?pagination[start]=${
          page * limit
        }&pagination[limit]=${limit}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch redirects: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      const redirects = data?.data?.map((redirect) => {
        let from = redirect.attributes.from;
        const to = redirect.attributes.to;
        const isPermanent = redirect.attributes.type === 'permanent';

        // Escape special characters in the source URL
        from = escapeSpecialChars(from);

        if (from.endsWith('/')) {
          from = from.slice(0, -1);
        }

        return {
          source: from,
          destination: to,
          permanent: isPermanent,
        };
      });

      allRedirects.push(...redirects);

      // console.log('Generated redirects:');
      console.log(redirects);

      if (allRedirects.length >= data.meta.pagination.total) {
        break;
      }

      page++;
    }

    return allRedirects;
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return [];
  }
};

module.exports = redirects;
