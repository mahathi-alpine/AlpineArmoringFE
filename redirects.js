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
    const redirects = data?.data?.map((redirect) => ({
      source: redirect.attributes.from,
      destination: redirect.attributes.to,
      permanent: redirect.attributes.type === 'permanent',
    }));
    return redirects;
  } catch (error) {
    return [];
  }
};

module.exports = redirects;
