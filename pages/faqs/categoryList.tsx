import styles from './CategoryList.module.scss';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';

function CategoryPage(props) {
  const { lang } = useLocale();
  const router = useRouter();

  // Helper function to build locale-aware URLs
  const buildLocalizedUrl = (path: string): string => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return router.locale === 'en'
      ? normalizedPath
      : `/${router.locale}${normalizedPath}`;
  };

  // Check if we have the category data
  const category = props?.category?.data?.[0]?.attributes;
  // Get all posts from this category
  const posts = category?.knowledge_bases?.data || [];

  // Function to extract excerpt from dynamicZone
  const extractExcerpt = (dynamicZone) => {
    if (
      !dynamicZone ||
      !Array.isArray(dynamicZone) ||
      dynamicZone.length === 0
    ) {
      return '';
    }

    // Find the first slices.text component
    const textComponent = dynamicZone.find(
      (component) =>
        component.__component === 'slices.text' && component.Content
    );

    if (!textComponent) {
      return '';
    }

    // Get the content from the text component
    const content = textComponent.Content;

    // Strip any markdown heading symbols, bold (**), and italic (_) formatting
    const cleanContent = content
      .replace(/^#+\s+/gm, '') // Remove heading markers
      .replace(/\*\*/g, '') // Remove bold markers (**)
      .replace(/_/g, ''); // Remove italic markers (_)

    // Split by sentence-ending punctuation (., !, ?)
    // This regex looks for ., ! or ? followed by a space or end of string
    const sentences = cleanContent.split(/(?<=[.!?])\s+/);

    // Take first two sentences or all if less than two
    const firstTwo = sentences.slice(0, 2);

    // Join them back and add ellipsis if there are more sentences
    let excerpt = firstTwo.join(' ');
    if (sentences.length > 2) {
      excerpt += '...';
    }

    return excerpt;
  };

  // Generate breadcrumb structured data
  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang.home,
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang.faq,
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang.faqsURL}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category?.title || '',
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang.faqsURL}/${category?.slug}`,
        },
      ],
    };
    return JSON.stringify(structuredData);
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      <Head>
        <title>
          {props.seoData?.metaTitle ||
            `${category.title} - ${lang.footerFaqsTitle} | Alpine Armoring`}
        </title>
        {/* {!props.seoData?.metaDescription && (
          <meta
            name="description"
            content={
              `${category.title} - ${lang.footerFaqsTitle}`
            }
          />
        )} */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
      </Head>

      <div className={styles.categoryPage}>
        <div className={`container_small`}>
          <h1 className={`${styles.categoryPage_title} c-title mt2`}>
            {lang.footerFaqsTitle}
            <strong>-{category.title}-</strong>
            <small>
              ({posts.length} {lang.articles.toLowerCase()})
            </small>
          </h1>

          <div className={`b-breadcrumbs`}>
            <Link href="/">{lang.home}</Link>
            <span>&gt;</span>
            <Link href={buildLocalizedUrl(lang.faqsURL)}>
              {lang.footerFaqsTitle}
            </Link>
            <span>&gt;</span>
            <span className={`b-breadcrumbs_current`}>{category.title}</span>
          </div>
        </div>

        <div className={`container_extrasmall`}>
          <div className={`${styles.categoryPage_list} mt2`}>
            {posts.length > 0 ? (
              posts.map((post) => {
                // Generate excerpt from dynamicZone if no explicit excerpt exists
                const postExcerpt =
                  post.attributes?.excerpt ||
                  extractExcerpt(post.attributes?.dynamicZone);

                return (
                  <div key={post.id} className={styles.categoryPage_list_item}>
                    <Link
                      href={buildLocalizedUrl(
                        `${lang.faqsURL}/${post.attributes?.slug || ''}`
                      )}
                      className={styles.postLink}
                    >
                      <h2 className={styles.categoryPage_list_item_title}>
                        {post.attributes?.title || 'Untitled'}
                      </h2>
                      {postExcerpt && (
                        <p className={styles.categoryPage_list_item_excerpt}>
                          {post.attributes.shortDescription || postExcerpt}
                        </p>
                      )}
                      <p className={styles.categoryPage_list_item_excerpt_more}>
                        Read More &gt;
                      </p>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className={styles.noPostsMessage}>
                {lang.noPosts || 'No articles found in this category.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
