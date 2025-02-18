const { Builder } = require('xml2js');

async function fetchCollectionData(
  collection,
  locale = 'en',
  collectionConfig
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://alpinetesting.cloudflex-ha.com';
  let page = 1;
  let allData = [];
  let hasMorePages = true;

  while (hasMorePages) {
    const publishFilter = collectionConfig.hasDraftPublish
      ? '&filters[publishedAt][$notNull]=true'
      : '';

    // Add category filter if specified
    let categoryFilter = '';
    if (collectionConfig.filter?.categories) {
      categoryFilter = '&filters[categories][slug][$eq]=armored-rental';
    }

    let url;
    if (collection === 'categories' || collection.includes('categories')) {
      url = `${baseUrl}/api/categories?populate=localizations&locale=${locale}&pagination[page]=${page}&pagination[pageSize]=100`;
    } else {
      url = `${baseUrl}/api/${collection}?populate=*&locale=${locale}&pagination[page]=${page}&pagination[pageSize]=100${publishFilter}${categoryFilter}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (!result.data || result.data.length === 0) {
        hasMorePages = false;
        continue;
      }

      allData = allData.concat(result.data);
      hasMorePages =
        result.meta?.pagination && page < result.meta.pagination.pageCount;
      page++;
    } catch (error) {
      console.error('Error fetching data:', error);
      hasMorePages = false;
    }
  }

  return { data: allData };
}

function generateSitemapXML(urls) {
  const builder = new Builder({
    renderOpts: { pretty: true, indent: '  ', newline: '\n' },
    xmldec: { version: '1.0', encoding: 'UTF-8' },
  });

  const xmlObj = {
    urlset: {
      $: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      },
      url: urls,
    },
  };

  return builder.buildObject(xmlObj);
}

function formatStrapiData(
  collection,
  data,
  config,
  collectionConfig,
  currentLang
) {
  const urls = [];

  // Special handling for different types of categories
  if (
    collection === 'categoriesVehicles' ||
    collection === 'categoriesInventory'
  ) {
    data.forEach((item) => {
      if (collectionConfig.excludeSlugs?.includes(item.attributes.slug)) {
        return;
      }

      const urlPattern =
        currentLang === config.defaultLanguage
          ? collectionConfig.urlPattern
          : collectionConfig.translations[currentLang];

      const url = urlPattern.replace(':slug', item.attributes.slug);
      urls.push({
        loc: [`${config.baseUrl}${url}`],
        lastmod: [item.attributes.updatedAt],
        changefreq: [collectionConfig.changefreq || config.defaultChangefreq],
        priority: [collectionConfig.priority || config.defaultPriority],
      });
    });
    return urls;
  }

  // Original handling for other collections
  data.forEach((item) => {
    if (collectionConfig.hasDraftPublish && !item.attributes.publishedAt) {
      return;
    }

    if (collectionConfig.excludeSlugs?.includes(item.attributes.slug)) {
      return;
    }

    if (item.attributes.locale === currentLang) {
      const urlPattern =
        currentLang === config.defaultLanguage
          ? collectionConfig.urlPattern
          : collectionConfig.translations[currentLang];

      const url = urlPattern.replace(':slug', item.attributes.slug);
      urls.push({
        loc: [`${config.baseUrl}${url}`],
        lastmod: [item.attributes.updatedAt],
        changefreq: [collectionConfig.changefreq || config.defaultChangefreq],
        priority: [collectionConfig.priority || config.defaultPriority],
      });
    }

    if (item.attributes.localizations?.data) {
      item.attributes.localizations.data.forEach((localization) => {
        if (
          collectionConfig.excludeSlugs?.includes(localization.attributes.slug)
        ) {
          return;
        }

        if (localization.attributes.locale === currentLang) {
          if (
            collectionConfig.hasDraftPublish &&
            !localization.attributes.publishedAt
          ) {
            return;
          }

          const urlPattern =
            currentLang === config.defaultLanguage
              ? collectionConfig.urlPattern
              : collectionConfig.translations[currentLang];

          const url = urlPattern.replace(':slug', localization.attributes.slug);
          urls.push({
            loc: [`${config.baseUrl}${url}`],
            lastmod: [
              localization.attributes.updatedAt || item.attributes.updatedAt,
            ],
            changefreq: [
              collectionConfig.changefreq || config.defaultChangefreq,
            ],
            priority: [collectionConfig.priority || config.defaultPriority],
          });
        }
      });
    }
  });

  return urls;
}

module.exports = {
  fetchCollectionData,
  formatStrapiData,
  generateSitemapXML,
};
