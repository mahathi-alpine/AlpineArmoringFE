const redirects = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

  try {
    const response = await fetch(
      `${apiUrl}/redirects?pagination[start]=0&pagination[limit]=-1`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const processedRedirects = data?.data?.map((redirect) => {
      const sourceWithoutQuery = redirect.attributes.from.split('?')[0];
      const destinationWithoutQuery = redirect.attributes.to.split('?')[0];

      return {
        source: sourceWithoutQuery,
        destination: destinationWithoutQuery,
        permanent: redirect.attributes.type === 'permanent',
      };
    });
    return processedRedirects;
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return [];
  }
};

module.exports = redirects;

// const redirects = async () => {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

//   try {
//     const response = await fetch(
//       `${apiUrl}/redirects?pagination[start]=0&pagination[limit]=-1`
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     const redirects = data?.data?.map((redirect) => ({
//       source: redirect.attributes.from,
//       destination: redirect.attributes.to,
//       permanent: redirect.attributes.type === 'permanent',
//     }));
//     return redirects;
//   } catch (error) {
//     return [];
//   }
// };

// module.exports = redirects;
