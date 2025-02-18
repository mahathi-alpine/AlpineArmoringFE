const fs = require('fs');
const path = require('path');
const config = require('./sitemap.config');
const {
  fetchCollectionData,
  formatStrapiData,
  generateSitemapXML,
} = require('./hooks/sitemap');

async function generateSitemaps() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    for (const lang of config.languages) {
      const urls = [];

      for (const [key, collectionConfig] of Object.entries(
        config.collections
      )) {
        const collectionName = collectionConfig.collection || key;
        const result = await fetchCollectionData(
          collectionName,
          lang,
          collectionConfig
        );

        if (result?.data?.length > 0) {
          const formattedUrls = formatStrapiData(
            key,
            result.data,
            config,
            collectionConfig,
            lang
          );
          urls.push(...formattedUrls);
        }
      }

      if (config.customUrls?.[lang]) {
        const customUrls = config.customUrls[lang].map((urlConfig) => ({
          loc: [`${config.baseUrl}${urlConfig.loc}`],
          changefreq: [urlConfig.changefreq || config.defaultChangefreq],
          priority: [urlConfig.priority || config.defaultPriority],
        }));
        urls.push(...customUrls);
      }

      const xml = generateSitemapXML(urls);
      const filename =
        lang === config.defaultLanguage ? 'sitemap.xml' : `${lang}/sitemap.xml`;
      const filepath = path.join(publicDir, filename);

      if (lang !== config.defaultLanguage) {
        const langDir = path.join(publicDir, lang);
        if (!fs.existsSync(langDir)) {
          fs.mkdirSync(langDir, { recursive: true });
        }
      }

      fs.writeFileSync(filepath, xml);
    }
  } catch (error) {
    process.exit(1);
  }
}

generateSitemaps();
