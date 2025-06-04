import { getPageData } from 'hooks/api';
import routes from 'routes';
import Item from './Item';
import CategoryList from './categoryList';

function BlogSingle(props) {
  if (props.isPost) {
    return <Item {...props} />;
  } else if (props.isCategory) {
    return <CategoryList {...props} />;
  }
}

export async function getServerSideProps({ params, locale }) {
  const route = routes.faqs;
  const { slug } = params;

  // First, try to find a post with this slug
  const postData = await getPageData({
    route: route.collectionSingle,
    params: `filters[slug][$eq]=${slug}`,
    populate: 'deep',
    locale,
  });

  // If post exists, return post data for the BlogSingle component
  if (postData?.data?.length > 0) {
    const currentPage = postData?.data?.[0]?.attributes;

    const seoData = {
      ...(currentPage?.seo ?? {}),
      thumbnail: currentPage?.thumbnail?.data?.attributes ?? null,
      languageUrls: route.getLanguageUrls(currentPage, locale),
      metaTitle:
        `${currentPage?.seo?.metaTitle} | Alpine Armoring® USA` ||
        currentPage.title,
    };

    return {
      props: {
        data: postData,
        seoData,
        isPost: true,
        isCategory: false,
        locale,
      },
    };
  }

  // If post not found, try to find a category
  const categoryData = await getPageData({
    route: 'knowledge-base-categories',
    params: `filters[slug][$eq]=${slug}`,
    populate: 'deep',
    locale,
  });

  // If category exists, get all posts from this category
  if (categoryData?.data?.length > 0) {
    // SEO data for category page
    const currentCategory = categoryData?.data?.[0]?.attributes;
    const seoData = {
      ...(currentCategory?.seo ?? {}),
      title: `${currentCategory.title} - Knowledge Base`,
      description:
        currentCategory.description ||
        `Articles in the ${currentCategory.title} category`,
      thumbnail: currentCategory?.thumbnail?.data?.attributes ?? null,
      languageUrls: route.getLanguageUrls(currentCategory, locale),
    };

    return {
      props: {
        category: categoryData,
        // posts: categoryPosts,
        seoData,
        isPost: false,
        isCategory: true,
        locale,
      },
    };
  }

  // If neither post nor category found, return 404
  return {
    notFound: true,
  };
}

export default BlogSingle;
