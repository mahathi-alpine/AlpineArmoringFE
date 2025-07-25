import { getPageData } from 'hooks/api';
import styles from './NewsSingle.module.scss';
import Link from 'next/link';
import routes from 'routes';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';
import Image from 'next/image';
import Head from 'next/head';
import LinkedinIcon from 'components/icons/Linkedin';
import { useState, useEffect } from 'react';
import CustomMarkdown from 'components/CustomMarkdown';
import SocialShare from 'components/global/social-share/SocialShare';
import Accordion from 'components/global/accordion/Accordion';
import Content from 'components/global/content/Content';

const getWordCount = (content, dynamicZone) => {
  let totalText = content || '';

  if (dynamicZone && Array.isArray(dynamicZone)) {
    dynamicZone.forEach((zone) => {
      if (zone.Content) totalText += ' ' + zone.Content;
      if (zone.content) totalText += ' ' + zone.content;
      if (zone.text) totalText += ' ' + zone.text;
    });
  }

  const plainText = totalText.replace(/<[^>]*>/g, '').replace(/[^\w\s]/g, '');

  return plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const calculateReadTime = () => {
  if (typeof window === 'undefined') return '1 min';

  const textElement = document.getElementById('blogContent');
  if (!textElement) return '1 min';

  const plainText = (textElement as HTMLElement).innerText
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s]/g, '');

  const words = plainText.trim().split(/\s+/).length;

  let minutes = Math.ceil(words / 400);
  minutes = Math.min(minutes, 30);

  return `${minutes} min`;
};

