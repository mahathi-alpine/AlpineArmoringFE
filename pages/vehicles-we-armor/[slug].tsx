import styles from './Vehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Banner from 'components/vehicle-we-armor/Banner';
import TabSlider from 'components/global/tab-slider/TabSlider';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';
import dynamic from 'next/dynamic';
const ComparisonSlider = dynamic(
  () => import('components/global/comparison-slider/ComparisonSlider')
);
const StickyHorizontalSlider = dynamic(
  () =>
    import('components/global/sticky-horizontal-slider/StickyHorizontalSlider')
);
import Image from 'next/image';
const Gallery = dynamic(
  () => import('components/global/carousel/CarouselCurved')
);
const VideoScale = dynamic(
  () => import('components/global/video-scale/VideoScale')
);
const InquiryForm = dynamic(() => import('components/global/form/InquiryForm'));
import { animateVideo } from 'components/global/video-scale/VideoScale';

function Vehicle(props) {
  const data = props?.data?.data?.[0]?.attributes ?? {};

  const inventory = data?.stock?.data;
  const beforeAfterSlider_Before =
    data?.beforeAfterSlider?.before?.data?.attributes;
  const beforeAfterSlider_After =
    data?.beforeAfterSlider?.after?.data?.attributes;

  const dimensions1 = data?.dimensions1?.data?.attributes;
  const dimensions2 = data?.dimensions2?.data?.attributes;

  const gallery = data?.gallery?.data;

  const convertMarkdown = useMarkdownToHtml();

  const banner = {
    title: data?.title,
    featuredImage: data?.featuredImage,
    descriptionBanner: data?.descriptionBanner,
    slug: data?.slug,
    inventory: inventory,
    pdf: data?.pdf,
    protectionLevel: data?.protectionLevel,
  };

  const navItems = [
    {
      id: 1,
      titleNav: 'Overview',
    },
    {
      id: 2,
      titleNav: 'Dimensions',
    },
    {
      id: 3,
      titleNav: 'Armoring Features',
    },
    {
      id: 4,
      titleNav: 'Conversion Accessories',
    },
    {
      id: 5,
      titleNav: 'Communications & Electronics',
    },
    {
      id: 6,
      titleNav: 'Other Options',
    },
    {
      id: 7,
      titleNav: 'Gallery',
    },
    {
      id: 8,
      titleNav: 'Request a quote',
      button: true,
    },
  ];

  const formData = {
    title: data?.title,
    featuredImage: data?.featuredImage,
  };

  const handleTabChange = (index, titleNav) => {
    const targetId = titleNav.toLowerCase().replace(/\s+/g, '-');
    const targetElement = document.getElementById(targetId);
    const offset = 100;

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

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

  if (!props.data) {
    return null;
  }

  return (
    <div className={`${styles.slug}`}>
      <Banner props={banner} />

      <TabSlider
        props={navItems}
        onTabChange={handleTabChange}
        className={`${styles.slug_nav} slug_nav container observe fade-in`}
        sticky
        anchor
      />

      {data?.description ? (
        <div
          id="overview"
          className={`${styles.slug_description} anchor container_small`}
        >
          <h2 className={`c-title observe fade-in-up`}>Overview</h2>

          <div
            className={`observe fade-in-up`}
            dangerouslySetInnerHTML={{
              __html: convertMarkdown(data.description),
            }}
          ></div>
        </div>
      ) : null}

      {dimensions1 && dimensions2 ? (
        <div
          className={`${styles.slug_dimensions} container anchor`}
          id="dimensions"
        >
          <h2
            className={`${styles.slug_dimensions_title} observe fade-in-up c-title`}
          >
            Dimensions
          </h2>
          <div className={`${styles.slug_dimensions_wrap}`}>
            <div
              className={`${styles.slug_dimensions_wrap_image} observe fade-in`}
            >
              <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={dimensions1.formats?.large?.url || dimensions1.url}
                />
                <Image
                  src={dimensions1.formats?.thumbnail?.url || dimensions1.url}
                  alt={dimensions1.alternativeText || 'Alpine Armoring'}
                  width={dimensions1.width}
                  height={dimensions1.height}
                />
              </picture>
              {/* <div className={`${styles.slug_dimensions_height}`}>59 in (149 cm)</div>
              <div className={`${styles.slug_dimensions_width}`}>83 in (210 cm)</div> */}
            </div>

            <div
              className={`${styles.slug_dimensions_wrap_image} observe fade-in`}
            >
              <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={dimensions2.formats?.large?.url || dimensions2.url}
                />
                <Image
                  src={dimensions2.formats?.thumbnail?.url || dimensions2.url}
                  alt={dimensions2.alternativeText || 'Alpine Armoring'}
                  width={dimensions2.width}
                  height={dimensions2.height}
                />
              </picture>
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
                The actual custom-armoring conversion may vary per client’s
                final specs
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
            className={`${styles.slug_dimensions_title} observe fade-in-up c-title`}
          >
            Armoring Features
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
            className={`${styles.slug_dimensions_title} observe fade-in-up c-title`}
          >
            Conversion Accessories
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
            className={`${styles.slug_dimensions_title} observe fade-in-up c-title`}
          >
            Communications & Electronics
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
            className={`${styles.slug_dimensions_title} observe fade-in-up c-title`}
          >
            Other Options
          </h2>
          <StickyHorizontalSlider slides={data.otherOptions.data} />
          <div className={`divider_fade`}></div>
        </div>
      ) : null}

      {gallery ? (
        <div
          className={`${styles.slug_gallery} observe fade-in-up anchor`}
          id="gallery"
        >
          <Gallery props={gallery} white regular />
        </div>
      ) : null}

      {data?.videoUpload?.data ? (
        <VideoScale video={data.videoUpload.data.attributes.url} />
      ) : null}

      {data?.videoYoutube ? (
        <div className={`${styles.slug_yt}`}>
          <iframe
            width="860"
            height="500"
            src={`https://www.youtube.com/embed/${data.videoYoutube}?controls=0&showinfo=0&modestbranding=1`}
            // &autoplay=1&mute=1
            title={data.title}
            frameBorder="0"
            allow="autoplay;"
            allowFullScreen
          ></iframe>
        </div>
      ) : null}

      {formData ? (
        <div className={`background-dark`}>
          <InquiryForm {...formData} plain />
        </div>
      ) : null}
    </div>
  );
}

// export async function getStaticPaths() {
//   const slugsResponse = await getPageData({
//     route: 'categories',
//     fields: 'fields[0]=title&fields[1]=slug',
//   });

//   const slugs = slugsResponse.data?.map((item) => item.attributes.slug);

//   const paths = slugs ? slugs.map((slug) => ({ params: { slug } })) : [];

//   return {
//     paths,
//     fallback: true,
//   };
// }

// export async function getStaticProps({ params }) {
//   const { slug } = params;
//   const data = await getPageData({
//     route: 'vehicles-we-armors',
//     params: `filters[slug][$eq]=${slug}`,
//     populate: 'deep',
//   });

//   if (!data || !data.data || data.data.length === 0) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: { data },
//     revalidate: 60,
//   };
// }

export async function getServerSideProps(context) {
  const { slug } = context.query;

  const data = await getPageData({
    route: 'vehicles-we-armors',
    params: `filters[slug][$eq]=${slug}`,
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

export default Vehicle;
