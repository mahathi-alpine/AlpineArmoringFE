import { getPageData } from 'hooks/api';
import useAnimationObserver from 'hooks/useAnimationObserver';
import useLocale from 'hooks/useLocale';
import Link from 'next/link';
import routes from 'routes';

import BlogList from 'components/global/news/News';
import styles from '../news/News.module.scss';
import LinkedinIcon from 'components/icons/Linkedin';
import CustomMarkdown from 'components/CustomMarkdown';

function BlogSingle(props) {
  const { lang } = useLocale();

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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={`${styles.news_authorHeading} container_small`}>
        <h1 className={`${styles.news_authorHeading_title}`}>
          {lang.author}: <span>{data.Name}</span>
        </h1>
        {data.linkedinURL ? (
          <Link href={data.linkedinURL} target="_blank">
            <LinkedinIcon />
          </Link>
        ) : null}
        {data.description ? (
          <div className={`${styles.news_authorHeading_description} static`}>
            <CustomMarkdown>{data.description}</CustomMarkdown>
          </div>
        ) : null}
      </div>

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
        'blogs, blogs.thumbnail, blog_evergreens, blog_evergreens.thumbnail, seo',
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
