import { getPageData } from 'hooks/api';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';
import useAnimationObserver from 'hooks/useAnimationObserver';
import Banner from 'components/global/banner/Banner';
import BlogList from 'components/global/news/News';
import styles from './News.module.scss';
import routes from 'routes';

function Blog(props) {
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
          '@id': `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.blogsURL || '/blog'}`,
          url: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.blogsURL || '/blog'}`,
          name: 'Armored Vehicles Blog | Bulletproof Cars & Security Insights - Alpine Armoring',
          description:
            'Expert insights on armored vehicles, bulletproof cars, and armoring technology. Get the latest industry news, reviews, and security solutions from leading professionals.',
          isPartOf: {
            '@id': `${process.env.NEXT_PUBLIC_URL}/#website`,
          },
          datePublished: props?.pageData?.createdAt,
          dateModified: props?.pageData?.updatedAt,
          inLanguage: 'en',
          thumbnailUrl: `${process.env.NEXT_PUBLIC_URL}/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Fblog_banner_top_a20093f7c5.jpg&w=2200&q=100`,
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
              name: lang?.blog || 'Blog',
              item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.blogsURL || '/blog'}`,
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
          <BlogList featured props={posts} type="blog" />
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.blog;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  let posts = await getPageData({
    route: route.collectionSingle,
    populate: 'thumbnail, authors, localizations',
    fields:
      'fields[0]=publishedAt&fields[1]=locale&fields[2]=title&fields[3]=slug&fields[4]=excerpt&fields[5]=title&fields[6]=date',
    sort: 'publishedAt',
    sortType: 'desc',
    pageSize: 50,
    locale,
  });
  posts = posts?.data || null;

  // Sort posts: prioritize custom 'date' field if set, otherwise use 'publishedAt'
  if (posts && Array.isArray(posts)) {
    posts = posts.sort((a, b) => {
      const dateA = a.attributes?.date || a.attributes?.publishedAt;
      const dateB = b.attributes?.date || b.attributes?.publishedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, posts, seoData, locale },
  };
}

export default Blog;
