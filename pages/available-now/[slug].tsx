import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import InfoIcon from 'components/icons/Info';
import PDFIcon from 'components/icons/PDF2';
import DownloadIcon from 'components/icons/Download';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';

import Button from 'components/global/button/Button';
import Carousel from 'components/global/carousel/Carousel';
import InquiryForm from 'components/global/form/InquiryForm';
import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';

function InventoryVehicle(props) {
  // if (!props.data) {
  //   return null;
  // }
  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;
  const topGallery = data?.gallery?.data;
  const mainText = data?.description;
  const category = data?.categories?.data[0]?.attributes.title;
  const categorySlug = data?.categories?.data[0]?.attributes.slug;

  // const [thumbsAxis, setThumbsAxis] = useState<'x' | 'y'>('x');
  // useEffect(() => {
  //   window.innerWidth >= 1600 ? setThumbsAxis('y') : setThumbsAxis('x');
  // }, []);
  const sliderTopOptions = {
    dragFree: false,
    loop: true,
    // axis: thumbsAxis,
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
    'Color (EXT)': 'color_ext',
    'Color (INT)': 'color_int',
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
            observer.unobserve(entry.target);

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

  return (
    <div className={`${styles.inventory} background-dark`}>
      <div className={`${styles.inventory_main}`}>
        <div className={`${styles.inventory_heading}`}>
          <div className={`${styles.inventory_heading_breadcrumbs}`}>
            <Link href="/available-now">Available now</Link>
            <span>&gt;</span>
            <Link href={`/available-now/type/${categorySlug}`}>{category}</Link>
          </div>

          <div className={`${styles.inventory_heading_title}`}>
            {data?.title ? (
              <h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
            ) : null}
          </div>

          <div className={`${styles.inventory_heading_description}`}>
            <InfoIcon />
            <p>
              {data?.shortDescription
                ? data?.shortDescription
                : `This ${data?.title} is in stock and available to ship immediately`}
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
                <div className={`${styles.inventory_armor}`}>
                  <div className={`${styles.inventory_armor_box}`}>
                    Armor
                    <span>Level</span>
                  </div>
                  <strong>{data?.armor_level}</strong>
                </div>
              ) : null}
            </div>

            {/* {data?.OEM?.data ? (
              <Link
                href={data.OEM.data.attributes.url}
                className={`${styles.inventory_sticker}`}
                target="_blank"
              >
                <PDFIcon />
                <span>
                  <span className={`${styles.inventory_sticker_part1}`}>
                    Window
                  </span>
                  <span className={`${styles.inventory_sticker_part2}`}>
                    Sticker
                  </span>
                  <span className={`${styles.inventory_sticker_part3}`}>
                    OEM
                  </span>
                </span>
              </Link>
            ) : null} */}

            <Button
              onClick={scroll}
              button={true}
              className={`${styles.inventory_cta} primary attention`}
              attention
            >
              Request a quote
            </Button>

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

            <div className={`${styles.inventory_pdfs}`}>
              {data?.OEMWindowSticker?.data ? (
                <Button
                  href={data.OEMWindowSticker.data.attributes.url.replace(
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
                  href={data.OEMArmoringSpecs.data.attributes.url.replace(
                    /\.ai$/,
                    '.pdf'
                  )}
                  iconComponent={DownloadIcon}
                  className={`${styles.inventory_pdfs_button} icon rounded`}
                  target
                >
                  Armoring Specs
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {mainText ? (
        <div
          className={`${styles.inventory_description} container_small observe fade-in-up`}
        >
          <Markdown>{mainText}</Markdown>
        </div>
      ) : null}

      {data?.specifications?.data.length > 0 ? (
        <div id="armoring-specs" className={`${styles.inventory_specs} anchor`}>
          <StickyHorizontalSlider
            slides={data.specifications.data}
            title="Armoring Specifications"
            inventory
          />
        </div>
      ) : null}

      {data?.accessories.data.length > 0 ? (
        <div id="options-included" className={`anchor`}>
          <StickyHorizontalSlider
            slides={data.accessories.data}
            title="Options Included"
            inventory
          />
        </div>
      ) : null}

      {data?.video.data ? (
        <VideoScale video={data?.video.data?.attributes.url} />
      ) : null}

      {formData ? <InquiryForm {...formData} /> : null}
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const data = await getPageData({
//     route: 'inventories',
//     params: `filters[slug][$eq]=${context.params.slug}`,
//     // populate: 'deep',
//   });

//   return {
//     props: { data },
//   };
// }
export async function getStaticPaths() {
  const slugsResponse = await getPageData({
    route: 'inventories',
    populate: 'featuredImage',
  });

  const slugs = slugsResponse.data?.map((item) => item.attributes.slug);

  const paths = slugs ? slugs.map((slug) => ({ params: { slug } })) : [];

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const data = await getPageData({
    route: 'inventories',
    params: `filters[slug][$eq]=${slug}`,
  });

  if (!data || !data.data || data.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
    revalidate: 60,
  };
}

export default InventoryVehicle;
