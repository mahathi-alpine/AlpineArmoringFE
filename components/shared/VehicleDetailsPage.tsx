import styles from './VehicleDetailsPage.module.scss';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useLocale from 'hooks/useLocale';
import { useRouter } from 'next/router';
import routes from 'routes';
import Button from 'components/global/button/Button';
import Carousel from 'components/global/carousel/Carousel';
import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';
import CustomMarkdown from 'components/CustomMarkdown';

const InfoIcon = dynamic(() => import('components/icons/Info'));
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

// For available-now specific imports
const LightboxCustom = dynamic(
  () => import('components/global/lightbox/LightboxCustom')
);
const PlayIcon = dynamic(() => import('components/icons/Play2'));
const VehicleDetailsList = dynamic(() => import('./VehicleDetailsList'));
const InquiryForm = dynamic(() => import('components/global/form/InquiryForm'));
const Content = dynamic(() => import('components/global/content/Content'));
const Accordion = dynamic(
  () => import('components/global/accordion/Accordion')
);

interface VehicleDetailsPageProps {
  data: any;
  seoData: any;
  locale: string;
  type: 'rental' | 'available-now';
}

interface VehicleDetailsConfig {
  titlePrefix?: string;
  descriptionText?: string;
  breadcrumbs: {
    second: { name: string; url: string };
    third?: { name: string; url: string };
  };
  vehicleDetailsMapping: { [key: string]: string };
  showExtendedFeatures?: boolean;
  routes: {
    paths: { [key: string]: string };
  };
}

