import Head from 'next/head';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import { getPageData } from 'hooks/api';
import routes from 'routes';
import MediaList from '../MediaList';

function Videos(props) {
  const title = props?.pageData?.titleH1;
  const videos = props?.videos;
  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  const generateVideoStructuredData = () => {
    if (!videos || !Array.isArray(videos)) return null;

    // Group videos by category
    const categoryMap = new Map();
    videos.forEach((video) => {
      const category = video.attributes.videoCategory;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category).push(video);
    });

    // Generate separate schema for each category
    const schemas = [];

    categoryMap.forEach((categoryVideos, category) => {
      const videoObjects = categoryVideos.map((video) => {
        const attributes = video.attributes;
        const cleanYouTubeId = attributes.URLExternal?.trim();

        return {
          '@type': 'VideoObject',
          name: attributes.title || '',
          description:
            `${attributes.description}, Location: ${attributes.location}` ||
            attributes.title ||
            '',
          thumbnailUrl: `https://i.ytimg.com/vi/${cleanYouTubeId}/sddefault.jpg`,
          uploadDate: attributes.createdAt || attributes.updatedAt,
          duration: attributes.duration ? `PT${attributes.duration}` : 'PT2M0S',
          contentUrl: `https://www.youtube.com/watch?v=${cleanYouTubeId}`,
          embedUrl: `https://www.youtube.com/embed/${cleanYouTubeId}`,
          publisher: {
            '@type': 'Organization',
            name: 'Alpine Armoring',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.alpineco.com/assets/Alpine-Armoring-Armored-Vehicles.png',
            },
          },
          ...(attributes.location && {
            locationCreated: {
              '@type': 'Place',
              name: attributes.location,
            },
          }),
          ...(attributes.videoCategory && {
            genre: attributes.videoCategory,
          }),
        };
      });

      const categorySchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: category,
        itemListElement: videoObjects.map((video, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: video,
        })),
      };

      schemas.push(categorySchema);
    });

    return schemas;
  };

  const videoStructuredData = generateVideoStructuredData();

  return (
    <>
      <Head>
        {videoStructuredData &&
          videoStructuredData.map((schema, index) => (
            <script
              key={`video-jsonld-${index}`}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema),
              }}
            />
          ))}
      </Head>

      {title ? <h1 className="c-title mt2">{title}</h1> : null}

      <MediaList props={videos} itemType="video" />
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.videos;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  let videos = await getPageData({
    route: route.collectionSingle,
    sort: 'order',
    sortType: 'desc',
    pageSize: 1000,
    populate: 'deep',
    locale,
  });
  videos = videos?.data || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, videos, seoData, locale },
  };
}

export default withLocaleRefetch(
  Videos,
  {
    pageData: async (locale) => {
      const data = await getPageData({
        route: routes.videos.collection,
        populate: 'deep',
        locale,
      });
      return data.data?.attributes || null;
    },
    videos: async (locale) => {
      const data = await getPageData({
        route: routes.videos.collectionSingle,
        sort: 'order',
        sortType: 'desc',
        pageSize: 1000,
        populate: 'deep',
        locale,
      });
      return data?.data || null;
    },
  },
  {
    includeSeo: true,
    routeName: 'videos',
    debug: process.env.NODE_ENV === 'development',
  }
);
