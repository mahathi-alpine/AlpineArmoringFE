import algoliasearch from 'algoliasearch';
import { getPageData } from 'hooks/api';

const syncAllLanguages = async (req, res) => {
  try {
    const algoliaClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    // Get the content type from the query
    const { type } = req.query;

    // Define supported languages
    const languages = ['en', 'es']; // Currently only English and Spanish

    // Content types to process
    const contentTypes = [];

    // If no type is specified, process all content types
    if (!type) {
      contentTypes.push(
        {
          type: 'available-now',
          route: 'inventories',
          category: 'available-now',
        },
        {
          type: 'vehicles-we-armor',
          route: 'vehicles-we-armors',
          category: 'vehicles-we-armor',
        },
        { type: 'news', route: 'blogs', category: 'news' },
        { type: 'blog', route: 'blog-evergreens', category: 'blogs' }
      );
    } else {
      // Process just the specified content type
      let route = '';
      let category = '';

      if (type === 'available-now') {
        route = 'inventories';
        category = 'available-now';
      } else if (type === 'vehicles-we-armor') {
        route = 'vehicles-we-armors';
        category = 'vehicles-we-armor';
      } else if (type === 'news') {
        route = 'blogs';
        category = 'news';
      } else if (type === 'blog') {
        route = 'blog-evergreens';
        category = 'blogs';
      } else {
        res.status(400).json({ error: 'Invalid content type' });
        return;
      }

      contentTypes.push({ type, route, category });
    }

    const results = {};
    const manualRecordSummary = {};

    // Process each content type and language
    for (const contentType of contentTypes) {
      results[contentType.type] = {};
      manualRecordSummary[contentType.type] = {};

      for (const lang of languages) {
        const indexName = lang === 'en' ? 'main_alpine' : `main_alpine_${lang}`;
        const index = algoliaClient.initIndex(indexName);

        try {
          // First, fetch all existing records for this category to identify manual ones
          const { hits } = await index.search('', {
            filters: `category:${contentType.category}`,
            hitsPerPage: 1000,
          });

          // Store manually added records (those that don't follow the standard objectID pattern)
          const manualRecords = hits.filter((record) => {
            // Assuming manual records don't follow your pattern of category-id-lang
            const pattern = new RegExp(
              `^${contentType.category}-\\d+-${lang}$`
            );
            return !pattern.test(record.objectID);
          });

          manualRecordSummary[contentType.type][lang] = manualRecords.length;

          // Get content in the current language
          const postsData = await getPageData({
            route: contentType.route,
            pageSize: 100,
            locale: lang,
          });

          if (!postsData.data || postsData.data.length === 0) {
            results[contentType.type][lang] =
              `No CMS data found for ${contentType.type} in ${lang}`;
            continue;
          }

          const algoliaPosts = postsData.data.map((post) => ({
            objectID: `${contentType.category}-${post.id}-${lang}`,
            title: post.attributes.title,
            slug: post.attributes.slug,
            category: contentType.category,
            language: lang,
          }));

          // Combine the arrays - CMS content + manual records
          const allRecords = [...algoliaPosts, ...manualRecords];

          // First, delete all records that match the CMS pattern (not the manual ones)
          const idsToDelete = hits
            .filter((record) => {
              const pattern = new RegExp(
                `^${contentType.category}-\\d+-${lang}$`
              );
              return pattern.test(record.objectID);
            })
            .map((record) => record.objectID);

          if (idsToDelete.length > 0) {
            await index.deleteObjects(idsToDelete);
          }

          // Then add all records (CMS + manual)
          await index.saveObjects(allRecords);

          results[contentType.type][lang] =
            `Indexed ${algoliaPosts.length} CMS items and preserved ${manualRecords.length} manual records for ${contentType.type} in ${lang}`;
        } catch (error) {
          console.error(
            `Error indexing ${contentType.type} in ${lang}:`,
            error
          );
          results[contentType.type][lang] = `Error: ${error.message}`;
        }
      }
    }

    res.status(200).json({
      message: 'Content synchronized with Algolia search for all languages',
      details: results,
      manualRecordSummary,
    });
  } catch (error) {
    console.error('Algolia sync error:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message });
  }
};

export default syncAllLanguages;
