import { useEffect } from 'react';
import { getPageData } from 'lib/api';
// import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import BlogList from 'components/global/news/News';
import styles from './News.module.scss';

function Blog(props) {
  const seoData = props?.pageData?.seo;
  //   const banner = props?.pageData?.banner;
  const posts = props?.posts;

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
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

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Seo props={seoData} />

      {/* {banner ? <Banner props={banner} center shape="white" /> : null} */}

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
  });
  posts = posts.data || null;

  return {
    props: { pageData, posts },
  };
}

export default Blog;
