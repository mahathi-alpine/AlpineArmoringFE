import styles from './Vehicle.module.scss';
import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import Banner from 'components/vehicle-we-armor/Banner';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';
// import dynamic from 'next/dynamic';
import ComparisonSlider from 'components/global/comparison-slider/ComparisonSlider';
import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';
import Image from 'next/image';
import Gallery from 'components/global/carousel/CarouselCurved';
import VideoScale from 'components/global/video-scale/VideoScale';
import InquiryForm from 'components/global/form/InquiryForm';
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

  const videoWebm = data?.videoUpload?.data?.attributes;
  const videoMP4 = data?.videoMP4?.data?.attributes;

  const convertMarkdown = useMarkdownToHtml();

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
  };

  const formData = {
    title: data?.title,
    featuredImage: data?.featuredImage,
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

      {data?.description ? (
        <div
          id="overview"
          className={`${styles.slug_description} anchor container_small`}
        >
          <h2 className={`c-title`}>Overview</h2>

          <div
            dangerouslySetInnerHTML={{
              __html: convertMarkdown(data.description),
            }}
          ></div>
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
            Dimensions
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
            className={`${styles.slug_dimensions_title} observe fade-in c-title`}
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
            className={`${styles.slug_dimensions_title} observe fade-in c-title`}
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
            className={`${styles.slug_dimensions_title} observe fade-in c-title`}
          >
            Other Optional Equipment
          </h2>
          <StickyHorizontalSlider slides={data.otherOptions.data} />
          <div className={`divider_fade`}></div>
        </div>
      ) : null}

      {videoWebm || videoMP4 ? (
        <VideoScale videoWebm={videoWebm} videoMP4={videoMP4} />
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

export async function getStaticPaths() {
  try {
    const slugsResponse = await getPageData({
      route: 'vehicles-we-armors',
      fields: 'fields[0]=slug',
      populate: '/',
    });

    if (!Array.isArray(slugsResponse.data)) {
      throw new Error('Invalid data format');
    }

    const paths = slugsResponse.data.reduce((acc, item) => {
      if (item?.attributes && item.attributes.slug) {
        acc.push({ params: { slug: item?.attributes.slug } });
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
    route: 'vehicles-we-armors',
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

// export async function getServerSideProps(context) {
//   const { slug } = context.query;

//   const data = await getPageData({
//     route: 'vehicles-we-armors',
//     params: `filters[slug][$eq]=${slug}`,
//   });

//   const seoData = data?.data?.[0]?.attributes?.seo ?? null;

//   if (!data || !data.data || data.data.length === 0) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: { data, seoData },
//   };
// }

export default Vehicle;
