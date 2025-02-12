import styles from './Manufacturing.module.scss';
import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import Banner from 'components/global/banner/Banner';
import CustomMarkdown from 'components/CustomMarkdown';
import TabSlider from 'components/global/tab-slider/TabSlider';
import Image from 'next/image';
import Gallery from 'components/global/carousel/CarouselCurved';

function Manufacturing(props) {
  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  const tabSliderData = [
    {
      id: 0,
      titleNav: 'Advanced Technology',
    },
    {
      id: 1,
      titleNav: 'Components & Ballistic Material',
    },
    {
      id: 2,
      titleNav: 'Production',
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

  return (
    <>
      <div className={`${styles.manufacturing} background-dark`}>
        {props.pageData?.banner ? (
          <Banner props={props.pageData?.banner} shape="dark" />
        ) : null}

        <TabSlider
          className={`${styles.manufacturing_tabs} desktop-only`}
          props={tabSliderData}
          onTabChange={handleTabChange}
          anchor
        />

        <section
          className={`${styles.manufacturing_section1} ${styles.manufacturing_container_small} container_small`}
          id="advanced-technology"
        >
          {props.pageData?.section1Title ? (
            <h2
              className={`${styles.manufacturing_title} block-reveal observe`}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section1Title,
                }}
              ></span>
            </h2>
          ) : null}

          {props.pageData?.section1Heading ? (
            <CustomMarkdown
              className={`${styles.manufacturing_section1_heading} ${styles.manufacturing_heading} fade-in observe`}
            >
              {props.pageData.section1Heading}
            </CustomMarkdown>
          ) : null}

          <div className={`${styles.manufacturing_box}`}>
            {props.pageData?.section1Text1 ? (
              <CustomMarkdown
                className={`${styles.manufacturing_section1_text1} ${styles.manufacturing_text} fade-in observe`}
              >
                {props.pageData.section1Text1}
              </CustomMarkdown>
            ) : null}

            {props.pageData?.section1Image.data ? (
              <div
                className={`${styles.manufacturing_section1_image} ${styles.manufacturing_image} observe fade-in`}
              >
                {props.pageData.section1Image.data.attributes.mime.startsWith(
                  'image/'
                ) ? (
                  <Image
                    src={`${
                      props.pageData.section1Image.data.attributes.formats
                        .medium?.url ||
                      props.pageData.section1Image.data.attributes.url
                    }`}
                    alt={
                      props.pageData.section1Image.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={600}
                    height={475}
                  />
                ) : props.pageData.section1Image.data.attributes.mime.startsWith(
                    'video/'
                  ) ? (
                  <div className={styles.videoResponsive}>
                    <video
                      preload="none"
                      muted={true}
                      autoPlay={true}
                      playsInline={true}
                      loop={true}
                      className={styles.responsiveVideo}
                    >
                      <source
                        src={`${props.pageData.section1Image.data.attributes?.url}`}
                        type={props.pageData.section1Image.data.attributes.mime}
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {props.pageData?.section1Text2 ? (
            <CustomMarkdown
              className={`${styles.manufacturing_quote} observe fade-in`}
            >
              {props.pageData.section1Text2}
            </CustomMarkdown>
          ) : null}
        </section>

        {props.pageData?.section1Gallery.data ? (
          <div className={`${styles.slug_gallery}`}>
            <Gallery props={props.pageData?.section1Gallery.data} squared />
          </div>
        ) : null}

        <section
          className={`${styles.manufacturing_section2}`}
          id="components-&-ballistic-material"
        >
          <div
            className={`${styles.manufacturing_container_small} container_small`}
          >
            {props.pageData?.section2Title ? (
              <h2
                className={`${styles.manufacturing_title} block-reveal observe`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: props.pageData.section2Title,
                  }}
                ></span>
              </h2>
            ) : null}

            {props.pageData?.section2Text ? (
              <CustomMarkdown
                className={`${styles.manufacturing_section1_heading} ${styles.manufacturing_heading} fade-in observe`}
              >
                {props.pageData.section2Text}
              </CustomMarkdown>
            ) : null}

            <div className={`${styles.manufacturing_box}`}>
              {props.pageData?.section2Text2 ? (
                <CustomMarkdown
                  className={`${styles.manufacturing_text} observe fade-in`}
                >
                  {props.pageData.section2Text2}
                </CustomMarkdown>
              ) : null}

              {props.pageData?.section2Image.data ? (
                <div
                  className={`${styles.manufacturing_image} observe fade-in`}
                >
                  <Image
                    src={
                      props.pageData.section2Image.data.attributes?.formats
                        ?.large?.url ||
                      props.pageData.section2Image.data.attributes?.url
                    }
                    alt={
                      props.pageData.section2Image.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={600}
                    height={475}
                  ></Image>
                </div>
              ) : null}
            </div>
          </div>

          <div
            className={`${styles.manufacturing_container_small} container_small`}
          >
            {props.pageData?.section2Text3 ? (
              <CustomMarkdown
                className={`${styles.manufacturing_quote} observe fade-in`}
              >
                {props.pageData.section2Text3}
              </CustomMarkdown>
            ) : null}
          </div>

          {props.pageData?.section2Gallery.data ? (
            <div className={`${styles.slug_gallery}`}>
              <Gallery props={props.pageData?.section2Gallery.data} squared />
            </div>
          ) : null}
        </section>

        <section className={`${styles.manufacturing_section3}`} id="production">
          <div
            className={`${styles.manufacturing_container_small} container_small`}
          >
            {props.pageData?.section3Title ? (
              <h2
                className={`${styles.manufacturing_title} block-reveal observe`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: props.pageData.section3Title,
                  }}
                ></span>
              </h2>
            ) : null}

            {props.pageData?.section3Heading ? (
              <CustomMarkdown
                className={`${styles.manufacturing_section1_heading} ${styles.manufacturing_heading} fade-in observe`}
              >
                {props.pageData.section3Heading}
              </CustomMarkdown>
            ) : null}

            <div className={`${styles.manufacturing_box}`}>
              {props.pageData?.section3Text ? (
                <CustomMarkdown
                  className={`${styles.manufacturing_section3_text} ${styles.manufacturing_text} observe fade-in`}
                >
                  {props.pageData.section3Text}
                </CustomMarkdown>
              ) : null}

              {props.pageData?.section3Image.data ? (
                <div
                  className={`${styles.manufacturing_image} observe fade-in`}
                >
                  <Image
                    src={
                      props.pageData.section3Image.data.attributes.formats
                        ?.large?.url ||
                      props.pageData.section3Image.data.attributes.url
                    }
                    alt={
                      props.pageData.section3Image.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={600}
                    height={475}
                  ></Image>
                </div>
              ) : null}
            </div>

            {props.pageData?.section3Text2 ? (
              <CustomMarkdown
                className={`${styles.manufacturing_quote} observe fade-in`}
              >
                {props.pageData.section3Text2}
              </CustomMarkdown>
            ) : null}
          </div>

          {props.pageData?.section3Gallery.data ? (
            <div className={`${styles.slug_gallery}`}>
              <Gallery props={props.pageData?.section3Gallery.data} squared />
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'manufacturing',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default Manufacturing;
