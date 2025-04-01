import styles from './Design.module.scss';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import { getPageData } from 'hooks/api';
import { useState } from 'react';
import routes from 'routes';
import useLocale from 'hooks/useLocale';
import Banner from 'components/global/banner/Banner';
import Image from 'next/image';
import CustomMarkdown from 'components/CustomMarkdown';
import dynamic from 'next/dynamic';
const Gallery = dynamic(
  () => import('components/global/carousel/CarouselCurved')
);
const Popup = dynamic(() => import('components/global/lightbox/PopupSimple'));

const Design = (props) => {
  const { lang } = useLocale();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleReadMore = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  return (
    <>
      <div className={`${styles.design}`}>
        {props.pageData?.banner ? (
          <>
            <Banner props={props.pageData.banner} shape="white" />
          </>
        ) : null}

        <section className={`${styles.design_section1}`}>
          <div className={`container_small`}>
            {props.pageData?.section1Title ? (
              <h2
                className={`${styles.design_title} block-reveal observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section1Title,
                }}
              ></h2>
            ) : null}

            {props.pageData?.section1Text ? (
              <div className={`${styles.design_heading} observe fade-in`}>
                <CustomMarkdown>{props.pageData.section1Text}</CustomMarkdown>
              </div>
            ) : null}
          </div>

          <div className={`${styles.design_box} container`}>
            {props.pageData?.section1Image2.data ? (
              <div className={`${styles.design_image} observe fade-in`}>
                {props.pageData.section1Image2.data.attributes.mime.startsWith(
                  'image/'
                ) ? (
                  <Image
                    src={`${
                      props.pageData.section1Image2.data.attributes.formats
                        .medium?.url ||
                      props.pageData.section1Image2.data.attributes.url
                    }`}
                    alt={
                      props.pageData.section1Image2.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={
                      props.pageData.section1Image2.data.attributes.formats
                        ?.medium?.width ||
                      props.pageData.section1Image2.data.attributes.width
                    }
                    height={
                      props.pageData.section1Image2.data.attributes.formats
                        ?.medium?.height ||
                      props.pageData.section1Image2.data.attributes.height
                    }
                  />
                ) : props.pageData.section1Image2.data.attributes.mime.startsWith(
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
                        src={`${props.pageData.section1Image2.data.attributes?.url}`}
                        type={
                          props.pageData.section1Image2.data.attributes.mime
                        }
                      />
                      {lang.videoTagNotSupported}
                    </video>
                  </div>
                ) : null}
              </div>
            ) : null}

            {props.pageData?.section1Text2 ? (
              <div className={`${styles.design_text} observe fade-in`}>
                <CustomMarkdown>{props.pageData.section1Text2}</CustomMarkdown>
              </div>
            ) : null}

            {props.pageData?.section1Image.data ? (
              <div className={`${styles.design_image} observe fade-in`}>
                <Image
                  src={
                    props.pageData.section1Image.data.attributes.formats?.medium
                      ?.url || props.pageData.section1Image.data.attributes.url
                  }
                  alt={
                    props.pageData.section1Image.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  quality={100}
                  width={
                    props.pageData.section1Image.data.attributes.formats?.medium
                      ?.width ||
                    props.pageData.section1Image.data.attributes.width
                  }
                  height={
                    props.pageData.section1Image.data.attributes.formats?.medium
                      ?.height ||
                    props.pageData.section1Image.data.attributes.height
                  }
                ></Image>
              </div>
            ) : null}
          </div>
        </section>

        <section className={`${styles.design_section2}`}>
          <div className={`container_small`}>
            {props.pageData?.section2Title ? (
              <h2
                className={`${styles.design_title} block-reveal observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section2Title,
                }}
              ></h2>
            ) : null}

            {props.pageData?.section2Text ? (
              <div className={`${styles.design_heading} observe fade-in`}>
                <CustomMarkdown>{props.pageData.section2Text}</CustomMarkdown>
              </div>
            ) : null}
          </div>

          <div className={`${styles.design_box} container`}>
            {props.pageData?.section2Image.data ? (
              <div className={`${styles.design_image} observe fade-in`}>
                <Image
                  src={
                    props.pageData.section2Image.data.attributes.formats?.medium
                      ?.url || props.pageData.section2Image.data.attributes.url
                  }
                  alt={
                    props.pageData.section2Image.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  quality={100}
                  width={
                    props.pageData.section2Image.data.attributes.formats?.medium
                      ?.width ||
                    props.pageData.section2Image.data.attributes.width
                  }
                  height={
                    props.pageData.section2Image.data.attributes.formats?.medium
                      ?.height ||
                    props.pageData.section2Image.data.attributes.height
                  }
                ></Image>
              </div>
            ) : null}

            {props.pageData?.section2Text2 ? (
              <div className={`${styles.design_text} observe fade-in`}>
                <CustomMarkdown>{props.pageData.section2Text2}</CustomMarkdown>
              </div>
            ) : null}

            {props.pageData?.section2Image2.data ? (
              <div className={`${styles.design_image} observe fade-in`}>
                <Image
                  src={
                    props.pageData.section2Image2.data.attributes.formats
                      ?.medium?.url ||
                    props.pageData.section2Image2.data.attributes.url
                  }
                  alt={
                    props.pageData.section2Image2.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  quality={100}
                  width={
                    props.pageData.section2Image2.data.attributes.formats
                      ?.medium?.width ||
                    props.pageData.section2Image2.data.attributes.width
                  }
                  height={
                    props.pageData.section2Image2.data.attributes.formats
                      ?.medium?.height ||
                    props.pageData.section2Image2.data.attributes.height
                  }
                ></Image>
              </div>
            ) : null}
          </div>
        </section>

        <div className={`shape-before`}></div>
        <div className={`background-dark`}>
          <section className={`${styles.design_section3}`}>
            <div className={`${styles.design_section3_top} container_small`}>
              {props.pageData?.section3Title ? (
                <h2
                  className={`${styles.design_title} block-reveal observe fade-in`}
                  dangerouslySetInnerHTML={{
                    __html: props.pageData.section3Title,
                  }}
                ></h2>
              ) : null}

              <div className={`${styles.design_section3_top_box}`}>
                {props.pageData?.section3Heading ? (
                  <div
                    className={`${styles.design_section3_heading} ${styles.design_heading} observe fade-in`}
                  >
                    <CustomMarkdown>
                      {props.pageData.section3Heading}
                    </CustomMarkdown>
                  </div>
                ) : null}

                {props.pageData?.section3Text ? (
                  <div className={`${styles.design_text} observe fade-in`}>
                    <CustomMarkdown>
                      {props.pageData.section3Text}
                    </CustomMarkdown>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={`${styles.design_armor} container`}>
              {props.pageData?.section3Armor.map((item, index) => (
                <div
                  className={`${styles.design_armor_item}  observe fade-in-up`}
                  key={index}
                >
                  <h4 className={`${styles.design_armor_title}`}>
                    {item.title}
                  </h4>

                  <div className={`${styles.design_armor_description}`}>
                    <CustomMarkdown>{item.description}</CustomMarkdown>
                  </div>

                  <div
                    className={`${styles.design_armor_read}`}
                    onClick={() => handleReadMore(item)}
                  >
                    {lang.readMore}
                  </div>

                  {item.image?.data ? (
                    <div className={`${styles.design_armor_image}`}>
                      <Image
                        src={
                          item.image.data[0].attributes.formats?.medium?.url ||
                          item.image.data[0].attributes.url
                        }
                        alt={
                          item.image.data[0].attributes.alternativeText ||
                          'Alpine Armoring'
                        }
                        width={240}
                        height={240}
                        quality={100}
                      ></Image>
                    </div>
                  ) : null}
                </div>
              ))}

              <Popup
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                selectedItem={selectedItem}
              />
            </div>
          </section>

          <section className={`${styles.design_section4} container_small`}>
            {props.pageData?.section4Title ? (
              <h2
                className={`${styles.design_title} block-reveal observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section4Title,
                }}
              ></h2>
            ) : null}

            {props.pageData?.section4Heading ? (
              <div className={`${styles.design_heading} observe fade-in`}>
                <CustomMarkdown>
                  {props.pageData.section4Heading}
                </CustomMarkdown>
              </div>
            ) : null}

            <div className={`${styles.design_box} container`}>
              {props.pageData?.section5Image.data?.attributes ? (
                <div className={`${styles.design_image} observe fade-in`}>
                  <Image
                    src={
                      props.pageData.section5Image.data.attributes.formats
                        ?.medium?.url ||
                      props.pageData.section5Image.data.attributes.url
                    }
                    alt={
                      props.pageData.section5Image.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    quality={100}
                    width={
                      props.pageData.section5Image.data.attributes.formats
                        ?.medium?.width ||
                      props.pageData.section5Image.data.attributes.width
                    }
                    height={
                      props.pageData.section5Image.data.attributes.formats
                        ?.medium?.height ||
                      props.pageData.section5Image.data.attributes.height
                    }
                    className={`${styles.design_image} observe fade-in`}
                  ></Image>
                </div>
              ) : null}

              {props.pageData?.section4Text ? (
                <div className={`${styles.design_text} observe fade-in`}>
                  <CustomMarkdown>{props.pageData.section4Text}</CustomMarkdown>
                </div>
              ) : null}

              {props.pageData?.section4Image.data?.attributes ? (
                <div className={`${styles.design_image} observe fade-in`}>
                  <Image
                    src={
                      props.pageData.section4Image.data.attributes.formats
                        ?.medium?.url ||
                      props.pageData.section4Image.data.attributes.url
                    }
                    alt={
                      props.pageData.section4Image.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    quality={100}
                    width={
                      props.pageData.section4Image.data.attributes.formats
                        ?.medium?.width ||
                      props.pageData.section4Image.data.attributes.width
                    }
                    height={
                      props.pageData.section4Image.data.attributes.formats
                        ?.medium?.height ||
                      props.pageData.section4Image.data.attributes.height
                    }
                    className={`${styles.design_image} observe fade-in`}
                  ></Image>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <div className={`shape-after`}></div>

        <section className={`${styles.design_section5} container_small`}>
          {props.pageData?.section6Title ? (
            <h2 className={`${styles.design_title} block-reveal observe`}>
              <span
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section6Title,
                }}
              ></span>
            </h2>
          ) : null}

          {props.pageData?.section6Heading ? (
            <div className={`${styles.design_heading} observe fade-in`}>
              <CustomMarkdown>{props.pageData.section6Heading}</CustomMarkdown>
            </div>
          ) : null}

          <div className={`${styles.design_box}`}>
            {props.pageData?.section6Text ? (
              <div
                className={`${styles.design_section6_text} ${styles.design_text} fade-in observe`}
              >
                <CustomMarkdown>{props.pageData.section6Text}</CustomMarkdown>
              </div>
            ) : null}

            {props.pageData?.section6Image.data ? (
              <div className={`${styles.design_image} observe fade-in`}>
                {props.pageData.section6Image.data.attributes.mime.startsWith(
                  'image/'
                ) ? (
                  <Image
                    src={`${
                      props.pageData.section6Image.data.attributes.formats
                        .medium?.url ||
                      props.pageData.section6Image.data.attributes.url
                    }`}
                    alt={
                      props.pageData.section6Image.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={620}
                    height={430}
                  />
                ) : props.pageData.section6Image.data.attributes.mime.startsWith(
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
                        src={`${props.pageData.section6Image.data.attributes?.url}`}
                        type={props.pageData.section6Image.data.attributes.mime}
                      />
                      {lang.videoTagNotSupported}
                    </video>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className={`${styles.design_box}`}>
            {props.pageData?.section6Text2 ? (
              <div
                className={`${styles.design_section6_text} ${styles.design_text} fade-in observe`}
              >
                <CustomMarkdown>{props.pageData.section6Text2}</CustomMarkdown>
              </div>
            ) : null}
            {props.pageData?.section6Image2.data ? (
              <div className={`${styles.design_image} observe fade-in`}>
                {props.pageData.section6Image2.data.attributes.mime.startsWith(
                  'image/'
                ) ? (
                  <Image
                    src={`${
                      props.pageData.section6Image2.data.attributes.formats
                        .medium?.url ||
                      props.pageData.section6Image2.data.attributes.url
                    }`}
                    alt={
                      props.pageData.section6Image2.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={620}
                    height={430}
                  />
                ) : props.pageData.section6Image2.data.attributes.mime.startsWith(
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
                        src={`${props.pageData.section6Image2.data.attributes?.url}`}
                        type={
                          props.pageData.section6Image2.data.attributes.mime
                        }
                      />
                      {lang.videoTagNotSupported}
                    </video>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
        {props.pageData?.section6Gallery.data ? (
          <div className={`${styles.slug_gallery}`}>
            <Gallery
              props={props.pageData?.section6Gallery.data}
              white
              squared
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.designAndEngineering;

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

  if (!pageData) {
    return {
      notFound: true,
    };
  }

  return {
    props: { pageData, seoData, locale },
  };
}

export default withLocaleRefetch(Design, async (locale) => {
  const data = await getPageData({
    route: routes.designAndEngineering.collection,
    populate: 'deep',
    locale,
  });
  return data.data?.attributes || null;
});
