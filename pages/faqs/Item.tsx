import styles from './NewsSingle.module.scss';
import Link from 'next/link';
// import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';
import CustomMarkdown from 'components/CustomMarkdown';
import Content from 'components/global/content/Content';
// import Accordion from 'components/global/accordion/Accordion';

function Item(props) {
  const { lang } = useLocale();
  const router = useRouter();

  // Helper function to build locale-aware URLs
  const buildLocalizedUrl = (path: string): string => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return router.locale === 'en'
      ? normalizedPath
      : `/${router.locale}${normalizedPath}`;
  };

  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;
  const category = data?.knowledge_base_category?.data?.attributes;
  const contentData = {
    dynamicZone: data?.dynamicZone,
  };
  // const dynamicZone = data?.dynamicZone;
  // const faqsTitle = data?.faqsTitle;
  // const faqs = data?.faqs;

  const content = data?.content;

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
          name: lang.footerFaqsTitle,
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang.faqsURL}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data?.title?.replace(/\s+/g, ' ').replace(/\n/g, '').trim(),
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang.faqsURL}/${data?.slug}`,
        },
      ],
    };
    return JSON.stringify(structuredData);
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
        <title>{`${props?.seoData?.metaTitle || props?.data?.data[0]?.attributes?.title}`}</title>
      </Head>

      <div className={`${styles.blogSingle}`}>
        <div className={`${styles.blogSingle_inner} container_small`}>
          <div className={`b-breadcrumbs ${styles.blogSingle_breadcrumbs}`}>
            <Link href="/">{lang.home}</Link>
            <span>&gt;</span>
            <Link href={buildLocalizedUrl(lang.faqsURL)}>
              {lang.footerFaqsTitle}
            </Link>
            <span>&gt;</span>
            {category && (
              <>
                <Link
                  href={buildLocalizedUrl(`${lang.faqsURL}/${category.slug}`)}
                >
                  {category.title}
                </Link>
                <span>&gt;</span>
              </>
            )}
            <span className={`b-breadcrumbs_current`}>{data?.title}</span>
          </div>

          <h1 className={`${styles.blogSingle_title}`}>{data?.title}</h1>

          <div
            className={`${styles.blogSingle_content} static`}
            id="blogContent"
          >
            {content ? (
              <div className={`${styles.blogSingle_content} static`}>
                <CustomMarkdown>{content}</CustomMarkdown>
              </div>
            ) : null}

            <Content data={contentData} />
          </div>
        </div>

        {/* {faqs?.length > 0 ? (
          <div className={`mt2`}>
            <Accordion items={faqs} title={`${faqsTitle || lang.faqs}`} />
          </div>
        ) : null} */}
      </div>
    </>
  );
}

export default Item;
