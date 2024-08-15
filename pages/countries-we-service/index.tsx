import { useEffect } from 'react';
import { getPageData } from 'lib/api';
// import Banner from 'components/global/banner/Banner';
import ArticleList from 'components/global/article/Article';
import styles from './Article.module.scss';

function Article(props) {
  // const banner = props?.pageData?.banner;
  const posts = props?.posts;

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
      {/* {banner ? <Banner props={banner} center shape="white" /> : null} */}

      {posts ? (
        <div className={`${styles.article}`}>
          <ArticleList
            featured
            props={posts}
            subtitle="Locations We Service"
            // title="Landing Pages"
          />
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'landing-page',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  const pageSize = 100;
  let allPosts = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await getPageData({
      route: 'articles',
      populate: 'deep',
      sort: 'excerpt',
      pageSize: pageSize,
      page: page,
    });
    const posts = response?.data || [];
    allPosts = [...allPosts, ...posts];
    totalPages = response?.meta?.pagination?.pageCount || 1;
    page++;
  }

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, posts: allPosts, seoData },
  };
}

export default Article;
