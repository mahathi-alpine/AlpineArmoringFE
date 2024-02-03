import styles from './Vehicle.module.scss';
import { getPageData } from 'lib/api';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Banner from 'components/vehicle-we-armor/Banner';
const ComparisonSlider = dynamic(
  () => import('components/global/comparison-slider/ComparisonSlider')
);
const StickyHorizontalSlider = dynamic(
  () =>
    import('components/global/sticky-horizontal-slider/StickyHorizontalSlider')
);
const TabSlider = dynamic(
  () => import('components/global/tab-slider/TabSlider')
);
const Markdown = dynamic(() => import('markdown-to-jsx'));
const Image = dynamic(() => import('next/image'));
const Gallery = dynamic(
  () => import('components/global/carousel/CarouselCurved')
);
const VideoScale = dynamic(
  () => import('components/global/video-scale/VideoScale')
);
import { animateVideo } from 'components/global/video-scale/VideoScale';

function Vehicle(props) {
  const data = props.data?.data[0]?.attributes;

  const inventory = data?.stock?.data;
  const beforeAfterSlider_Before =
    data?.beforeAfterSlider?.before?.data?.attributes;
  const beforeAfterSlider_After =
    data?.beforeAfterSlider?.after?.data?.attributes;

  const dimensions1 = data?.dimensions1?.data?.attributes;
  const dimensions2 = data?.dimensions2?.data?.attributes;

  const gallery = data?.gallery?.data;

  const banner = {
    title: data?.title,
    titleDisplay: data?.titleDisplay,
    featuredImage: data?.featuredImage,
    descriptionBanner: data?.descriptionBanner,
    slug: data?.slug,
    inventory: inventory,
    pdf: data?.pdf,
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
      titleNav: 'Armoring Specs',
    },
    {
      id: 4,
      titleNav: 'Optional Equipment',
    },
    {
      id: 5,
      titleNav: 'Gallery',
    },
  ];

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
    // Observer for fade animations
    const observerAnimationTargets = document.querySelectorAll('.observe');
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
    observerAnimationTargets.forEach((item) => observerAnimation.observe(item));

    // Clean up the observer when the component unmounts
    return () => {
      observerAnimationTargets.forEach((item) =>
        observerAnimation.unobserve(item)
      );
      observerAnimation.disconnect();
    };
  }, []);

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

      <div
        id="overview"
        className={`${styles.slug_description} anchor container_small`}
      >
        <h2 className={`c-title observe fade-in-up`}>Overview</h2>
        {data.description ? (
          <Markdown className={`observe fade-in-up`}>
            {data.description}
          </Markdown>
        ) : null}
      </div>

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
                  src={dimensions1.formats?.small?.url || dimensions1.url}
                  alt={dimensions1.alternativeText}
                  width={dimensions1.width}
                  height={dimensions1.height}
                />
              </picture>
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
                  src={dimensions2.formats?.small?.url || dimensions2.url}
                  alt={dimensions2.alternativeText}
                  width={dimensions2.width}
                  height={dimensions2.height}
                />
              </picture>
            </div>
          </div>
        </div>
      ) : null}

      {beforeAfterSlider_Before && beforeAfterSlider_After ? (
        <div
          className={`${styles.slug_slider} observe fade-in container anchor`}
        >
          <ComparisonSlider
            beforeImage={beforeAfterSlider_Before}
            afterImage={beforeAfterSlider_After}
          />
          <p className={`${styles.slug_slider_small}`}>
            <small>
              The actual custom-armoring conversion may vary per client’s final
              specs
            </small>
          </p>
        </div>
      ) : null}

      {data.specs ? (
        <div id="armoring-specs" className={`${styles.slug_specs} anchor`}>
          <div className={`container_small`}>
            <h2
              className={`${styles.slug_dimensions_title} observe fade-in-up c-title`}
            >
              Armoring Specifications
            </h2>
          </div>
          <StickyHorizontalSlider slides={data.specs.data} />
        </div>
      ) : null}

      {data.equipment ? (
        <div id="optional-equipment" className={`${styles.slug_specs} anchor`}>
          <div className={`container_small`}>
            <h2
              className={`${styles.slug_dimensions_title} observe fade-in-up c-title`}
            >
              Optional Equipment
            </h2>
          </div>
          <StickyHorizontalSlider slides={data.equipment.data} />
        </div>
      ) : null}

      {gallery ? (
        <div
          className={`${styles.slug_gallery} observe fade-in-up anchor`}
          id="gallery"
        >
          <Gallery props={gallery} white />
        </div>
      ) : null}

      {data.videoUpload?.data ? (
        <VideoScale video={data.videoUpload.data.attributes.url} />
      ) : null}

      {data.videoYoutube ? (
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
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getPageData({
    route: 'vehicles-we-armors',
    params: `filters[slug][$eq]=${context.params.slug}`,
  });

  return {
    props: { data },
  };
}

export default Vehicle;
