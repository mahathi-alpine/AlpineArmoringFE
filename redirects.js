const redirects = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

  return fetch(`${apiUrl}/redirects?pagination[start]=0&pagination[limit]=-1`)
    .then((res) => res.json())
    .then((response) => {
      const redirects = response?.data?.map((redirect) => ({
        source: redirect.attributes.from,
        destination: redirect.attributes.to,
        permanent: redirect.attributes.type === 'permanent',
      }));

      return redirects;
    });
};

module.exports = redirects;
