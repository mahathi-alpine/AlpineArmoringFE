import algoliasearch from 'algoliasearch';
import { getPageData } from 'hooks/api';

const syncAlgolia = async (req, res) => {
  try {
    const algoliaClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    // Get the type and language from the request query
    const { type, lang = 'en' } = req.query;

    // Create language-specific index name
    // Use 'main_alpine' for English and 'main_alpine_xx' for other languages
    const indexName = lang === 'en' ? 'main_alpine' : `main_alpine_${lang}`;
    const index = algoliaClient.initIndex(indexName);

    const pageSize = 100;
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
      res.status(200).json({ message: 'No action taken' });
      return;
    }

    // Add language to the API request
    const postsData = await getPageData({
      route: route,
      pageSize: pageSize,
      locale: lang, // Add this parameter to fetch content in the specified language
    });

    const algoliaPosts = postsData.data.map((post) => ({
      objectID: `${category}-${post.id}-${lang}`, // Include language in objectID
      title: post.attributes.title,
      slug: post.attributes.slug,
      category: category,
      language: lang, // Add language field for filtering
    }));

    await index.saveObjects(algoliaPosts);

    res.json(
      `Content successfully synchronized with Algolia search for language: ${lang}`
    );
  } catch (error) {
    console.error('Algolia sync error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.end();
  }
};

export default syncAlgolia;
