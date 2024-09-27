import styles from './Design.module.scss';
import { getPageData } from 'hooks/api';
import { useEffect, useState } from 'react';
import Banner from 'components/global/banner/Banner';
import Image from 'next/image';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';
import dynamic from 'next/dynamic';
const Gallery = dynamic(
  () => import('components/global/carousel/CarouselCurved')
);
const Popup = dynamic(() => import('components/global/lightbox/PopupSimple'));

const Design = (props) => {
  const convertMarkdown = useMarkdownToHtml();

  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleReadMore = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  // useEffect(() => {
  //   const isModalActive = false;

  //   const handleClickOutside = () => {
  //     if (!popupRef.current || popupRef.current.contains(event.target)) {
  //       return;
  //     }

  //     if (isModalActive) {
  //       setShowPopup(false);
  //     }
  //   };

  //   window.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     window.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

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
              <div
                className={`${styles.design_heading} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section1Text),
                }}
              ></div>
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
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : null}
              </div>
            ) : null}

            {props.pageData?.section1Text2 ? (
              <div
                className={`${styles.design_text} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section1Text2),
                }}
              ></div>
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
              <div
                className={`${styles.design_heading} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section2Text),
                }}
              ></div>
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
              <div
                className={`${styles.design_text} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section2Text2),
                }}
              ></div>
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
                    dangerouslySetInnerHTML={{
                      __html: convertMarkdown(props.pageData.section3Heading),
                    }}
                  ></div>
                ) : null}

                {props.pageData?.section3Text ? (
                  <div
                    className={`${styles.design_text} observe fade-in`}
                    dangerouslySetInnerHTML={{
                      __html: convertMarkdown(props.pageData.section3Text),
                    }}
                  ></div>
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
                  <p
                    className={`${styles.design_armor_description}`}
                    dangerouslySetInnerHTML={{
                      __html: convertMarkdown(item.description),
                    }}
                  ></p>
                  <div
                    className={`${styles.design_armor_read}`}
                    onClick={() => handleReadMore(item)}
                  >
                    Read More
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
                convertMarkdown={convertMarkdown}
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
              <div
                className={`${styles.design_heading} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section4Heading),
                }}
              ></div>
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
                <div
                  className={`${styles.design_text} observe fade-in`}
                  dangerouslySetInnerHTML={{
                    __html: convertMarkdown(props.pageData.section4Text),
                  }}
                ></div>
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
            <p
              className={`${styles.design_heading} fade-in observe`}
              dangerouslySetInnerHTML={{
                __html: convertMarkdown(props.pageData.section6Heading),
              }}
            ></p>
          ) : null}
          <div className={`${styles.design_box}`}>
            {props.pageData?.section6Text ? (
              <div
                className={`${styles.design_section6_text} fade-in observe`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section6Text),
                }}
              ></div>
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
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className={`${styles.design_box}`}>
            {props.pageData?.section6Text2 ? (
              <div
                className={`${styles.design_section6_text} fade-in observe`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section6Text2),
                }}
              ></div>
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
                      Your browser does not support the video tag.
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

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'design-and-engineering',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  const seoData = pageData?.seo || null;

  if (!pageData) {
    return {
      notFound: true,
    };
  }

  return {
    props: { pageData, seoData },
  };
}

export default Design;
