export default async function handler(req, res) {
  const sitemapUrl =
    'https://alpinetesting.cloudflex-ha.com/api/sitemap/index.xml';

  try {
    const response = await fetch(sitemapUrl);
    let sitemapContent = await response.text();

    // Remove the XSL stylesheet reference
    sitemapContent = sitemapContent.replace(/<\?xml-stylesheet.*?\?>/, '');

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemapContent);
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    res.status(500).send('Error fetching sitemap');
  }
}
