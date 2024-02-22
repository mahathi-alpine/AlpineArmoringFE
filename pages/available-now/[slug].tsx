import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import InfoIcon from 'components/icons/Info';
import PDFIcon from 'components/icons/PDF';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';

import Button from 'components/global/button/Button';
import TabSlider from 'components/global/tab-slider/TabSlider';
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
  const category = data?.category.data?.attributes.title;
  const categorySlug = data?.category.data?.attributes.slug;

  const sliderTopOptions = { dragFree: false, loop: true, thumbs: true };

  const vehicleDetailsMain = {
    VIN: 'VIN',
    'Vehicle ID': 'vehicleID',
    Engine: 'engine',
    Trans: 'trans',
    Power: 'power',
    Year: 'year',
    'Color (EXT)': 'color_ext',
    'Color (INT)': 'color_int',
    Trim: 'trim',
    'Drive Train': 'driveTrain',
    Wheels: 'wheels',
    Height: 'height',
    Length: 'length',
    Width: 'width',
    Wheelbase: 'wheelbase',
    Weight: 'weight',
  };

  const tabSliderData = [
    {
      id: 0,
      titleNav: 'OEM Specs',
    },
    {
      id: 1,
      titleNav: 'Armoring Specs',
    },
    {
      id: 2,
      titleNav: 'Options Included',
    },
  ];

  const formData = {
    title: data?.title,
    vehicleID: data?.vehicleID,
    featuredImage: data?.featuredImage,
  };

  const handleTabChange = (index, titleNav) => {
    const targetId = titleNav.toLowerCase().replace(/\s+/g, '-');

    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
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

            <Button
              href="#request-a-quote"
              className={`${styles.inventory_cta} primary rounded`}
            >
              Request a quote
            </Button>

            {data?.OEM?.data ? (
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
            ) : null}

            <div
              className={`${styles.inventory_top_shape} shape-before shape-before-dark mobile-only`}
            ></div>
          </div>

          <div id="oem-specs" className={`${styles.inventory_details} anchor`}>
            <TabSlider
              className={`${styles.inventory_tabs_slider}`}
              props={tabSliderData}
              onTabChange={handleTabChange}
              anchor
            />

            <div className={`${styles.inventory_tabs_content}`}>
              <div className={`${styles.inventory_tabs_content_item}`}>
                <ul className={`${styles.inventory_tabs_content_list}`}>
                  {Object.entries(vehicleDetailsMain).map(([key, value]) => {
                    const isDimensionKey = [
                      'Height',
                      'Length',
                      'Width',
                      'Wheelbase',
                    ].includes(key);

                    let dimensionValue = null;

                    if (
                      data &&
                      data[value] != null &&
                      data[value] != '' &&
                      data[value] != ' '
                    ) {
                      dimensionValue =
                        isDimensionKey && data
                          ? `${data[value]} in (${data[value] * 2.54} cm)`
                          : data[value];
                    }

                    return (
                      data &&
                      data[value] != null &&
                      data[value] != '' &&
                      data[value] != ' ' && (
                        <li
                          key={key}
                          className={`${styles.inventory_tabs_content_list_item}`}
                        >
                          {`${key}:`}
                          <span>{dimensionValue}</span>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
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
