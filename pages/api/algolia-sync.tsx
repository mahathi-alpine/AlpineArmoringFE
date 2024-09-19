import algoliasearch from 'algoliasearch';
import { getPageData } from 'hooks/api';

const syncAlgolia = async (req, res) => {
  try {
    const algoliaClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    const index = algoliaClient.initIndex('dev_alpine');

    const pageSize = 100;
    let route = '';
    let category = '';

    if (req.url === '/api/algolia-sync?type=available-now') {
      route = 'inventories';
      category = 'available-now';
    } else if (req.url === '/api/algolia-sync?type=vehicles-we-armor') {
      route = 'vehicles-we-armors';
      category = 'vehicles-we-armor';
    } else if (req.url === '/api/algolia-sync?type=news') {
      route = 'blogs';
      category = 'news';
    } else {
      res.status(200).json({ message: 'No action taken' });
      return;
    }

    const postsData = await getPageData({
      route: route,
      pageSize: pageSize,
    });

    const algoliaPosts = postsData.data.map((post) => ({
      objectID: category + '-' + post.id,
      title: post.attributes.title,
      slug: post.attributes.slug,
      category: category,
    }));

    await index.saveObjects(algoliaPosts);

    res.json(`Content successfully synchronized with Algolia search`);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.end();
  }
};

export default syncAlgolia;
