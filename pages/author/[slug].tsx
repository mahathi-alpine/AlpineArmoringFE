import { getPageData } from 'hooks/api';
import useAnimationObserver from 'hooks/useAnimationObserver';
import useLocale from 'hooks/useLocale';
import Link from 'next/link';
import routes from 'routes';
import Head from 'next/head';
import { useRouter } from 'next/router';

import BlogList from 'components/global/news/News';
import styles from '../news/News.module.scss';
import LinkedinIcon from 'components/icons/Linkedin';
import CustomMarkdown from 'components/CustomMarkdown';

function BlogSingle(props) {
  const { lang } = useLocale();
  const router = useRouter();

  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;

  const news = data?.blogs?.data
    ? data.blogs.data.map((item) => ({
        ...item,
        category: 'news',
      }))
    : [];

  const blogs = data?.blog_evergreens?.data
    ? data.blog_evergreens.data.map((item) => ({
        ...item,
        category: 'blog',
      }))
    : [];

  let posts = news.concat(blogs);

  posts = posts.sort((a, b) => {
    const dateA = new Date(
      a.attributes?.date || a.attributes?.publishedAt
    ).getTime();
    const dateB = new Date(
      b.attributes?.date || b.attributes?.publishedAt
    ).getTime();

    return dateB - dateA;
  });

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  const getPersonStructuredData = () => {
    if (!data?.Name || !data?.slug) return '{}';

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${process.env.NEXT_PUBLIC_URL}${lang?.authorURL || '/author'}/${data.slug}`,
      name: data.Name,
      url: `${process.env.NEXT_PUBLIC_URL}${lang?.authorURL || '/author'}/${data.slug}`,
      ...(data.position && {
        jobTitle: data.position,
      }),
      worksFor: {
        '@type': 'Organization',
        name: 'Alpine Armoring',
      },
      ...(data.education && {
        alumniOf: data.education,
      }),
      ...(data.expertise && {
        knowsAbout: data.expertise,
      }),
      ...(data.linkedinURL && {
        sameAs: data.linkedinURL,
      }),
      ...(data.description && {
        description: data.description.substring(0, 500),
      }),
    };

    return JSON.stringify(structuredData);
  };

  const getBreadcrumbStructuredData = () => {
    if (!data?.Name || !data?.slug) return '{}';

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang?.home || 'Home',
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang?.authors || 'Authors',
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.authorURL || '/author'}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data.Name,
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.authorURL || '/author'}/${data.slug}`,
        },
      ],
    };

    return JSON.stringify(structuredData);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getPersonStructuredData() }}
          key="person-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
      </Head>

      <div className={`${styles.news_authorHeading} container_small`}>
        <div className={`b-breadcrumbs`}>
          <Link href="/">{lang?.home || 'Home'}</Link>
          <span>&gt;</span>
          <Link href={`${lang?.authorURL || '/author'}`}>
            {lang?.authors || 'Authors'}
          </Link>
          <span>&gt;</span>
          <span className={`b-breadcrumbs_current`}>{data.Name}</span>
        </div>

        <h1 className={`${styles.news_authorHeading_title}`}>
          <span>{data.Name}</span>
        </h1>

        <p className={`${styles.news_authorHeading_info}`}>
          {data.position}

          {data.linkedinURL ? (
            <Link href={data.linkedinURL} target="_blank">
              <LinkedinIcon />
            </Link>
          ) : null}
        </p>

        {data.description ? (
          <div className={`${styles.news_authorHeading_description} static`}>
            <CustomMarkdown>{data.description}</CustomMarkdown>
          </div>
        ) : null}
      </div>

      <h2 className={`c-title mt3`}>
        {lang.latestArticles} by {data.Name}
      </h2>

      {posts && posts.length > 0 ? (
        <div className={`${styles.news}`}>
          <BlogList featured props={posts} />
        </div>
      ) : null}
    </>
  );
}

export async function getServerSideProps({ params, locale }) {
  const route = routes.author;

  try {
    const data = await getPageData({
      route: route.collection,
      params: `filters[slug][$eq]=${params.slug}`,
      populate:
        'blogs, blogs.thumbnail, blog_evergreens, blog_evergreens.thumbnail, seo, localizations',
      locale,
    });

    const currentPage = data?.data?.[0]?.attributes;

    const seoData = {
      ...(data?.data?.[0]?.attributes?.seo || {}),
      languageUrls: route.getLanguageUrls(currentPage, locale),
    };

    if (!data || !data.data || data.data.length === 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: { data, seoData, locale },
    };
  } catch (error) {
    console.error('Error fetching author data:', error);
    return {
      notFound: true,
    };
  }
}

export default BlogSingle;
