import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'hooks/api';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import routes from 'routes';
import { useRouter } from 'next/router';
const DownloadIcon = dynamic(() => import('components/icons/Download'));
const InfoIcon = dynamic(() => import('components/icons/Info'));
const PDFIcon = dynamic(() => import('components/icons/PDF2'));
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});
import Link from 'next/link';
import useLocale from 'hooks/useLocale';
import Button from 'components/global/button/Button';
import Carousel from 'components/global/carousel/Carousel';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import PlayIcon from 'components/icons/Play2';
import InquiryForm from 'components/global/form/InquiryForm';
import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';
import CustomMarkdown from 'components/CustomMarkdown';
import Accordion from 'components/global/accordion/Accordion';

function InventoryVehicle(props) {
  const router = useRouter();
  const { lang } = useLocale();

  useEffect(() => {
    const setupObserver = () => {
      const targets = document.querySelectorAll('.observe');
      if (targets.length < 1) {
        setTimeout(setupObserver, 100);
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            // observer.unobserve(entry.target);

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
      });

      targets.forEach((item) => observer.observe(item));

      return () => {
        targets.forEach((item) => observer.unobserve(item));
        observer.disconnect();
      };
    };

    setupObserver();
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

  // Popup
  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  if (!props.data?.data?.[0]) {
    return <div>{lang.loading}</div>;
  }

  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;

  const topGallery = data?.gallery?.data;
  const mainText = data?.description;
  const category = data?.categories?.data[0]?.attributes?.title;
  const categorySlug = data?.categories?.data[0]?.attributes?.slug;

  const videoWebm = data?.video?.data?.attributes;
  const videoMP4 = data?.videoMP4?.data?.attributes;

  const faqs = data?.faqs;

  const sliderTopOptions = {
    dragFree: false,
    loop: true,
    thumbs: true,
  };

  const vehicleDetailsMain = {
    [lang.level]: 'armor_level',
    [lang.VIN]: 'VIN',
    [lang.vehicleID]: 'vehicleID',
    [lang.enginePower]: 'engine',
    [lang.trans]: 'trans',
    // Power: 'power',
    [lang.year]: 'year',
    [lang.miles]: 'miles',
    [lang.drivetrain]: 'driveTrain',
    [lang.colorExt]: 'color_ext',
    [lang.colorInt]: 'color_int',
    [lang.trim]: 'trim',
    [lang.wheels]: 'wheels',
    [lang.height]: 'height',
    [lang.length]: 'length',
    [lang.width]: 'width',
    [lang.wheelbase]: 'wheelbase',
    [lang.weightArmored]: 'weight',
  };

  const formData = {
    title: data?.title,
    vehicleID: data?.vehicleID,
    featuredImage: data?.featuredImage,
  };

  const scroll = () => {
    const element = document.getElementById('request-a-quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getProductStructuredData = () => {
    return {
      '@context': 'https://schema.org/',
      '@type': ['Product', 'Vehicle'],
      name: data?.title?.replace('\n', ' '),
      image: data?.featuredImage?.data?.attributes?.url,
      description:
        props.seoData?.metaDescription || data?.title?.replace('\n', ' '),
      url: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang.availableNowURL}/${data?.slug}`,
      brand: {
        '@type': 'Brand',
        name: `Alpine Armoring® ${lang.armoredVehicles}`,
      },
      sku: `Alpine-${data?.slug}`,
      offers: {
        '@type': 'AggregateOffer',
        url: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang.availableNowURL}/${data?.slug}`,
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
          name: lang.armoringLevel,
          value: data?.armor_level,
        },
        {
          '@type': 'PropertyValue',
          name: lang.VIN,
          value: data?.VIN,
        },
        {
          '@type': 'PropertyValue',
          name: lang.vehicleID,
          value: data?.vehicleID,
        },
        {
          '@type': 'PropertyValue',
          name: lang.enginePower,
          value: data?.engine,
        },
        {
          '@type': 'PropertyValue',
          name: lang.trans,
          value: data?.trans,
        },
        {
          '@type': 'PropertyValue',
          name: lang.year,
          value: data?.year,
        },
        {
          '@type': 'PropertyValue',
          name: lang.miles,
          value: data?.miles,
        },
        {
          '@type': 'PropertyValue',
          name: lang.drivetrain,
          value: data?.driveTrain,
        },
        {
          '@type': 'PropertyValue',
          name: lang.colorExt,
          value: data?.color_ext,
        },
        {
          '@type': 'PropertyValue',
          name: lang.colorInt,
          value: data?.color_int,
        },
        {
          '@type': 'PropertyValue',
          name: lang.trim,
          value: data?.trim,
        },
        {
          '@type': 'PropertyValue',
          name: lang.wheels,
          value: data?.wheels,
        },
        {
          '@type': 'PropertyValue',
          name: lang.height,
          value: `${data?.height} in.`,
        },
        {
          '@type': 'PropertyValue',
          name: lang.length,
          value: `${data?.length} in.`,
        },
        {
          '@type': 'PropertyValue',
          name: lang.width,
          value: `${data?.width} in.`,
        },
        {
          '@type': 'PropertyValue',
          name: lang.wheelbase,
          value: `${data?.wheelbase} in.`,
        },
        {
          '@type': 'PropertyValue',
          name: lang.weightArmored,
          value: `${data?.weight} lbs`,
        },
      ],
    };
  };

  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang.home,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang.availableNowTitle,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang.availableNowURL}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data?.title?.replace(/\s+/g, ' ').replace(/\n/g, '').trim(),
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang.availableNowURL}/${data?.slug}`,
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
        const text =
          faq?.attributes?.text || faq?.text || lang.noAnswerProvided;

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

  const getVideoStructuredData = () => {
    const videoData = videoMP4 || videoWebm;

    if (!videoData) {
      return null;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: data?.title?.replace(/\s+/g, ' ').trim() || 'Vehicle Video',
      description: props.seoData.metaDescription || 'Vehicle showcase video',
      thumbnailUrl: data?.featuredImage?.data?.attributes?.url || '',
      uploadDate: videoData.createdAt,
      contentUrl: videoData.url,
      embedUrl: videoData.url,
      duration: 'PT0M30S', // Default duration
      encodingFormat: videoData.mime,
      width: videoData.width || '',
      height: videoData.height || '',
    };

    return JSON.stringify(structuredData);
  };

  if (!data) {
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
        {faqs?.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getFAQStructuredData() }}
            key="faq-jsonld"
          />
        )}
        {(videoWebm || videoMP4) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getVideoStructuredData() }}
            key="video-jsonld"
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

      <div className={`${styles.inventory} background-dark`}>
        <div className={`${styles.inventory_main}`}>
          <div className={`${styles.inventory_heading}`}>
            <div className={`b-breadcrumbs`}>
              <Link href="/">{lang.home}</Link>
              <span>&gt;</span>
              <Link href={`${lang.availableNowURL}`}>
                {lang.availableNowTitle}
              </Link>
              <span>&gt;</span>
              <Link
                href={`${lang.availableNowURL}/${lang.type}/${categorySlug}`}
              >
                {category}
              </Link>
              <span>&gt;</span>
              <span className={`b-breadcrumbs_current`}>{data?.title}</span>
            </div>

            <div className={`${styles.inventory_heading_title}`}>
              {data?.title ? (
                <h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
              ) : null}
            </div>

            {data?.flag !== 'sold' ? (
              <div className={`${styles.inventory_heading_description}`}>
                <InfoIcon />
                <p>
                  {data?.shortDescription
                    ? data.shortDescription
                    : `${lang.this} ${data?.title} ${lang.isInStock}`}
                </p>
              </div>
            ) : null}
          </div>

          <div className={`${styles.inventory_top}`}>
            <div className={`${styles.inventory_top_gallery}`}>
              <div
                className={`
                ${styles.inventory_top_gallery_wrap}              
                ${data?.flag == 'sold' ? styles.inventory_top_gallery_wrap_sold : ''} 
              `}
              >
                {topGallery ? (
                  <Carousel slides={topGallery} options={sliderTopOptions} />
                ) : null}

                {data?.flag == 'sold' ? (
                  <div
                    className={`${styles.inventory_top_gallery_wrap_sold_label}`}
                  >
                    <span>{lang.sold}</span>
                  </div>
                ) : null}

                {data?.armor_level || data?.videoURL ? (
                  <div className={`${styles.inventory_info}`}>
                    {data?.armor_level ? (
                      <Link
                        href={`${lang.ballisticChartURL}`}
                        className={`${styles.inventory_armor}`}
                      >
                        <div className={`${styles.inventory_armor_box}`}>
                          {lang.armor}
                          <span>{lang.level}</span>
                        </div>
                        <strong>{data?.armor_level}</strong>
                      </Link>
                    ) : null}
                    {data?.videoURL ? (
                      <div
                        onClick={() =>
                          handleLightboxOpen(
                            data.title,
                            '',
                            'video',
                            data.videoURL
                          )
                        }
                        className={`${styles.inventory_armor}`}
                      >
                        <div className={`${styles.inventory_armor_box}`}>
                          {lang.watch}
                          <span>{lang.video}</span>
                        </div>
                        <PlayIcon />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className={`${styles.inventory_cta_wrap}`}>
                <Button
                  onClick={scroll}
                  button={true}
                  className={`${styles.inventory_cta} primary attention`}
                  attention
                >
                  {lang.requestAQuote}
                </Button>
              </div>

              <div
                className={`${styles.inventory_top_shape} shape-before shape-before-dark mobile-only`}
              ></div>
            </div>

            <div className={`${styles.inventory_details}`}>
              <ul className={`${styles.inventory_details_list}`}>
                {Object.entries(vehicleDetailsMain).map(([key, value]) => {
                  let dimensionValue = null;

                  if (
                    data &&
                    data[value] != null &&
                    data[value] != '' &&
                    data[value] != ' '
                  ) {
                    if (key === lang.weightArmored) {
                      // Apply thousands separator to the pounds value if it's in the thousands
                      const poundsValue =
                        parseInt(data[value]) >= 1000
                          ? parseInt(data[value]).toLocaleString()
                          : parseInt(data[value]);
                      // Convert pounds to kilograms and round to the nearest whole number
                      const weightInKg = Math.round(data[value] * 0.45359237);
                      // Apply thousands separator to the kilograms value if it's in the thousands
                      const kilogramsValue =
                        weightInKg >= 1000
                          ? weightInKg.toLocaleString()
                          : weightInKg;
                      dimensionValue = `${poundsValue} lbs (${kilogramsValue} kg)`;
                    } else if (
                      [
                        lang.height,
                        lang.length,
                        lang.width,
                        lang.wheelbase,
                      ].includes(key)
                    ) {
                      // Convert inches to centimeters
                      dimensionValue = `${data[value]} in. (${Math.round(
                        data[value] * 2.54
                      )} cm)`;
                    } else {
                      dimensionValue = data[value];
                    }
                  }

                  return (
                    data &&
                    data[value] != null &&
                    data[value] != '' &&
                    data[value] != ' ' && (
                      <li
                        key={key}
                        className={`${styles.inventory_details_list_item}`}
                      >
                        {`${key}:`}
                        <span>{dimensionValue}</span>
                      </li>
                    )
                  );
                })}
              </ul>

              {data?.OEMWindowSticker?.data || data?.OEMArmoringSpecs?.data ? (
                <div className={`${styles.inventory_pdfs}`}>
                  {data?.OEMWindowSticker?.data ? (
                    <Button
                      href={data.OEMWindowSticker.data.attributes?.url.replace(
                        /\.ai$/,
                        '.pdf'
                      )}
                      iconComponent={PDFIcon}
                      className={`${styles.inventory_pdfs_button} icon rounded`}
                      target
                    >
                      <strong>{lang.oem}</strong> {lang.windowSticker}
                    </Button>
                  ) : null}

                  {data?.OEMArmoringSpecs?.data ? (
                    <Button
                      onClick={() =>
                        togglePDFPopup(data.OEMArmoringSpecs.data.attributes)
                      }
                      iconComponent={DownloadIcon}
                      className={`${styles.inventory_pdfs_button} icon rounded`}
                      button
                    >
                      {lang.armoringSpecs}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <PopupPDF
          isOpen={isPDFPopupOpen}
          onClose={() => togglePDFPopup('')}
          pdfUrl={currentPdfUrl}
        />

        {mainText ? (
          <div className={`${styles.inventory_description} container_small`}>
            <CustomMarkdown>{mainText}</CustomMarkdown>
          </div>
        ) : null}

        {videoWebm || videoMP4 ? (
          <VideoScale videoWebm={videoWebm} videoMP4={videoMP4} />
        ) : null}

        {faqs?.length > 0 ? (
          <div className={`mt2`}>
            <Accordion items={faqs} title={lang.frequentlyAskedQuestions} />
          </div>
        ) : null}

        {formData ? <InquiryForm {...formData} className={`formCTA`} /> : null}

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
  const route = routes.inventory;

  try {
    let data = await getPageData({
      route: route.collectionSingle,
      params: `filters[slug][$eq]=${params.slug}`,
      locale,
    });

    // If no data found, try fetching without language suffix
    if (!data?.data?.length) {
      const baseSlug = params.slug.replace(/-[a-z]{2}$/, '');
      data = await getPageData({
        route: route.collectionSingle,
        params: `filters[slug][$eq]=${baseSlug}`,
        locale,
      });
    }

    if (!data?.data?.length) {
      return { notFound: true };
    }

    const currentPage = data?.data?.[0]?.attributes;

    const seoData = {
      ...(currentPage?.seo ?? {}),
      thumbnail: currentPage?.thumbnail?.data?.attributes ?? null,
      languageUrls: route.getLanguageUrls(currentPage, locale),
    };

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

// export async function getStaticPaths({ locales }) {
//   try {
//     const slugsResponse = await getPageData({
//       route: 'inventories',
//       fields: 'fields[0]=slug',
//       populate: '/',
//     });

//     if (!Array.isArray(slugsResponse.data)) {
//       throw new Error('Invalid data format');
//     }

//     const paths = slugsResponse.data.reduce((acc, item) => {
//       if (item?.attributes && item.attributes.slug) {
//         // Remove any existing language suffix to get the base slug
//         const baseSlug = item.attributes.slug.replace(/-[a-z]{2}$/, '');

//         locales.forEach((locale) => {
//           // For default locale (en), use base slug
//           // For other locales, add the language suffix
//           const localizedSlug =
//             locale === 'en' ? baseSlug : `${baseSlug}-${locale}`;

//           acc.push({
//             params: { slug: localizedSlug },
//             locale,
//           });
//         });
//       }
//       return acc;
//     }, []);

//     return {
//       paths,
//       fallback: 'blocking',
//     };
//   } catch (error) {
//     return {
//       paths: [],
//       fallback: 'blocking',
//     };
//   }
// }

// export async function getStaticProps({ params, locale }) {
//   const baseSlug = params.slug.replace(/-[a-z]{2}$/, '');

//   const localizedSlug = locale === 'en' ? baseSlug : `${baseSlug}-${locale}`;

//   const data = await getPageData({
//     route: 'inventories',
//     params: `filters[slug][$eq]=${localizedSlug}`,
//     locale,
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

//   return {
//     props: {
//       data,
//       seoData,
//       locale,
//     },
//     revalidate: 120,
//   };
// }

export default InventoryVehicle;
