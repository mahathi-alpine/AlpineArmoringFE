import { parseString, Builder } from 'xml2js';

export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const sitemapPath = '/api/sitemap/index.xml';

  try {
    const response = await fetch(`${backendUrl}${sitemapPath}`);
    let sitemapContent = await response.text();

    // Remove the XSL stylesheet reference
    sitemapContent = sitemapContent.replace(/<\?xml-stylesheet.*?\?>/, '');

    // Parse the XML string
    parseString(sitemapContent, (err, result) => {
      if (err) {
        throw new Error('Error parsing XML');
      }

      // Remove xhtml:link elements from each url
      if (result.urlset && result.urlset.url) {
        result.urlset.url.forEach((url) => {
          if (url['xhtml:link']) {
            delete url['xhtml:link'];
          }
        });
      }

      // Create a new XML builder with pretty formatting
      const builder = new Builder({
        renderOpts: { pretty: true, indent: '  ', newline: '\n' },
        xmldec: { version: '1.0', encoding: 'UTF-8' },
      });

      // Build the XML string with proper formatting
      const formattedXml = builder.buildObject(result);

      // Send the formatted XML as the response
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(formattedXml);
    });
  } catch (error) {
    console.error('Error fetching or formatting sitemap:', error);
    res.status(500).send('Error fetching or formatting sitemap');
  }
}
