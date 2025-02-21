import { getPageData } from 'hooks/api';
import styles from './NewsSingle.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import PlayIcon from 'components/icons/Play2';
import LinkedinIcon from 'components/icons/Linkedin';
import { useState, useEffect } from 'react';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import CustomMarkdown from 'components/CustomMarkdown';
import SocialShare from 'components/global/social-share/SocialShare';
import Accordion from 'components/global/accordion/Accordion';

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
  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;
  // const categories = data?.categories?.data;
  const date = new Date(data?.updatedAt);
  const dynamicZone = data?.blogDynamic;
  const faqsTitle = data?.faqsTitle;
  const faqs = data?.faqs;
  const [readTime, setReadTime] = useState('1 min');

  useEffect(() => {
    setReadTime(calculateReadTime());
  });

  const formattedDate = date
    .toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '/');

  const content = data?.content;

  const [pageUrl, setPageUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, []);

  // Lightbox
  const [selectedTitle, setSelectedTitle] = useState('');
  const [contentType, setContentType] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  const handleLightboxOpen = (title, location, contentType, url = null) => {
    setSelectedTitle(title);
    setContentType(contentType);
    if (contentType === 'video') {
      setVideoSrc(url);
    }
    setLightboxPopupOpen(true);
  };

  const lightboxData = {
    title: selectedTitle,
    contentType: contentType,
    videoSrc: videoSrc,
  };

  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.alpineco.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `https://www.alpineco.com/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data?.title,
          item: `https://www.alpineco.com/blog/${data?.slug}`,
        },
      ],
    };
    return JSON.stringify(structuredData);
  };

  // FAQ structured data
  const getFAQStructuredData = () => {
    if (!faqs || !Array.isArray(faqs)) {
      console.error('FAQs is not an array:', faqs);
      return null;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq, index) => {
        const title =
          faq?.attributes?.title || faq?.title || `FAQ ${index + 1}`;
        const text = faq?.attributes?.text || faq?.text || 'No answer provided';

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
            <Link href="/">Home</Link>
            <span>&gt;</span>
            <Link href="/blog">Blog</Link>
            <span>&gt;</span>
            <span className={`b-breadcrumbs_current`}>{data?.title}</span>
          </div>

          {/* <div className={`${styles.blogSingle_tags}`}>
            {categories?.map((item, index) => (
              <div className={`${styles.blogSingle_tags_item}`} key={index}>
                {item.attributes.name}
              </div>
            ))}
          </div> */}

          <h1 className={`${styles.blogSingle_title}`}>{data?.title}</h1>

          {data?.thumbnail.data?.attributes.url ? (
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
            ></Image>
          ) : null}

          <div className={`${styles.blogSingle_info}`}>
            <div className={`${styles.blogSingle_info_wrap}`}>
              {data?.authors?.data ? (
                <div className={`${styles.blogSingle_info_box}`}>
                  <span className={`${styles.blogSingle_info_box_heading}`}>
                    Author
                    {data.authors.data.attributes.linkedinURL ? (
                      <Link
                        href={data.authors.data.attributes.linkedinURL}
                        target="_blank"
                      >
                        <LinkedinIcon />
                      </Link>
                    ) : null}
                  </span>
                  <Link
                    className={`${styles.blogSingle_info_box_name}`}
                    href={`/author/${data.authors.data.attributes.slug}`}
                  >
                    {data.authors.data.attributes.Name}
                  </Link>
                </div>
              ) : null}

              <div
                className={`${styles.blogSingle_info_box} ${styles.blogSingle_info_box_date}`}
              >
                <span className={`${styles.blogSingle_info_box_heading}`}>
                  Last Updated
                </span>
                <span className={`${styles.blogSingle_info_box_name}`}>
                  {formattedDate}
                </span>
              </div>

              <div className={`${styles.blogSingle_info_box}`}>
                <span className={`${styles.blogSingle_info_box_heading}`}>
                  Read Time
                </span>
                <span className={`${styles.blogSingle_info_box_name}`}>
                  {readTime}
                </span>
              </div>
            </div>

            {pageUrl && data?.title && (
              <SocialShare title={data.title} url={pageUrl} />
            )}
          </div>

          <div
            className={`${styles.blogSingle_content} static`}
            id="blogContent"
          >
            {content ? (
              <div className={`${styles.blogSingle_content} static`}>
                <CustomMarkdown>{content}</CustomMarkdown>
              </div>
            ) : null}

            {dynamicZone?.map((component, index) => {
              switch (component.__component) {
                case 'slices.text': {
                  return (
                    <div className={`text-wrap`} key={index}>
                      <CustomMarkdown>{component.Content}</CustomMarkdown>
                    </div>
                  );
                }
                case 'slices.single-media':
                  if (
                    component.media.data.attributes.mime.startsWith('video/')
                  ) {
                    return (
                      <video autoPlay muted loop key={index}>
                        <source
                          src={component.media.data.attributes.url}
                          type={component.media.data.attributes.mime}
                        />
                      </video>
                    );
                  } else {
                    return (
                      <Image
                        key={index}
                        src={
                          component.media.data.attributes.formats.large.url ||
                          component.media.data.attributes.url
                        }
                        alt={
                          component.media.data.attributes.alternativeText || ''
                        }
                        width={
                          component.media.data.attributes.formats.large.width ||
                          component.media.data.attributes.width
                        }
                        height={
                          component.media.data.attributes.formats.large
                            .height || component.media.data.attributes.height
                        }
                      />
                    );
                  }
                default:
                  return null;
              }
            })}
          </div>

          {data?.videos.map((item, index) => (
            <div
              className={`${styles.blogSingle_video}`}
              key={index}
              onClick={() =>
                handleLightboxOpen(item.text, '', 'video', item.videoLink)
              }
            >
              <span>{item.text}</span>
              <PlayIcon />
            </div>
          ))}
        </div>

        {faqs?.length > 0 ? (
          <div className={`mt2`}>
            <Accordion items={faqs} title={`${faqsTitle || 'FAQs'}`} />
          </div>
        ) : null}

        {isLightboxPopupOpen ? (
          <LightboxCustom
            isLightboxPopupOpen={isLightboxPopupOpen}
            lightboxData={lightboxData}
            setLightboxPopupOpen={setLightboxPopupOpen}
          />
        ) : null}
      </div>
    </>
  );
}

export async function getServerSideProps({ params, locale }) {
  const data = await getPageData({
    route: 'blog-evergreens',
    params: `filters[slug][$eq]=${params.slug}`,
    populate: 'deep',
    locale,
  });

  const seoData = data?.data?.[0]?.attributes?.seo ?? null;
  if (seoData) {
    seoData.thumbnail =
      data?.data?.[0]?.attributes?.thumbnail?.data.attributes ?? null;
  }

  if (!data || !data.data || data.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data, seoData, locale },
  };
}

export default BlogSingle;
