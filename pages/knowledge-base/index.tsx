import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import { getPageData } from 'hooks/api';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import styles from './Knowledge.module.scss';
import { useMemo } from 'react';
import Link from 'next/link';

function KnowledgeBase(props) {
  const { lang } = useLocale();
  const posts = props?.posts || [];

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  // Group posts by category
  const categorizedPosts = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) return [];

    // First, collect all categories with their attributes
    const categories = {};

    posts.forEach((post) => {
      if (!post || typeof post !== 'object') return;

      const categoryData = post.attributes?.knowledge_base_category?.data;
      if (!categoryData) return;

      const categoryId = categoryData.id;

      if (!categories[categoryId]) {
        categories[categoryId] = {
          id: categoryId,
          attributes: categoryData.attributes || {},
          posts: [],
        };
      }

      categories[categoryId].posts.push(post);
    });

    // Convert to array and sort by the category order
    // Cast to any first to avoid TypeScript errors
    return Object.values(categories as any).sort((a: any, b: any) => {
      // Safe access to potentially undefined properties
      const aOrder = a.attributes?.order ?? 0;
      const bOrder = b.attributes?.order ?? 0;
      return aOrder - bOrder;
    });
  }, [posts]);

  return (
    <>
      <h1 className="c-title mt2">Knowledge Base</h1>

      {Array.isArray(posts) && posts.length > 0 ? (
        <div className={`${styles.knowledgeBase}`}>
          <div className={`container_small`}>
            <div className={`b-breadcrumbs`}>
              <Link href="/">{lang.home}</Link>
              <span>&gt;</span>
              {lang.knowledgeBase}
            </div>
          </div>

          <div className={`${styles.knowledgeBase_container} container_small`}>
            {categorizedPosts.map((category: any) => (
              <div key={category.id} className={styles.knowledgeBase_category}>
                <Link
                  href={`/knowledge-base/${category.attributes?.slug || ''}`}
                >
                  <h2 className={styles.knowledgeBase_category_title}>
                    {category.attributes?.title || 'Unknown Category'}
                  </h2>
                </Link>

                <div className={styles.knowledgeBase_category_count}>
                  {props.posts.length} Articles
                </div>

                <ul className={styles.knowledgeBase_list}>
                  {category.posts.map((post: any) => (
                    <li
                      key={post.id}
                      className={styles.knowledgeBase_list_item}
                    >
                      <Link
                        href={`/knowledge-base/${post.attributes?.slug || ''}`}
                      >
                        {post.attributes?.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/knowledge-base/${category.attributes?.slug || ''}`}
                  className={styles.knowledgeBase_category_all}
                >
                  View All Questions
                  <svg
                    width="16"
                    height="11"
                    viewBox="0 0 16 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 0C4.36364 0 1.25818 2.26182 0 5.45455C1.25818 8.64727 4.36364 10.9091 8 10.9091C11.6364 10.9091 14.7418 8.64727 16 5.45455C14.7418 2.26182 11.6364 0 8 0ZM8 9.09091C5.99273 9.09091 4.36364 7.46182 4.36364 5.45455C4.36364 3.44727 5.99273 1.81818 8 1.81818C10.0073 1.81818 11.6364 3.44727 11.6364 5.45455C11.6364 7.46182 10.0073 9.09091 8 9.09091ZM8 3.27273C6.79273 3.27273 5.81818 4.24727 5.81818 5.45455C5.81818 6.66182 6.79273 7.63636 8 7.63636C9.20727 7.63636 10.1818 6.66182 10.1818 5.45455C10.1818 4.24727 9.20727 3.27273 8 3.27273Z"
                      fill="#6f6044"
                    ></path>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.knowledgeBase;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  let posts = await getPageData({
    route: route.collectionSingle,
    populate: 'knowledge_base_category',
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

export default withLocaleRefetch(
  KnowledgeBase,
  {
    pageData: async (locale) => {
      const data = await getPageData({
        route: routes.knowledgeBase.collection,
        populate: 'deep',
        locale,
      });
      return data.data?.attributes || null;
    },
    posts: async (locale) => {
      const data = await getPageData({
        route: routes.knowledgeBase.collectionSingle,
        populate: 'knowledge_base_category',
        pageSize: 200,
        locale,
      });
      return data?.data || null;
    },
  },
  {
    routeName: 'knowledgeBase',
  }
);
