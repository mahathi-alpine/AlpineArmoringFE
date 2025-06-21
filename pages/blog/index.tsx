import { getPageData } from 'hooks/api';
import useAnimationObserver from 'hooks/useAnimationObserver';
import Banner from 'components/global/banner/Banner';
import BlogList from 'components/global/news/News';
import styles from './News.module.scss';
import routes from 'routes';

function Blog(props) {
  const banner = props?.pageData?.banner;
  const posts = props?.posts;

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  return (
    <>
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
    populate: 'thumbnail',
    fields:
      'fields[0]=publishedAt&fields[1]=locale&fields[2]=title&fields[3]=slug&fields[4]=excerpt&fields[5]=title&fields[6]=date',
    sort: 'date',
    sortType: 'desc',
    pageSize: 50,
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

export default Blog;
