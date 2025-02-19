import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import Banner from 'components/global/banner/Banner';
import BlogList from 'components/global/news/News';
import styles from './News.module.scss';

function Blog(props) {
  const banner = props?.pageData?.banner;
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
      {banner ? <Banner props={banner} shape="white" /> : null}

      {posts ? (
        <div className={`${styles.news}`}>
          <BlogList
            featured
            props={posts}
            type="blog"
            // subtitle="Latest News"
            // title="Armoring World"
          />
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'blog-page',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  let posts = await getPageData({
    route: 'blog-evergreens',
    populate: 'deep',
    sort: 'date',
    sortType: 'desc',
    pageSize: 200,
  });
  posts = posts?.data || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, posts, seoData },
  };
}

export default Blog;
