import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'hooks/api';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import routes from 'routes';
const DownloadIcon = dynamic(() => import('components/icons/Download'));
const InfoIcon = dynamic(() => import('components/icons/Info'));
const PDFIcon = dynamic(() => import('components/icons/PDF2'));
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});
import Link from 'next/link';
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
    return <div>Loading...</div>;
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
    Level: 'armor_level',
    VIN: 'VIN',
    'Vehicle ID': 'vehicleID',
    'Engine & Power': 'engine',
    Trans: 'trans',
    // Power: 'power',
    Year: 'year',
    Miles: 'miles',
    Drivetrain: 'driveTrain',
    'Color (Exterior)': 'color_ext',
    'Color (Interior)': 'color_int',
    Trim: 'trim',
    Wheels: 'wheels',
    Height: 'height',
    Length: 'length',
    Width: 'width',
    Wheelbase: 'wheelbase',
    'Weight (Armored)': 'weight',
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
      url: `https://www.alpineco.com/available-now/${data?.slug}`,
      brand: {
        '@type': 'Brand',
        name: 'Alpine Armoring® Armored Vehicles',
      },
      sku: `Alpine-${data?.slug}`,
      offers: {
        '@type': 'AggregateOffer',
        url: `https://www.alpineco.com/available-now/${data?.slug}`,
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
          name: 'Armoring Level',
          value: data?.armor_level,
        },
        {
          '@type': 'PropertyValue',
          name: 'VIN',
          value: data?.VIN,
        },
        {
          '@type': 'PropertyValue',
          name: 'Vehicle ID',
          value: data?.vehicleID,
        },
        {
          '@type': 'PropertyValue',
          name: 'Engine & Power',
          value: data?.engine,
        },
        {
          '@type': 'PropertyValue',
          name: 'Trans',
          value: data?.trans,
        },
        {
          '@type': 'PropertyValue',
          name: 'Year',
          value: data?.year,
        },
        {
          '@type': 'PropertyValue',
          name: 'Miles',
          value: data?.miles,
        },
        {
          '@type': 'PropertyValue',
          name: 'Drivetrain',
          value: data?.driveTrain,
        },
        {
          '@type': 'PropertyValue',
          name: 'Color (Exterior)',
          value: data?.color_ext,
        },
        {
          '@type': 'PropertyValue',
          name: 'Color (Interior)',
          value: data?.color_int,
        },
        {
          '@type': 'PropertyValue',
          name: 'Trim',
          value: data?.trim,
        },
        {
          '@type': 'PropertyValue',
          name: 'Wheels',
          value: data?.wheels,
        },
        {
          '@type': 'PropertyValue',
          name: 'Height',
          value: `${data?.height} in.`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Length',
          value: `${data?.length} in.`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Width',
          value: `${data?.width} in.`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Wheelbase',
          value: `${data?.wheelbase} in.`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Weight (Armored)',
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
          name: 'Home',
          item: 'https://www.alpineco.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Available now',
          item: `https://www.alpineco.com/available-now`,
        },
        // {
        //   '@type': 'ListItem',
        //   position: 3,
        //   name: category,
        //   item: `https://www.alpineco.com/available-now/type/${categorySlug}`,
        // },
        {
          '@type': 'ListItem',
          position: 3,
          name: data?.title,
          item: `https://www.alpineco.com/available-now/${data?.slug}`,
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
              <Link href="/">Home</Link>
              <span>&gt;</span>
              <Link href="/available-now">Available now</Link>
              <span>&gt;</span>
              <Link href={`/available-now/type/${categorySlug}`}>
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
                    : `This ${data?.title} is in stock and available to ship immediately`}
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
                    <span>Sold</span>
                  </div>
                ) : null}

                {data?.armor_level || data?.videoURL ? (
                  <div className={`${styles.inventory_info}`}>
                    {data?.armor_level ? (
                      <Link
                        href="/ballistic-chart"
                        className={`${styles.inventory_armor}`}
                      >
                        <div className={`${styles.inventory_armor_box}`}>
                          Armor
                          <span>Level</span>
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
                          Watch
                          <span>Video</span>
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
                  Request a quote
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
                    if (key === 'Weight (Armored)') {
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
                      ['Height', 'Length', 'Width', 'Wheelbase'].includes(key)
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
                      <strong>OEM</strong> Window Sticker
                    </Button>
                  ) : null}

                  {data?.OEMArmoringSpecs?.data ? (
                    <Button
                      // href={data.OEMArmoringSpecs.data.attributes?.url.replace(
                      //   /\.ai$/,
                      //   '.pdf'
                      // )}
                      onClick={() =>
                        togglePDFPopup(data.OEMArmoringSpecs.data.attributes)
                      }
                      iconComponent={DownloadIcon}
                      className={`${styles.inventory_pdfs_button} icon rounded`}
                      button
                    >
                      Armoring Specs
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
            <Accordion items={faqs} title="Frequently Asked Questions" />
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

    const seoData = data.data[0].attributes.seo ?? null;
    if (seoData) {
      seoData.thumbnail =
        data.data[0].attributes.featuredImage?.data.attributes ?? null;
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