function VehicleDetailsPage(props: VehicleDetailsPageProps) {
  const router = useRouter();
  const { lang } = useLocale();
  const { data: pageData, type } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seoData, locale } = props;

  const data =
    pageData &&
    pageData.data &&
    pageData.data[0] &&
    pageData.data[0].attributes;

  // Configuration based on page type
  const getConfig = (): VehicleDetailsConfig => {
    switch (type) {
      case 'rental':
        return {
          titlePrefix: lang.rental,
          descriptionText: lang.isAvailableForRental,
          breadcrumbs: {
            second: {
              name: lang.availableNowTitle,
              url: `/${lang.armoredVehiclesForSaleURL}`,
            },
            third: {
              name: lang.rentalVehicles,
              url: `/${lang.availableNowURL}/${lang.type}/${lang.armoredRentalURL}`,
            },
          },
          vehicleDetailsMapping: {
            [lang.level]: 'armor_level',
            [lang.vehicleID]: 'rentalsVehicleID',
            [lang.enginePower]: 'engine',
            [lang.trans]: 'trans',
            [lang.drivetrain]: 'driveTrain',
            [lang.colorExt]: 'color_ext',
            [lang.colorInt]: 'color_int',
          },
          showExtendedFeatures: false,
          routes: routes.rentalVehicles,
        };
      case 'available-now':
      default:
        return {
          breadcrumbs: {
            second: {
              name: lang.availableNowTitle,
              url: `/${lang.armoredVehiclesForSaleURL}`,
            },
            third: data?.categories?.data[0]?.attributes
              ? {
                  name: data.categories.data[0].attributes.title,
                  url: `/${lang.availableNowURL}/${lang.type}/${data.categories.data[0].attributes.slug}`,
                }
              : undefined,
          },
          vehicleDetailsMapping: {
            armor_level: data?.armor_level,
            VIN: data?.VIN,
            vehicleID: data?.vehicleID,
            engine: data?.engine,
            trans: data?.trans,
            year: data?.year,
            miles: data?.miles,
            driveTrain: data?.driveTrain,
            color_ext: data?.color_ext,
            color_int: data?.color_int,
            trim: data?.trim,
            wheels: data?.wheels,
            height: data?.height,
            length: data?.length,
            width: data?.width,
            wheelbase: data?.wheelbase,
            weight: data?.weight,
          },
          showExtendedFeatures: true,
          routes: routes.inventory,
        };
    }
  };

  const config = getConfig();

  // Common state
  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  // Available-now specific state
  const [selectedTitle, setSelectedTitle] = useState('');
  const [contentType, setContentType] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  // Call button state
  const [isMobile, setIsMobile] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Common data extraction
  const topGallery = data?.gallery?.data;
  const mainText = data?.description;
  const videoWebm = data?.video?.data?.attributes;
  const videoMP4 = data?.videoMP4?.data?.attributes;
  const mediaPassword = data?.mediaPassword;
  const contentData = { dynamicZone: data?.blogDynamic || [] };
  const faqs = data?.faqs;

  const sliderTopOptions = {
    dragFree: false,
    loop: true,
    thumbs: true,
  };

  const formData = {
    title: data?.title,
    vehicleID: data?.vehicleID,
    featuredImage: data?.featuredImage,
  };

  // Common functions
  const scroll = () => {
    const element = document.getElementById('request-a-quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  // Available-now specific functions
  const handleLightboxOpen = (title, location, contentType, url = null) => {
    setSelectedTitle(title);
    setContentType(contentType);
    if (contentType === 'video') {
      setVideoSrc(url);
    }
    setLightboxPopupOpen(true);
  };

  const handlePdfClick = (mediaData, password = null) => {
    const pdfData = {
      ...mediaData,
      password: password,
    };
    togglePDFPopup(pdfData);
  };

  // Common useEffect for observer
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

  // Detect mobile vs desktop for call button behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parse engine data for structured data
  const parseEngineData = (engineString: string) => {
    if (!engineString) {
      return { name: undefined, enginePower: undefined, fuelType: undefined };
    }

    const [namePart, powerPart] = engineString.split(/\s*[–-]\s*/); // Split on '–' or '-', handle both dashes
    const name = namePart ? namePart.trim() : engineString;
    let value = '';
    let unitCode = '';
    let fuelType = undefined;

    // Extract fuel type from the name part (last word before the dash)
    if (namePart) {
      const fuelTypeMatch = namePart.match(
        /\b(Gasoline|Diesel|Electric|Hybrid)\b/i
      );
      if (fuelTypeMatch) {
        fuelType = fuelTypeMatch[1];
      }
    }

    if (powerPart) {
      const match = powerPart.match(/([0-9.]+)\s*(\w+)?/i); // Extract value and unit with regex, e.g., "420 hp"
      if (match) {
        value = match[1];
        unitCode = match[2]?.toUpperCase() === 'HP' ? 'HP' : match[2] || '';
      }
    }

    return {
      name: name || undefined,
      fuelType,
      enginePower: value
        ? {
            '@type': 'QuantitativeValue' as const,
            value,
            ...(unitCode ? { unitCode } : {}),
          }
        : undefined,
    };
  };

  const parsedEngineData = parseEngineData(data?.engine || '');

  // Structured data functions
  const getBreadcrumbStructuredData = () => {
    if (type === 'rental') {
      // Rental vehicles breadcrumb structure (4 levels)
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
            name: lang.rentalVehicles,
            item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang.rentalVehiclesURL}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data?.title?.replace(/\s+/g, ' ').replace(/\n/g, '').trim(),
            item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang.rentalVehiclesURL}/${data?.slug}`,
          },
        ],
      };
      return JSON.stringify(structuredData);
    } else {
      // Available-now breadcrumb structure (3 levels) - matches original
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
            name: lang.availableNowTitle,
            item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}/${lang.armoredVehiclesForSaleURL}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data?.title?.replace(/\s+/g, ' ').replace(/\n/g, '').trim(),
            item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}/${lang.availableNowURL}/${data?.slug}`,
          },
        ],
      };
      return JSON.stringify(structuredData);
    }
  };

  // Available-now specific structured data functions
  const getProductStructuredData = () => {
    if (type !== 'available-now') return null;

    return {
      '@context': 'https://schema.org/',
      '@type': ['Product', 'Car'],
      '@id': `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}/${lang.availableNowURL}/${data?.slug}`,
      url: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}/${lang.availableNowURL}/${data?.slug}`,
      name: data?.title?.replace(/\s+/g, ' ').replace('\n', ' ').trim(),
      sku: data?.vehicleID,
      vehicleIdentificationNumber: data?.VIN,
      description:
        props.seoData?.metaDescription ||
        data?.title?.replace(/\s+/g, ' ').replace('\n', ' ').trim(),
      image: data?.featuredImage?.data?.attributes?.url,
      manufacturer: {
        '@type': 'Organization',
        '@id': 'https://www.alpineco.com/#organization',
        name: 'Alpine Armoring®',
      },
      brand: {
        '@type': 'Brand',
        name: 'Alpine Armoring®',
        logo: `${process.env.NEXT_PUBLIC_URL}/assets/Alpine-Logo.png`,
      },
      // "isVariantOf": {
      //   "@type": "Product",
      //   "name":  data?.title?.replace('\n', ' '),
      //   "manufacturer": {
      //     "@type": "Organization",
      //     "name": "Cadillac"
      //   }
      // },
      modelDate: data?.year || '2025',
      // vehicleConfiguration: data?.categories?.data[0]?.attributes.title || 'SUV',  //"vehicleConfiguration": "ESV Extended",
      vehicleModelDate: data?.year || '2025',
      bodyType: data?.categories?.data[0]?.attributes.title
        ? data.categories.data[0].attributes.title
            .replace(/\bArmored\b/i, '')
            .replace(/\s+$/, '') // Remove possible trailing space after 'Armored'
            .replace(/s$/, '') // Remove trailing 's'
            .trim()
        : 'SUV',
      vehicleTransmission: data?.trans || '6-Speed Automatic',
      driveWheelConfiguration: data?.driveTrain || '4WD',
      vehicleEngine: {
        '@type': 'EngineSpecification',
        name: parsedEngineData.name,
        enginePower: parsedEngineData.enginePower,
      },
      // "vehicleSeatingCapacity": 7,
      vehicleSpecialUsage: 'Armored/Bulletproof',
      color: data?.color_ext || 'Raptor Black',
      vehicleInteriorColor: data?.color_int || 'Gray',
      fuelType: parsedEngineData.fuelType || 'Gasoline',
      weight: {
        '@type': 'QuantitativeValue',
        value: data?.weight,
        unitCode: 'lbs',
      },
      additionalProperty: [
        // {
        //   "@type": "PropertyValue",
        //   "@id": "https://www.alpineco.com/#armor-level-property",
        //   "name": "Ballistic Protection Level",
        //   "value": {
        //     "@type": "DefinedTerm",
        //     "@id": "https://www.alpineco.com/ballistic-chart#level-A9",
        //     "name": `Alpine Level ${data?.armor_level}`,
        //     "description": "Protection against 7.62×51mm rifle rounds"
        //   }
        // },
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
          name: lang.miles,
          value: data?.miles,
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
      offers: {
        '@type': 'Offer',
        url: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}/${lang.availableNowURL}/${data?.slug}`,
        priceCurrency: 'USD',
        // price: '0',
        priceSpecification: {
          '@type': 'PriceSpecification',
          description: 'Contact for pricing',
          // priceCurrency: 'USD',
          price: '0',
        },
        availability:
          data?.flag == null
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        priceValidUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
          .toISOString()
          .split('T')[0],
        // description:
        //   lang.contactForPricing || 'Contact us for pricing information',
        seller: {
          '@type': 'Organization',
          '@id': 'https://www.alpineco.com/#organization',
          // name: 'Alpine Armoring',
        },
        warranty: 'Comprehensive Alpine Armoring Warranty',
      },
    };
  };

  const getFAQStructuredData = () => {
    if (type !== 'available-now' || !faqs || !Array.isArray(faqs)) {
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
    if (type !== 'available-now') return null;

    const videoData = videoMP4 || videoWebm;

    if (!videoData) {
      return null;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: data?.title?.replace(/\s+/g, ' ').trim() || 'Vehicle Video',
      description: props.seoData?.metaDescription || 'Vehicle showcase video',
      thumbnailUrl: data?.featuredImage?.data?.attributes?.url || '',
      uploadDate: videoData.createdAt,
      contentUrl: videoData.url,
      embedUrl: videoData.url,
      duration: 'PT0M30S',
      encodingFormat: videoData.mime,
      width: videoData.width || '',
      height: videoData.height || '',
    };

    return JSON.stringify(structuredData);
  };

  // Render rental-specific vehicle details
  const renderRentalDetails = () => {
    return (
      <ul className={`${styles.inventory_details_list}`}>
        {Object.entries(config.vehicleDetailsMapping).map(([key, value]) => {
          let dimensionValue = null;

          if (
            data &&
            data[value] != null &&
            data[value] != '' &&
            data[value] != ' '
          ) {
            if (key === lang.weightArmored) {
              const poundsValue =
                parseInt(data[value]) >= 1000
                  ? parseInt(data[value]).toLocaleString()
                  : parseInt(data[value]);
              const weightInKg = Math.round(data[value] * 0.45359237);
              const kilogramsValue =
                weightInKg >= 1000 ? weightInKg.toLocaleString() : weightInKg;
              dimensionValue = `${poundsValue} lbs (${kilogramsValue} kg)`;
            } else if (
              [lang.height, lang.length, lang.width, lang.wheelbase].includes(
                key
              )
            ) {
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
              <li key={key} className={`${styles.inventory_details_list_item}`}>
                {`${key}:`}
                <span>{dimensionValue}</span>
              </li>
            )
          );
        })}
      </ul>
    );
  };

  if (!data) {
    return <div>{lang.loading}</div>;
  }

  const lightboxData = config.showExtendedFeatures
    ? {
        title: selectedTitle,
        contentType: contentType,
        videoSrc: videoSrc,
      }
    : null;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
        {config.showExtendedFeatures && faqs?.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getFAQStructuredData() }}
            key="faq-jsonld"
          />
        )}
        {config.showExtendedFeatures && (videoWebm || videoMP4) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getVideoStructuredData() }}
            key="video-jsonld"
          />
        )}
        {config.showExtendedFeatures && getProductStructuredData() && (
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
              <Link href={config.breadcrumbs.second.url}>
                {config.breadcrumbs.second.name}
              </Link>
              {config.breadcrumbs.third && (
                <>
                  <span>&gt;</span>
                  <Link href={config.breadcrumbs.third.url}>
                    {config.breadcrumbs.third.name}
                  </Link>
                </>
              )}
              <span>&gt;</span>
              <span className={`b-breadcrumbs_current`}>{data?.title}</span>
            </div>

            <div className={`${styles.inventory_heading_title}`}>
              {data?.title ? (
                <h1
                  dangerouslySetInnerHTML={{
                    __html: config.titlePrefix
                      ? `${config.titlePrefix} ${data.title}`
                      : data.title,
                  }}
                />
              ) : null}
            </div>

            {(type === 'rental' ||
              (type === 'available-now' && data?.flag !== 'sold')) && (
              <div className={`${styles.inventory_heading_description}`}>
                <InfoIcon />
                <p>
                  {type === 'rental' ? (
                    <>
                      {`${lang.this} ${data?.title}`}
                      <strong
                        dangerouslySetInnerHTML={{
                          __html: config.descriptionText,
                        }}
                      />
                    </>
                  ) : data?.shortDescription ? (
                    data.shortDescription
                  ) : (
                    `${lang.this} ${data?.title} ${lang.isInStock}`
                  )}
                </p>
              </div>
            )}
          </div>

          <div className={`${styles.inventory_top}`}>
            <div className={`${styles.inventory_top_gallery}`}>
              <div
                className={`
                ${styles.inventory_top_gallery_wrap}
                ${config.showExtendedFeatures && data?.flag === 'sold' ? styles.inventory_top_gallery_wrap_sold : ''}
              `}
              >
                {topGallery ? (
                  <Carousel slides={topGallery} options={sliderTopOptions} />
                ) : null}

                {config.showExtendedFeatures && data?.flag === 'sold' && (
                  <div
                    className={`${styles.inventory_top_gallery_wrap_sold_label}`}
                  >
                    <span>{lang.sold}</span>
                  </div>
                )}

                {(data?.armor_level ||
                  (config.showExtendedFeatures && data?.videoURL)) && (
                  <div className={`${styles.inventory_info}`}>
                    {data?.armor_level ? (
                      <a
                        href={`${lang.ballisticChartURL}`}
                        className={`${styles.inventory_armor}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          localStorage.setItem(
                            'ballisticChartLevel',
                            data.armor_level.split('/')[0]
                          );
                          window.open(
                            `${lang.ballisticChartURL}`,
                            '_blank',
                            'noopener,noreferrer'
                          );
                        }}
                      >
                        <div className={`${styles.inventory_armor_box}`}>
                          {lang.armor}
                          <span>{lang.level}</span>
                        </div>
                        <strong>{data?.armor_level}</strong>
                      </a>
                    ) : null}

                    {config.showExtendedFeatures && data?.videoURL && (
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
                    )}
                  </div>
                )}
              </div>

              {(data?.OEMWindowSticker?.data ||
                data?.OEMArmoringSpecs?.data) && (
                <div className={`${styles.inventory_pdfs}`}>
                  {data?.OEMWindowSticker?.data && (
                    <div
                      className={`${styles.inventory_pdfs_button}`}
                      onClick={() =>
                        togglePDFPopup(data.OEMWindowSticker.data.attributes)
                      }
                    >
                      <span
                        className={`${styles.inventory_pdfs_button_text} text-cta-regular`}
                      >
                        <strong>{lang.oem}</strong> {lang.windowSticker}
                      </span>
                      <div className={`${styles.inventory_pdfs_button_icon}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <circle cx="10" cy="10" r="8" stroke="currentColor" />
                          <path
                            stroke="currentColor"
                            d="M7.714 12.286 12 8m0 0H7m5 0v5"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {data?.OEMArmoringSpecs?.data && (
                    <div
                      className={`${styles.inventory_pdfs_button}`}
                      onClick={() =>
                        togglePDFPopup(data.OEMArmoringSpecs.data.attributes)
                      }
                    >
                      <span
                        className={`${styles.inventory_pdfs_button_text} text-cta-regular`}
                      >
                        {lang.armoringSpecs}
                      </span>
                      <div className={`${styles.inventory_pdfs_button_icon}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <circle cx="10" cy="10" r="8" stroke="currentColor" />
                          <path
                            stroke="currentColor"
                            d="M7.714 12.286 12 8m0 0H7m5 0v5"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={`${styles.inventory_cta_wrap}`}>
                <div className={`${styles.inventory_cta_wrap_inner}`}>
                  <Button
                    onClick={scroll}
                    button={true}
                    className={`${styles.inventory_cta} primary`}
                  >
                    {lang.requestAQuote}
                  </Button>
                  <div
                    className={styles.call_button_wrapper}
                    onMouseEnter={() => !isMobile && setShowTooltip(true)}
                    onMouseLeave={() => !isMobile && setShowTooltip(false)}
                  >
                    <Button
                      href={
                        isMobile
                          ? 'tel:+17034710002'
                          : 'https://wa.me/message/ZKTQXXVR7PGQL1'
                      }
                      target={!isMobile}
                      nofollow={!isMobile}
                    >
                      {lang.callUs}
                    </Button>
                    {showTooltip && !isMobile && (
                      <div className={styles.phone_tooltip}>1.703.471.0002</div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`${styles.inventory_top_shape} shape-before shape-before-dark mobile-only`}
              />
            </div>

            <div className={`${styles.inventory_details}`}>
              {type === 'rental' ? (
                renderRentalDetails()
              ) : (
                <>
                  <VehicleDetailsList
                    vehicleDetails={config.vehicleDetailsMapping}
                  />
                  {data.exportField && (
                    <Link
                      href={
                        router.locale === 'en'
                          ? '/faqs/do-i-need-an-export-license-to-ship-armored-vehicles-outside-of-the-united-states'
                          : '/es/preguntas-frecuentes/necesito-una-licencia-de-exportacion-para-transportar-vehiculos-blindados-fuera-de-los-estados-unidos'
                      }
                      target="_blank"
                      className={`${styles.inventory_heading_description} alignVertical mt05`}
                    >
                      <InfoIcon />
                      {lang.exportOnly}
                    </Link>
                  )}
                </>
              )}

              {config.showExtendedFeatures && mediaPassword?.media.data && (
                <div
                  onClick={() =>
                    handlePdfClick(
                      mediaPassword.media.data.attributes,
                      mediaPassword.password
                    )
                  }
                  className={`${styles.inventory_passwordPopup}`}
                >
                  <span className={`${styles.inventory_passwordPopup_text}`}>
                    <span>{mediaPassword.text || 'Brochure'}</span>
                  </span>
                  <div className={`${styles.inventory_passwordPopup_icon}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <circle cx="10" cy="10" r="8" stroke="currentColor" />
                      <path
                        stroke="currentColor"
                        d="M7.714 12.286 12 8m0 0H7m5 0v5"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <PopupPDF
          isOpen={isPDFPopupOpen}
          onClose={() => togglePDFPopup('')}
          pdfUrl={currentPdfUrl}
        />

        {mainText && (
          <div
            className={`${styles.inventory_description} container_small ${
              config.showExtendedFeatures &&
              (data?.OEMWindowSticker?.data || data?.OEMArmoringSpecs?.data)
                ? styles.inventory_description_pdfs
                : ''
            }`}
          >
            <CustomMarkdown>{mainText}</CustomMarkdown>
            {config.showExtendedFeatures && <Content data={contentData} />}
          </div>
        )}

        {(videoWebm || videoMP4) && (
          <VideoScale videoWebm={videoWebm} videoMP4={videoMP4} />
        )}

        {config.showExtendedFeatures && faqs?.length > 0 && (
          <div className={`mt2`}>
            <Accordion items={faqs} title={lang.frequentlyAskedQuestions} />
          </div>
        )}

        {formData && <InquiryForm {...formData} className={`formCTA`} />}

        {config.showExtendedFeatures && isLightboxPopupOpen && (
          <LightboxCustom
            isLightboxPopupOpen={isLightboxPopupOpen}
            lightboxData={lightboxData}
            setLightboxPopupOpen={setLightboxPopupOpen}
          />
        )}
      </div>
    </>
  );
}

export default VehicleDetailsPage;
