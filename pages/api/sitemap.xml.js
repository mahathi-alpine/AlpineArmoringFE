export default function handler(req, res) {
  const sitemapPath = `${process.env.NEXT_PUBLIC_API_URL}/api/sitemap/index.xml`;

  fetch(`${sitemapPath}`)
    .then((response) => response.text())
    .then((xml) => {
      res.setHeader('Content-Type', 'application/xml');
      res.write(xml);
      res.end();
    })
    .catch((error) => {
      console.error('Error fetching sitemap:', error);
      res.status(500).json({ message: 'Failed to fetch sitemap' });
    });
}
