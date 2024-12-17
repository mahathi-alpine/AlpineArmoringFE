const fs = require('fs');
const path = require('path');
// const fetch = require('node-fetch');
const { parseString, Builder } = require('xml2js');

async function generateSitemap() {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://alpinetesting.cloudflex-ha.com';
  const sitemapPath = '/api/sitemap/index.xml';

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

      // Add custom URLs
      const baseURL = 'https://www.alpineco.com/';
      const customUrls = [
        {
          loc: [`${baseURL}vehicles-we-armor?make=audi`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=bentley`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=bmw`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=boxer`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=bulldog`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=cadillac`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=chevrolet`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=cuda`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=cyclone`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=ford`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=genesis`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=gmc`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=honda`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=hummer`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=infiniti`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=ineos`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=international`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=jeep`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=land-rover`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=lexus`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=lincoln`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=mastiff`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=mercedes-benz`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=omicron`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=pit-bull`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=pointer`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=range-rover`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=rolls-royce`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=tesla`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=toyota`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=typhoon`],
          lastmod: [new Date().toISOString()],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
      ];

      // Append custom URLs to the existing urls
      result.urlset.url = [...result.urlset.url, ...customUrls];

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
