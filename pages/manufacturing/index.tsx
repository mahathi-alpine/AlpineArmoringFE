import styles from './Manufacturing.module.scss';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import { getPageData } from 'hooks/api';
import routes from 'routes';
import useLocale from 'hooks/useLocale';
import Banner from 'components/global/banner/Banner';
import CustomMarkdown from 'components/CustomMarkdown';
import TabSlider from 'components/global/tab-slider/TabSlider';
import Image from 'next/image';
import Gallery from 'components/global/carousel/CarouselCurved';

function Manufacturing(props) {
  const { lang } = useLocale();

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  const tabSliderData = [
    {
      id: 0,
      titleNav: lang.advancedTechnology,
    },
    {
      id: 1,
      titleNav: lang.componentsBallisticMaterial,
    },
    {
      id: 2,
      titleNav: lang.production,
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
            <div
              className={`${styles.manufacturing_section1_heading} ${styles.manufacturing_heading} fade-in observe`}
            >
              <CustomMarkdown>{props.pageData.section1Heading}</CustomMarkdown>
            </div>
          ) : null}

          <div className={`${styles.manufacturing_box}`}>
            {props.pageData?.section1Text1 ? (
              <div
                className={`${styles.manufacturing_section1_text1} ${styles.manufacturing_text} fade-in observe`}
              >
                <CustomMarkdown>{props.pageData.section1Text1}</CustomMarkdown>
              </div>
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
                      {lang.videoTagNotSupported}
                    </video>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {props.pageData?.section1Text2 ? (
            <div className={`${styles.manufacturing_quote} observe fade-in`}>
              <CustomMarkdown>{props.pageData.section1Text2}</CustomMarkdown>
            </div>
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
              <div
                className={`${styles.manufacturing_section1_heading} ${styles.manufacturing_heading} fade-in observe`}
              >
                <CustomMarkdown>{props.pageData.section2Text}</CustomMarkdown>
              </div>
            ) : null}

            <div className={`${styles.manufacturing_box}`}>
              {props.pageData?.section2Text2 ? (
                <div className={`${styles.manufacturing_text} observe fade-in`}>
                  <CustomMarkdown>
                    {props.pageData.section2Text2}
                  </CustomMarkdown>
                </div>
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
              <div className={`${styles.manufacturing_quote} observe fade-in`}>
                <CustomMarkdown>{props.pageData.section2Text3}</CustomMarkdown>
              </div>
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
              <div
                className={`${styles.manufacturing_section1_heading} ${styles.manufacturing_heading} fade-in observe`}
              >
                <CustomMarkdown>
                  {props.pageData.section3Heading}
                </CustomMarkdown>
              </div>
            ) : null}

            <div className={`${styles.manufacturing_box}`}>
              {props.pageData?.section3Text ? (
                <div
                  className={`${styles.manufacturing_section3_text} ${styles.manufacturing_text} observe fade-in`}
                >
                  <CustomMarkdown>{props.pageData.section3Text}</CustomMarkdown>
                </div>
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
              <div className={`${styles.manufacturing_quote} observe fade-in`}>
                <CustomMarkdown>{props.pageData.section3Text2}</CustomMarkdown>
              </div>
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

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.manufacturing;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, seoData, locale },
  };
}

export default withLocaleRefetch(Manufacturing, async (locale) => {
  const data = await getPageData({
    route: routes.manufacturing.collection,
    populate: 'deep',
    locale,
  });
  return data.data?.attributes || null;
});
