const fs = require('fs');
const path = require('path');
// const fetch = require('node-fetch');
const { parseString, Builder } = require('xml2js');

async function generateSitemap() {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://alpinetesting.cloudflex-ha.com';
  const sitemapPath = '/api/sitemap/index.xml';

  if (!backendUrl) {
    console.error(
      'NEXT_PUBLIC_API_URL is not set. Please set it in your environment variables.'
    );
    process.exit(1);
  }

  try {
    const response = await fetch(`${backendUrl}${sitemapPath}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
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

      // Ensure the public directory exists
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // Write the formatted XML to a file
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), formattedXml);
      console.log('Sitemap generated successfully');
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
