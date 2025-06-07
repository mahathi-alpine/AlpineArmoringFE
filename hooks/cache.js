export const setPublicCache = (res) => {
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
  );
};
