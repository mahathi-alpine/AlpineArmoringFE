import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import BlogList from 'components/global/news/News';
import styles from './News.module.scss';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Blog(props) {
  const banner = props?.pageData?.banner;
  const posts = props?.posts;

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => observerRef.current.observe(item));

    return () => {
      targets.forEach((item) => observerRef.current.unobserve(item));
    };
  }, []);

  return (
    <>
      {banner ? <Banner props={banner} center shape="white" /> : null}

      {posts ? (
        <div className={`${styles.news}`}>
          <BlogList props={posts} />
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'news-page',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  let posts = await getPageData({
    route: 'blogs',
    populate: 'deep',
    // sort: 'publishedAt',
    // sortType: 'desc',
    sort: 'order',
    pageSize: 200,
  });
  posts = posts.data || null;

  const seoData = pageData?.seo;

  return {
    props: { pageData, posts, seoData },
  };
}

export default Blog;
