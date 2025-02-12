const fs = require('fs');
const path = require('path');
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
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=bentley`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=bmw`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=boxer`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=bulldog`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=cadillac`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=chevrolet`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=cuda`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=cyclone`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=ford`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=genesis`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=gmc`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=honda`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=hummer`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=infiniti`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=ineos`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=lamborghini`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=maybach`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=international`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=jeep`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=land-rover`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=lexus`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=lincoln`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=mastiff`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=mercedes-benz`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=omicron`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=pit-bull`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=pointer`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=range-rover`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=rolls-royce`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=tesla`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=toyota`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor?make=typhoon`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-cash-in-transit-cit?make=international`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=jeep`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-law-enforcement?make=bulldog`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=infiniti`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=chevrolet`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=chevrolet`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=lexus`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-sedans?make=lexus`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-law-enforcement?make=pointer`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-sedans?make=rolls-royce`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-suvs?make=rolls-royce`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-specialty-vehicles?make=mastiff`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=mastiff`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-vans-and-buses?make=pointer`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=ford`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-law-enforcement?make=ford`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=ford`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-cash-in-transit-cit?make=ford`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=bentley`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-sedans?make=bentley`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=genesis`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-sedans?make=genesis`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=bmw`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=hummer`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=cadillac`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=ineos`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-sedans?make=bmw`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=audi`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-sedans?make=audi`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-law-enforcement?make=typhoon`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=typhoon`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-law-enforcement?make=pit-bull`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=pit-bull`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-specialty-vehicles?make=toyota`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=toyota`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-vans-and-buses?make=toyota`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=toyota`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-sedans?make=toyota`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-law-enforcement?make=cuda`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-suvs?make=range-rover`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=lincoln`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-law-enforcement?make=cyclone`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=cyclone`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-vans-and-buses?make=honda`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-suvs?make=land-rover`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-vans-and-buses?make=gmc`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=gmc`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=gmc`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-cash-in-transit-cit?make=gmc`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-pickup-trucks?make=tesla`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-sedans?make=tesla`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [`${baseURL}vehicles-we-armor/type/armored-suvs?make=tesla`],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-law-enforcement?make=boxer`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-specialty-vehicles?make=omicron`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-suvs?make=lamborghini`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-suvs?make=mercedes-benz`,
          ],
          priority: ['0.5'],
          changefreq: ['monthly'],
        },
        {
          loc: [
            `${baseURL}vehicles-we-armor/type/armored-sedans?make=mercedes-benz`,
          ],
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
