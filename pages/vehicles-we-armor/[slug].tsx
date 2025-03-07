import styles from './Vehicle.module.scss';
import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import Link from 'next/link';
import useLocale from 'hooks/useLocale';
import Head from 'next/head';
import Banner from 'components/vehicle-we-armor/Banner';
import CustomMarkdown from 'components/CustomMarkdown';
import ComparisonSlider from 'components/global/comparison-slider/ComparisonSlider';
import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';
import Image from 'next/image';
import Gallery from 'components/global/carousel/CarouselCurved';
import VideoScale from 'components/global/video-scale/VideoScale';
import InquiryForm from 'components/global/form/InquiryForm';
import { animateVideo } from 'components/global/video-scale/VideoScale';
import Accordion from 'components/global/accordion/Accordion';

function Vehicle(props) {
  const { lang } = useLocale();

  useEffect(() => {
    const setupObserver = () => {
      const observerAnimationTargets = document.querySelectorAll('.observe');
      if (observerAnimationTargets.length < 1) {
        setTimeout(setupObserver, 100);
        return;
      }

      const observerAnimation = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.toggle('in-view', entry.isIntersecting);
              observerAnimation.unobserve(entry.target);

              // VideoScale
              if (entry.target.classList.contains('videoScaleContainer')) {
                window.addEventListener(
                  'scroll',
                  () => animateVideo(entry.target),
                  { passive: true }
                );
              }
            } else {
              if (entry.target.classList.contains('videoScaleContainer')) {
                window.removeEventListener('scroll', () =>
                  animateVideo(entry.target)
                );
              }
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.2,
        }
      );

      observerAnimationTargets.forEach((item) =>
        observerAnimation.observe(item)
      );

      return () => {
        observerAnimationTargets.forEach((item) =>
          observerAnimation.unobserve(item)
        );
        observerAnimation.disconnect();
      };
    };

    setupObserver();
  }, []);

  if (!props.data?.data?.[0]) {
    return <div>{lang.loading}</div>;
  }

  const data = props?.data?.data?.[0]?.attributes ?? {};

  const inventory = data?.stock?.data;
  const beforeAfterSlider_Before =
    data?.beforeAfterSlider?.before?.data?.attributes;
  const beforeAfterSlider_After =
    data?.beforeAfterSlider?.after?.data?.attributes;

  const dimensions1 = data?.dimensions1?.data?.attributes;
  const dimensions2 = data?.dimensions2?.data?.attributes;

  const gallery = data?.gallery?.data;

  const videoWebm = data?.videoUpload?.data?.attributes;
  const videoMP4 = data?.videoMP4?.data?.attributes;

  const faqs = data?.faqs;

  let navItems = [
    {
      titleNav: 'Overview',
      isVisible: data?.description ? true : false,
    },
    {
      titleNav: 'Gallery',
      isVisible: data?.gallery?.data ? true : false,
    },
    {
      titleNav: 'Dimensions',
      isVisible:
        data?.dimensions1?.data && data?.dimensions2?.data ? true : false,
    },
    {
      titleNav: 'Armoring Features',
      isVisible: data?.armoringFeatures?.data.length > 0 ? true : false,
    },
    {
      titleNav: 'Conversion Accessories',
      isVisible: data?.conversionAccessories?.data.length > 0 ? true : false,
    },
    {
      titleNav: 'Communications & Electronics',
      isVisible: data?.communications?.data.length > 0 ? true : false,
    },
    {
      titleNav: 'Other Options',
      isVisible: data?.otherOptions?.data.length > 0 ? true : false,
    },
    {
      titleNav: 'Request a quote',
      button: true,
      isVisible: true,
    },
  ];

  navItems = navItems.filter((item) => item.isVisible);

  const banner = {
    title: data?.title,
    featuredImage: data?.featuredImage,
    descriptionBanner: data?.descriptionBanner,
    slug: data?.slug,
    inventory: inventory,
    pdf: data?.pdf,
    protectionLevel: data?.protectionLevel,
    navItems: navItems,
    videoURL: data?.videoURL,
  };

  const formData = {
    title: data?.title,
    featuredImage: data?.featuredImage,
  };

  // Product structured data
  const getProductStructuredData = () => {
    return {
      '@context': 'https://schema.org/',
      '@type': ['Product'],
      name: data?.title?.replace('\n', ' '),
      image: data?.featuredImage?.data?.attributes?.url,
      description:
        props.seoData?.metaDescription || data?.title?.replace('\n', ' '),
      url: `https://www.alpineco.com/vehicles-we-armor/${data?.slug}`,
      brand: {
        '@type': 'Brand',
        name: 'Alpine Armoring® Armored Vehicles',
      },
      sku: `Alpine-${data?.slug}`,
      offers: {
        '@type': 'AggregateOffer',
        url: `https://www.alpineco.com/vehicles-we-armor/${data?.slug}`,
        priceCurrency: 'USD',
        lowPrice: '50000',
        highPrice: '200000',
        offerCount: '1',
        availability: 'https://schema.org/InStock',
        // itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: 'Alpine Armoring',
        },
        description: 'Price available upon request. Contact us for details.',
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Offered At Protection Levels',
          value: data.protectionLevel || 'A4, A6, A9, A11',
        },
      ],
    };
  };

  // Breadcrumb structured data
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
          name: 'Vehicles we armor',
          item: `https://www.alpineco.com/vehicles-we-armor`,
        },
        // {
        //   '@type': 'ListItem',
        //   position: 3,
        //   name: category,
        //   item: `https://www.alpineco.com/vehicles-we-armor/type/${categorySlug}`,
        // },
        {
          '@type': 'ListItem',
          position: 3,
          name: data?.title,
          item: `https://www.alpineco.com/vehicles-we-armor/${data?.slug}`,
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

  // Image structured data
  const getImageStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: data?.featuredImage?.data?.attributes?.url,
      creditText:
        data?.featuredImage?.data?.attributes?.alternativeText ||
        data?.title?.replace('\n', ' '),
      creator: {
        '@type': 'Person',
        name: 'Alpine Armoring',
      },
      copyrightNotice: 'Alpine Armoring',
    };
    return JSON.stringify(structuredData);
  };

  if (!props.data) {
    console.error('Missing or malformed data structure');
    return null;
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getImageStructuredData() }}
          key="image-jsonld"
        />
        {faqs?.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getFAQStructuredData() }}
            key="faq-jsonld"
          />
        )}
        {getProductStructuredData() && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(getProductStructuredData()),
            }}
            key="product-jsonld"
          />
        )}
      </Head>

      <div className={`${styles.slug_wrapper}`}>
        <div
          className={`${styles.slug_breadcrumbs} b-breadcrumbs b-breadcrumbs-list b-breadcrumbs-dark container`}
        >
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <Link href="/vehicles-we-armor">Vehicles We Armor</Link>
          <span>&gt;</span>
          <span className={`b-breadcrumbs_current`}>{data?.slug}</span>
        </div>

        <Banner props={banner} />

        {data?.description ? (
          <div
            id="overview"
            className={`${styles.slug_description} anchor container_small`}
          >
            <h2 className={`c-title`}>Overview of {data?.title}</h2>

            <CustomMarkdown>{data.description}</CustomMarkdown>
          </div>
        ) : null}

        {gallery ? (
          <div
            className={`${styles.slug_gallery} observe fade-in anchor`}
            id="gallery"
          >
            <Gallery props={gallery} white regular />
          </div>
        ) : null}

        {dimensions1 && dimensions2 ? (
          <div
            className={`${styles.slug_dimensions} container anchor`}
            id="dimensions"
          >
            <h2
              className={`${styles.slug_dimensions_title} observe fade-in c-title`}
            >
              Dimensions for {data?.title}
            </h2>
            <div className={`${styles.slug_dimensions_wrap}`}>
              <div
                className={`${styles.slug_dimensions_wrap_image} observe fade-in`}
              >
                <div className={`${styles.slug_dimensions_wrap_image_box}`}>
                  <Image
                    src={dimensions1.formats?.large?.url || dimensions1.url}
                    alt={dimensions1.alternativeText || 'Alpine Armoring'}
                    width={dimensions1.width}
                    height={dimensions1.height}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div
                className={`${styles.slug_dimensions_wrap_image} observe fade-in`}
              >
                <Image
                  src={dimensions2.formats?.large?.url || dimensions2.url}
                  alt={dimensions2.alternativeText || 'Alpine Armoring'}
                  width={dimensions2.width}
                  height={dimensions2.height}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        ) : null}

        {beforeAfterSlider_Before && beforeAfterSlider_After ? (
          <div className={`${styles.slug_slider_wrap} observe fade-in anchor`}>
            <div className={`shape-before`}></div>

            <div className={`${styles.slug_slider} background-dark`}>
              <ComparisonSlider
                beforeImage={beforeAfterSlider_Before}
                afterImage={beforeAfterSlider_After}
              />
              <p className={`${styles.slug_slider_small}`}>
                <small>
                  The actual custom-armoring conversion may vary per each
                  vehicle’s structural configuration and client’s final specs
                </small>
              </p>
            </div>

            <div className={`shape-after`}></div>
          </div>
        ) : null}

        {data?.armoringFeatures?.data.length > 0 ? (
          <div
            id="armoring-features"
            className={`${styles.slug_specs} container anchor`}
          >
            <h2
              className={`${styles.slug_dimensions_title} observe fade-in c-title`}
            >
              Armoring Features for {data?.title}
            </h2>
            <StickyHorizontalSlider slides={data.armoringFeatures.data} />
            <div className={`divider_fade`}></div>
          </div>
        ) : null}

        {data?.conversionAccessories?.data.length > 0 ? (
          <div
            id="conversion-accessories"
            className={`${styles.slug_specs} container anchor`}
          >
            <h2
              className={`${styles.slug_dimensions_title} observe fade-in c-title`}
            >
              Conversion Accessories for {data?.title}
            </h2>
            <StickyHorizontalSlider slides={data.conversionAccessories.data} />
            <div className={`divider_fade`}></div>
          </div>
        ) : null}

        {data?.communications?.data.length > 0 ? (
          <div
            id="communications-&-electronics"
            className={`${styles.slug_specs} container anchor`}
          >
            <h2
              className={`${styles.slug_dimensions_title} observe fade-in c-title`}
            >
              Communications & Electronics for {data?.title}
            </h2>
            <StickyHorizontalSlider slides={data.communications.data} />
            <div className={`divider_fade`}></div>
          </div>
        ) : null}

        {data?.otherOptions?.data.length > 0 ? (
          <div
            id="other-options"
            className={`${styles.slug_specs} container anchor`}
          >
            <h2
              className={`${styles.slug_dimensions_title} observe fade-in c-title`}
            >
              Other Optional Equipment for {data?.title}
            </h2>
            <StickyHorizontalSlider slides={data.otherOptions.data} />
            <div className={`divider_fade`}></div>
          </div>
        ) : null}

        {videoWebm || videoMP4 ? (
          <VideoScale videoWebm={videoWebm} videoMP4={videoMP4} />
        ) : null}

        {data?.videoYoutube ? (
          <div className="container_small">
            <div className={`${styles.slug_yt}`}>
              <iframe
                width="860"
                height="500"
                src={`https://www.youtube.com/embed/${data.videoYoutube}?controls=0&showinfo=0&modestbranding=1`}
                title={data.title}
                frameBorder="0"
                allow="autoplay;"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ) : null}

        {faqs?.length > 0 ? (
          <div className={`m2`}>
            <Accordion items={faqs} title="Frequently Asked Questions" />
          </div>
        ) : null}

        {formData ? (
          <div className={`background-dark`}>
            <InquiryForm {...formData} plain />
          </div>
        ) : null}
      </div>
    </>
  );
}

