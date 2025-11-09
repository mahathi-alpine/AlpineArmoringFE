import useAnimationObserver from 'hooks/useAnimationObserver';
import { getPageData } from 'hooks/api';
import Head from 'next/head';
import { useRouter } from 'next/router';
import routes from 'routes';
import useLocale from 'hooks/useLocale';
import Banner from 'components/global/banner/Banner';
import NewsList from 'components/global/news/News';
import styles from './News.module.scss';

function News(props) {
  const { lang } = useLocale();
  const router = useRouter();
  const banner = props?.pageData?.banner;
  const posts = props?.posts;

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  const getCollectionPageStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['WebPage', 'CollectionPage'],
          '@id': `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.newsURL || '/news'}`,
          url: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.newsURL || '/news'}`,
          name: 'Armored Vehicle News & Updates | Alpine Armoring',
          description:
            'Stay informed with the latest news, updates, and industry insights from Alpine Armoring, a leader in armored vehicle innovation and security solutions.',
          isPartOf: { '@id': `${process.env.NEXT_PUBLIC_URL}/#website` },
          datePublished: props?.pageData?.createdAt,
          dateModified: props?.pageData?.updatedAt,
          inLanguage: 'en',
          thumbnailUrl: `${process.env.NEXT_PUBLIC_URL}/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Fpress_room_banner_top_45fd354bd3.jpg&w=2200&q=100`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: lang.home,
              item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: lang?.news || 'News',
              item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.newsURL || '/news'}`,
            },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${process.env.NEXT_PUBLIC_URL}/#website`,
          url: process.env.NEXT_PUBLIC_URL,
          name: 'Alpine Armoring',
          description: 'Alpine Armoring - Armored Vehicle Manufacturer',
          potentialAction: [
            {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_URL}/?s={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          ],
          inLanguage: 'en',
        },
      ],
    };
    return JSON.stringify(structuredData);
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: getCollectionPageStructuredData(),
          }}
          key="collectionPage-jsonld"
        />
      </Head>

      {banner ? <Banner props={banner} shape="white" /> : null}

      {posts ? (
        <div className={`${styles.news}`}>
          <NewsList featured props={posts} />
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.news;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  let posts = await getPageData({
    route: route.collectionSingle,
    populate: 'thumbnail, localizations',
    fields:
      'fields[0]=publishedAt&fields[1]=locale&fields[2]=title&fields[3]=slug&fields[4]=excerpt&fields[5]=title&fields[6]=date',
    sort: 'date',
    sortType: 'desc',
    pageSize: 200,
    locale,
  });
  posts = posts?.data || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, posts, seoData, locale },
  };
}

export default News;
