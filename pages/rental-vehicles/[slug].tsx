import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'hooks/api';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const DownloadIcon = dynamic(() => import('components/icons/Download'));
const InfoIcon = dynamic(() => import('components/icons/Info'));
const PDFIcon = dynamic(() => import('components/icons/PDF2'));
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});
import Link from 'next/link';
// import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';
import Button from 'components/global/button/Button';
import Carousel from 'components/global/carousel/Carousel';
const InquiryForm = dynamic(() => import('components/global/form/InquiryForm'));
import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

function InventoryVehicle(props) {
  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;
  const topGallery = data?.gallery?.data;
  const mainText = data?.description;
  // const category = data?.categories?.data[0]?.attributes?.title;
  // const categorySlug = data?.categories?.data[0]?.attributes?.slug;

  const videoWebm = data?.video?.data?.attributes;
  const videoMP4 = data?.videoMP4?.data?.attributes;

  const convertMarkdown = useMarkdownToHtml();

  const sliderTopOptions = {
    dragFree: false,
    loop: true,
    thumbs: true,
  };

  const vehicleDetailsMain = {
    VIN: 'VIN',
    'Vehicle ID': 'vehicleID',
    Engine: 'engine',
    Trans: 'trans',
    Power: 'power',
    Year: 'year',
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

  return (
    <div className={`${styles.inventory} background-dark`}>
      <div className={`${styles.inventory_main}`}>
        <div className={`${styles.inventory_heading}`}>
          <div className={`b-breadcrumbs`}>
            <Link href="/">Home</Link>
            <span>&gt;</span>
            <Link href="/available-now">Available now</Link>
            <span>&gt;</span>
            <Link href={`/available-now/type/rental-vehicles`}>
              Rental Vehicles
            </Link>
            <span>&gt;</span>
            {data?.title}
          </div>

          <div className={`${styles.inventory_heading_title}`}>
            {data?.title ? (
              <h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
            ) : null}
          </div>

          <div className={`${styles.inventory_heading_description}`}>
            <InfoIcon />
            <p>
              This {data?.title} is now available for <span>RENTAL</span>
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
        <div
          className={`${styles.inventory_description} container_small observe fade-in-up`}
          dangerouslySetInnerHTML={{ __html: convertMarkdown(mainText) }}
        ></div>
      ) : null}

      {videoWebm || videoMP4 ? (
        <VideoScale videoWebm={videoWebm} videoMP4={videoMP4} />
      ) : null}

      {formData ? <InquiryForm {...formData} className={`formCTA`} /> : null}
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const slugsResponse = await getPageData({
      route: 'inventories',
      fields: 'fields[0]=slug',
      populate: '/',
    });

    if (!Array.isArray(slugsResponse.data)) {
      throw new Error('Invalid data format');
    }

    const paths = slugsResponse.data.reduce((acc, item) => {
      if (item.attributes && item.attributes.slug) {
        acc.push({ params: { slug: item.attributes.slug } });
      }
      return acc;
    }, []);

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    // console.error('Error fetching slugs:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  const data = await getPageData({
    route: 'inventories',
    params: `filters[slug][$eq]=${params.slug}`,
  });

  const seoData = data?.data?.[0]?.attributes?.seo ?? null;

  if (!data || !data.data || data.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data, seoData },
  };
}

export default InventoryVehicle;
