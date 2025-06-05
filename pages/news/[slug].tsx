import { getPageData } from 'hooks/api';
import styles from './NewsSingle.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import routes from 'routes';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';
import LinkedinIcon from 'components/icons/Linkedin';
import { useState, useEffect } from 'react';
import CustomMarkdown from 'components/CustomMarkdown';
import SocialShare from 'components/global/social-share/SocialShare';
import Accordion from 'components/global/accordion/Accordion';
import Content from 'components/global/content/Content';

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

  if (!data) {
    return (
      <div className={`${styles.blogSingle}`}>
        <div className={`${styles.blogSingle_inner} container_small`}>
          <p>News article not found</p>
        </div>
      </div>
    );
  }

  const date = data.updatedAt ? new Date(data.updatedAt) : new Date();

  const contentData = {
    dynamicZone: data.blogDynamic || [],
  };

  const faqsTitle = data.faqsTitle;
  const faqs = data.faqs || [];

  const formattedDate = date
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '/');

  const content = data.content;

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
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang?.news || 'News',
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.newsURL || '/news'}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data.title?.replace(/\s+/g, ' ').replace(/\n/g, '').trim(),
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.newsURL || '/news'}/${data.slug}`,
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

  return (
    <>
      <Head>
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
      </Head>

      <div className={`${styles.blogSingle}`}>
        <div className={`${styles.blogSingle_inner} container_small`}>
          <div className={`b-breadcrumbs`}>
            <Link href="/">{lang?.home || 'Home'}</Link>
            <span>&gt;</span>
            <Link href={`${lang?.newsURL || '/news'}`}>
              {lang?.news || 'News'}
            </Link>
            <span>&gt;</span>
            <span className={`b-breadcrumbs_current`}>{data.title}</span>
          </div>

          <h1 className={`${styles.blogSingle_title}`}>{data.title}</h1>

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
              title={`${faqsTitle || lang?.faqs || 'FAQ'}`}
            />
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ params, locale }) {
  try {
    const route = routes.news;

    const data = await getPageData({
      route: route.collectionSingle,
      params: `filters[slug][$eq]=${params.slug}`,
      populate: 'deep',
      locale,
    });

    if (!data || !data.data || data.data.length === 0) {
      return {
        notFound: true,
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

    return {
      props: { data, seoData, locale },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
}

export default BlogSingle;
