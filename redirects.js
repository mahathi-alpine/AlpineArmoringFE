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
    const redirects = data?.data?.map((redirect) => {
      let from = redirect.attributes.from;
      const to = redirect.attributes.to;
      const isPermanent = redirect.attributes.type === 'permanent';

      // Handle special characters
      from = from
        .split('')
        .map((char) => {
          if (':()?.'.includes(char)) {
            return `(${char}|${encodeURIComponent(char)})`;
          }
          return char;
        })
        .join('');

      return {
        source: from.startsWith('/') ? from : `/${from}`,
        destination: to,
        permanent: isPermanent,
      };
    });

    // Log the generated redirects
    console.log('Generated redirects:');
    console.log(JSON.stringify(redirects, null, 2));

    return redirects;
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return [];
  }
};

module.exports = redirects;