export async function getServerSideProps({ params, locale }) {
  try {
    let data = await getPageData({
      route: 'vehicles-we-armors',
      params: `filters[slug][$eq]=${params.slug}`,
      locale,
    });

    // If no data found, try fetching without language suffix
    if (!data?.data?.length) {
      const baseSlug = params.slug.replace(/-[a-z]{2}$/, '');
      data = await getPageData({
        route: 'vehicles-we-armors',
        params: `filters[slug][$eq]=${baseSlug}`,
        locale,
      });
    }

    if (!data?.data?.length) {
      return { notFound: true };
    }

    const seoData = data?.data?.[0]?.attributes?.seo ?? null;
    if (seoData) {
      seoData.thumbnail =
        data?.data?.[0]?.attributes?.featuredImage?.data.attributes ?? null;
    }

    return {
      props: {
        data,
        seoData,
        locale,
      },
    };
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    return {
      notFound: true,
    };
  }
}

// export async function getStaticPaths() {
//   try {
//     const slugsResponse = await getPageData({
//       route: 'vehicles-we-armors',
//       fields: 'fields[0]=slug',
//       populate: '/',
//     });

//     if (!Array.isArray(slugsResponse.data)) {
//       throw new Error('Invalid data format');
//     }

//     const paths = slugsResponse.data.reduce((acc, item) => {
//       if (item?.attributes && item.attributes.slug) {
//         acc.push({ params: { slug: item?.attributes.slug } });
//       }
//       return acc;
//     }, []);

//     return {
//       paths,
//       fallback: 'blocking',
//     };
//   } catch (error) {
//     // console.error('Error fetching slugs:', error);
//     return {
//       paths: [],
//       fallback: 'blocking',
//     };
//   }
// }

// export async function getStaticProps({ params }) {
//   const data = await getPageData({
//     route: 'vehicles-we-armors',
//     params: `filters[slug][$eq]=${params.slug}`,
//   });

//   const seoData = data?.data?.[0]?.attributes?.seo ?? null;
//   if (seoData) {
//     seoData.thumbnail =
//       data?.data?.[0]?.attributes?.featuredImage?.data.attributes ?? null;
//   }

//   if (!data || !data.data || data.data.length === 0) {
//     return {
//       notFound: true,
//     };
//   }
//   // console.log('Fetched data:', JSON.stringify(data, null, 2));

//   return {
//     props: { data, seoData },
//     revalidate: 120,
//   };
// }

export default Vehicle;