function BlogSingle(props) {
  const { lang } = useLocale();
  const router = useRouter();
  const { preview = false } = props;
  const [readTime, setReadTime] = useState('1 min');
  const [pageUrl, setPageUrl] = useState('');

  const data = props?.data?.data?.[0]?.attributes;

  useEffect(() => {
    if (data) {
      setReadTime(calculateReadTime());
    }
  }, [data]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, []);

  const date = data?.updatedAt ? new Date(data.updatedAt) : new Date();

  const contentData = {
    dynamicZone: data?.blogDynamic || [],
  };

  const faqsTitle = data?.faqsTitle;
  const faqs = data?.faqs || [];

  const formattedDate = date
    .toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '/');

  const content = data.content;

  const getBlogPostingtructuredData = () => {
    if (!data?.title || !data?.slug) return '{}';

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.blogsURL || '/blog'}/${data.slug}`,
      url: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.blogsURL || '/blog'}/${data.slug}`,
      headline: data.title,
      description: data?.excerpt || `${data.title} | Alpine Armoring`,
      image: data.thumbnail.data.attributes.url,
      datePublished: data.publishedAt,
      dateModified: data.updatedAt,
      author: {
        '@type': 'Person',
        name: data.authors.data?.attributes.Name || 'Dan Diana',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Alpine Armoring',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        url: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.blogsURL || '/blog'}/${data.slug}`,
      },
      // "articleSection": "Category Name",
      wordCount: props.wordCount || 1500,
      inLanguage: `${router.locale === 'en' ? 'en' : `${router.locale}`}`,
    };
    return JSON.stringify(structuredData);
  };

  const getBreadcrumbStructuredData = () => {
    if (!data?.title || !data?.slug) return '{}';

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang?.home || 'Home',
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang?.blog || 'Blog',
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.blogsURL || '/blog'}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data.title,
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.blogsURL || '/blog'}/${data.slug}`,
        },
      ],
    };
    return JSON.stringify(structuredData);
  };

  const getFAQStructuredData = () => {
    if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
      return null;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq, index) => {
        const title =
          faq?.attributes?.title || faq?.title || `FAQ ${index + 1}`;
        const text =
          faq?.attributes?.text ||
          faq?.text ||
          lang?.noAnswerProvided ||
          'No answer provided';

        return {
          '@type': 'Question',
          name: title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: text,
          },
        };
      }),
    };

    return JSON.stringify(structuredData);
  };

  if (!data) {
    return (
      <div className={`${styles.blogSingle}`}>
        <div className={`${styles.blogSingle_inner} container_small`}>
          <p>Blog post not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBlogPostingtructuredData() }}
          key="blogPosting-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
        {faqs?.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getFAQStructuredData() }}
            key="faq-jsonld"
          />
        )}
        {preview && <meta name="robots" content="noindex,nofollow" />}
      </Head>

      <div className={`${styles.blogSingle}`}>
        <div className={`${styles.blogSingle_inner} container_small`}>
          <div className={`b-breadcrumbs`}>
            <Link href="/">{lang?.home || 'Home'}</Link>
            <span>&gt;</span>
            <Link href={`${lang?.blogsURL || '/blog'}`}>
              {lang?.blog || 'Blog'}
            </Link>
            <span>&gt;</span>
            <span className={`b-breadcrumbs_current`}>{data.title}</span>
          </div>

          <h1 className={`${styles.blogSingle_title}`}>
            {data.title}
            {preview && (
              <span style={{ color: '#ff6b35', verticalAlign: 'middle' }}>
                {' '}
                (Preview)
                <Link
                  href="/api/exit-preview"
                  style={{
                    fontSize: '13px',
                    border: '1px solid #ff6b35',
                    padding: '5px',
                    marginLeft: '10px',
                  }}
                >
                  Exit Preview Mode
                </Link>
              </span>
            )}
          </h1>

          {data?.thumbnail?.data?.attributes?.url && (
            <Image
              src={
                data.thumbnail.data.attributes.formats?.large?.url ||
                data.thumbnail.data.attributes.url
              }
              alt={
                data.thumbnail.data.attributes.alternativeText ||
                'Alpine Armoring'
              }
              width={1280}
              height={700}
              className={`${styles.blogSingle_thumbnail}`}
            />
          )}

          <div className={`${styles.blogSingle_info}`}>
            <div className={`${styles.blogSingle_info_wrap}`}>
              {data?.authors?.data?.attributes && (
                <div className={`${styles.blogSingle_info_box}`}>
                  <span className={`${styles.blogSingle_info_box_heading}`}>
                    {lang?.author || 'Author'}
                    {data.authors.data.attributes.linkedinURL && (
                      <Link
                        href={data.authors.data.attributes.linkedinURL}
                        target="_blank"
                      >
                        <LinkedinIcon />
                      </Link>
                    )}
                  </span>
                  <Link
                    className={`${styles.blogSingle_info_box_name}`}
                    href={`${lang?.authorURL || '/author'}/${data.authors.data.attributes.slug}`}
                  >
                    {data.authors.data.attributes.Name}
                  </Link>
                </div>
              )}

              <div
                className={`${styles.blogSingle_info_box} ${styles.blogSingle_info_box_date}`}
              >
                <span className={`${styles.blogSingle_info_box_heading}`}>
                  {lang?.lastUpdated || 'Last Updated'}
                </span>
                <span className={`${styles.blogSingle_info_box_name}`}>
                  {formattedDate}
                </span>
              </div>

              <div className={`${styles.blogSingle_info_box}`}>
                <span className={`${styles.blogSingle_info_box_heading}`}>
                  {lang?.readTime || 'Read Time'}
                </span>
                <span className={`${styles.blogSingle_info_box_name}`}>
                  {readTime}
                </span>
              </div>
            </div>

            {pageUrl && data.title && (
              <SocialShare title={data.title} url={pageUrl} />
            )}
          </div>

          <div
            className={`${styles.blogSingle_content} static`}
            id="blogContent"
          >
            {content && (
              <div className={`${styles.blogSingle_content} static`}>
                <CustomMarkdown>{content}</CustomMarkdown>
              </div>
            )}

            <Content data={contentData} />
          </div>

          {data?.videos?.map((item, index) => (
            <div className={`center`} key={index}>
              <iframe
                width="860"
                height="500"
                src={`https://www.youtube.com/embed/${item.videoLink}?controls=0&showinfo=0&modestbranding=1`}
                title={item.text || 'Alpine Armoring'}
                frameBorder="0"
                allow="autoplay;"
                allowFullScreen
              />
            </div>
          ))}
        </div>

        {faqs?.length > 0 && (
          <div className={`mt2`}>
            <Accordion
              items={faqs}
              title={`${faqsTitle || lang?.faq || 'FAQ'}`}
            />
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticPaths({ locales }) {
  try {
    const route = routes.blog;

    const paths = [];

    for (const locale of locales) {
      const data = await getPageData({
        route: route.collectionSingle,
        params: '',
        fields: 'fields[0]=slug',
        pageSize: 100,
        locale,
      });

      if (data?.data) {
        data.data.forEach((post) => {
          paths.push({
            params: { slug: post.attributes.slug },
            locale,
          });
        });
      }
    }

    return {
      paths,
      fallback: 'blocking', // Generate new pages on-demand
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params, locale, preview = false }) {
  try {
    const route = routes.blog;

    // Add publicationState=preview when in preview mode
    const apiParams = preview
      ? `filters[slug][$eq]=${params.slug}&publicationState=preview`
      : `filters[slug][$eq]=${params.slug}`;

    const data = await getPageData({
      route: route.collectionSingle,
      params: apiParams,
      populate: 'deep',
      locale,
    });

    if (!data || !data.data || data.data.length === 0) {
      return {
        notFound: true,
        revalidate: 60,
      };
    }

    const currentPage = data.data[0]?.attributes;

    const seoData = {
      ...(currentPage?.seo ?? {}),
      metaTitle: currentPage?.seo?.metaTitle
        ? `${currentPage.seo.metaTitle} | Alpine Armoring® USA`
        : currentPage?.title || 'Alpine Armoring',
      metaDescription:
        currentPage?.seo?.metaDescription ||
        currentPage?.excerpt ||
        'Alpine Armoring',
      thumbnail: currentPage?.thumbnail?.data?.attributes ?? null,
      languageUrls: route.getLanguageUrls(currentPage, locale),
    };

    const wordCount = getWordCount(
      currentPage?.content,
      currentPage?.blogDynamic
    );

    return {
      props: {
        data,
        seoData,
        locale,
        preview,
        wordCount,
      },
      revalidate: preview ? 1 : 7200,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
      revalidate: 60,
    };
  }
}

export default BlogSingle;
