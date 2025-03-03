import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import BlogList from 'components/global/news/News';
import styles from '../news/News.module.scss';
import Link from 'next/link';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import LinkedinIcon from 'components/icons/Linkedin';
import CustomMarkdown from 'components/CustomMarkdown';

function BlogSingle(props) {
  const { lang } = useLocale();

  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;

  const news =
    data?.blogs?.data?.map((item) => ({
      ...item,
      category: 'news',
    })) || [];

  const blogs =
    data?.blog_evergreens?.data?.map((item) => ({
      ...item,
      category: 'blog',
    })) || [];

  let posts = news.concat(blogs);

  posts = posts.sort((a, b) => {
    const dateA = new Date(
      a.attributes.date || a.attributes.publishedAt
    ).getTime();
    const dateB = new Date(
      b.attributes.date || b.attributes.publishedAt
    ).getTime();

    return dateB - dateA;
  });

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

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

      {posts ? (
        <div className={`${styles.news}`}>
          <BlogList featured props={posts} />
        </div>
      ) : null}
    </>
  );
}

export async function getServerSideProps({ params, locale }) {
  const route = routes.author;

  const data = await getPageData({
    route: route.collection,
    params: `filters[slug][$eq]=${params.slug}`,
    populate: 'deep',
    locale,
  });

  const seoData = {
    ...(data?.data?.[0]?.attributes?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  if (!data || !data.data || data.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data, seoData, locale },
  };
}

export default BlogSingle;
