import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'hooks/api';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import useLocale from 'hooks/useLocale';
import { useRouter } from 'next/router';
import routes from 'routes';
const DownloadIcon = dynamic(() => import('components/icons/Download'));
const InfoIcon = dynamic(() => import('components/icons/Info'));
const PDFIcon = dynamic(() => import('components/icons/PDF2'));
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});
import { getLocaleStrings } from 'hooks/useLocale';
import Link from 'next/link';
import Button from 'components/global/button/Button';
import Carousel from 'components/global/carousel/Carousel';
const InquiryForm = dynamic(() => import('components/global/form/InquiryForm'));
import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';
import CustomMarkdown from 'components/CustomMarkdown';

function InventoryVehicle(props) {
  const router = useRouter();
  const { lang } = useLocale();

  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;
  const topGallery = data?.gallery?.data;
  const mainText = data?.description;

  const videoWebm = data?.video?.data?.attributes;
  const videoMP4 = data?.videoMP4?.data?.attributes;

  const sliderTopOptions = {
    dragFree: false,
    loop: true,
    thumbs: true,
  };

  const vehicleDetailsMain = {
    [lang.level]: 'armor_level',
    [lang.vehicleID]: 'rentalsVehicleID',
    [lang.enginePower]: 'engine',
    [lang.trans]: 'trans',
    [lang.drivetrain]: 'driveTrain',
    [lang.colorExt]: 'color_ext',
    [lang.colorInt]: 'color_int',
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

  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
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
          name: lang.rentalVehicles,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang.rentalVehiclesURL}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data?.title?.replace(/\s+/g, ' ').replace(/\n/g, '').trim(),
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang.rentalVehiclesURL}/${data?.slug}`,
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
      </Head>

      <div className={`${styles.inventory} background-dark`}>
        <div className={`${styles.inventory_main}`}>
          <div className={`${styles.inventory_heading}`}>
            <div className={`b-breadcrumbs`}>
              <Link href="/">{lang.home}</Link>
              <span>&gt;</span>
              <Link href={`/${lang.availableNowURL}`}>
                {lang.availableNowTitle}
              </Link>
              <span>&gt;</span>
              <Link
                href={`/${lang.availableNowURL}/${lang.type}/${lang.armoredRentalURL}`}
              >
                {lang.rentalVehicles}
              </Link>
              <span>&gt;</span>
              <span className={`b-breadcrumbs_current`}>{data?.title}</span>
            </div>

            <div className={`${styles.inventory_heading_title}`}>
              {data?.title ? (
                <h1
                  dangerouslySetInnerHTML={{
                    __html: `${lang.rental} ${data.title}`,
                  }}
                ></h1>
              ) : null}
            </div>

            <div className={`${styles.inventory_heading_description}`}>
              <InfoIcon />
              <p>
                {`${lang.this} ${data?.title}`}
                <strong
                  dangerouslySetInnerHTML={{
                    __html: lang.isAvailableForRental,
                  }}
                />
              </p>
            </div>
          </div>

          <div className={`${styles.inventory_top}`}>
            <div className={`${styles.inventory_top_gallery}`}>
              <div className={`${styles.inventory_top_gallery_wrap}`}>
                {topGallery ? (
                  <Carousel slides={topGallery} options={sliderTopOptions} />
                ) : null}

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
          <div
            className={`${styles.inventory_description} container_small observe fade-in-up`}
          >
            <CustomMarkdown>{mainText}</CustomMarkdown>
          </div>
        ) : null}

        {videoWebm || videoMP4 ? (
          <VideoScale videoWebm={videoWebm} videoMP4={videoMP4} />
        ) : null}

        {formData ? <InquiryForm {...formData} className={`formCTA`} /> : null}
      </div>
    </>
  );
}

export async function getServerSideProps({ params, locale }) {
  const route = routes.inventory;
  const lang = getLocaleStrings(locale);

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

    // Create custom language URLs using rentalVehicles paths
    const customLanguageUrls = {};
    // Add current locale URL
    const currentLocalePath =
      routes.rentalVehicles.paths[locale] || routes.rentalVehicles.paths.en;
    customLanguageUrls[locale] =
      locale === 'en'
        ? `${currentLocalePath}/${currentPage.slug}`
        : `/${locale}${currentLocalePath}/${currentPage.slug}`;

    // Add other locale URLs if localizations exist
    if (currentPage.localizations?.data) {
      currentPage.localizations.data.forEach((localization) => {
        const localeCode = localization.attributes.locale;
        const localePath =
          routes.rentalVehicles.paths[localeCode] ||
          routes.rentalVehicles.paths.en;
        customLanguageUrls[localeCode] =
          localeCode === 'en'
            ? `${localePath}/${localization.attributes.slug}`
            : `/${localeCode}${localePath}/${localization.attributes.slug}`;
      });
    }

    // Also add English if not already present
    if (!customLanguageUrls['en']) {
      customLanguageUrls['en'] =
        `${routes.rentalVehicles.paths.en}/${currentPage.slug}`;
    }

    const seoData = {
      ...(currentPage?.seo ?? {}),
      thumbnail: currentPage?.featuredImage?.data?.attributes ?? null,
      languageUrls: customLanguageUrls,
      canonicalURL: `${routes.rentalVehicles.paths[locale] || routes.rentalVehicles.paths.en}/${currentPage.slug}`,
    };

    if (seoData && seoData.metaDescription) {
      seoData.metaTitle = `${lang.rental} ${seoData.metaTitle}`;

      seoData.metaDescription = seoData.metaDescription.replace(
        /\b(armored)\b/,
        'rental armored'
      );
    }

    if (!data || !data.data || data.data.length === 0) {
      return {
        notFound: true,
      };
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

export default InventoryVehicle;
