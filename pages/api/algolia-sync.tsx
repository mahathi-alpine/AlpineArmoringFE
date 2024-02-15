// import algoliasearch from 'algoliasearch';
import { getPageData } from 'lib/api';

const syncAlgolia = async (req, res) => {
  try {
    // if (req.method === 'POST') {
    // const algoliaClient = algoliasearch(
    //     NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
    //     process.env.ALGOLIA_ADMIN_KEY
    // );

    // const index = algoliaClient.initIndex('dev_alpine');

    const pageSize = 20;
    const postsData = await getPageData({
      route: 'inventories',
      limit: pageSize,
    });
    const postCount = postsData.data.length;

    for (let page = 0; page < Math.ceil(postCount / pageSize); page++) {
      // const posts = postsData.data.slice(
      //   page * pageSize,
      //   (page + 1) * pageSize
      // );
      // const algoliaPosts = posts.map((post) => ({
      //   objectID: post.id,
      //   title: post.attributes.title,
      //   slug: post.attributes.slug,
      // }));
      // console.log(algoliaPosts);
      // await index.saveObjects(algoliaPosts);
    }
    res.json(`Content successfully synchronized with Algolia search`);

    // } else {
    //     res.status(405).json({ error: 'Method Not Allowed' });
    // }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.end();
  }
};

export default syncAlgolia;

// fetch('/api/algolia-sync', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ key: 'value' })
// });
