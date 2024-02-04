import styles from './Manufacturing.module.scss';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Markdown from 'markdown-to-jsx';
import { useEffect } from 'react';
import Gallery from 'components/global/carousel/CarouselCurved';
import { CldImage } from 'next-cloudinary';
import useSplitText from 'hooks/useSplitText';

function Manufacturing(props) {
  // console.log(props.pageData)
  // return null;

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
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

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  useSplitText();

  return (
    <div className={`${styles.manufacturing} background-dark`}>
      {props.pageData?.banner ? (
        <>
          <Banner props={props.pageData.banner} shape="dark" center />
        </>
      ) : null}

      <section className={`${styles.manufacturing_section1} container`}>
        <div className={`${styles.manufacturing_section1_top}`}>
          {props.pageData?.section1Title ? (
            <h2
              className={`${styles.manufacturing_title} observe splitLetters`}
              data-split-delay="25"
              data-split-duration="500"
              dangerouslySetInnerHTML={{ __html: props.pageData.section1Title }}
            ></h2>
          ) : null}

          {props.pageData?.section1Heading ? (
            <p
              className={`${styles.manufacturing_section1_heading} observe`}
              dangerouslySetInnerHTML={{
                __html: props.pageData.section1Heading,
              }}
            ></p>
          ) : null}

          <div className={`${styles.manufacturing_section1_box} observe`}>
            {props.pageData?.section1Image.data ? (
              <div
                className={`${styles.manufacturing_section1_image} ${styles.manufacturing_image} slide-in-left`}
              >
                <div className={`slide-in-right`}>
                  <CldImage
                    src={
                      props.pageData.section1Image.data.attributes.formats
                        ?.large?.url ||
                      props.pageData.section1Image.data.attributes.url
                    }
                    alt={
                      props.pageData.section1Image.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={500}
                    height={400}
                    sizes="(min-width: 768px ) 40vw, 100vw"
                    className={`scale-in-down`}
                  ></CldImage>
                </div>
              </div>
            ) : null}

            {props.pageData?.section1Text1 ? (
              <p
                className={`${styles.manufacturing_section1_text1} ${styles.manufacturing_text} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section1Text1,
                }}
              ></p>
            ) : null}
          </div>
        </div>

        {props.pageData?.section1Image2 ? (
          <div
            className={`${styles.manufacturing_section1_image2} ${styles.manufacturing_image} observe slide-in-left`}
          >
            <div className={`slide-in-right`}>
              <CldImage
                src={
                  props.pageData.section1Image2.data.attributes.formats?.large
                    ?.url || props.pageData.section1Image2.data.attributes.url
                }
                alt={
                  props.pageData.section1Image2.data.attributes
                    .alternativeText || 'Alpine Armoring'
                }
                width={
                  props.pageData.section1Image2.data.attributes.formats?.large
                    ?.width ||
                  props.pageData.section1Image2.data.attributes.width
                }
                height={
                  props.pageData.section1Image2.data.attributes.formats?.large
                    ?.height ||
                  props.pageData.section1Image2.data.attributes.height
                }
                className={`scale-in-down`}
              ></CldImage>
            </div>
          </div>
        ) : null}

        {props.pageData?.section1Text2 ? (
          <p
            className={`${styles.manufacturing_quote} observe fade-in`}
            dangerouslySetInnerHTML={{ __html: props.pageData.section1Text2 }}
          ></p>
        ) : null}
      </section>

      <section className={`${styles.manufacturing_section2}`}>
        <div className={`container_small`}>
          {props.pageData?.section2Title ? (
            <h2
              className={`${styles.manufacturing_title} observe fade-in`}
              dangerouslySetInnerHTML={{ __html: props.pageData.section2Title }}
            ></h2>
          ) : null}

          {props.pageData?.section2Heading ? (
            <p
              className={`${styles.manufacturing_section2_heading} observe fade-in`}
              dangerouslySetInnerHTML={{
                __html: props.pageData.section2Heading,
              }}
            ></p>
          ) : null}

          <div className={`${styles.manufacturing_box}`}>
            {props.pageData?.section2Image ? (
              <div className={`${styles.manufacturing_image} observe fade-in`}>
                <CldImage
                  src={
                    props.pageData.section2Image.data.attributes.formats?.large
                      ?.url || props.pageData.section2Image.data.attributes.url
                  }
                  alt={
                    props.pageData.section2Image.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  width={600}
                  height={475}
                ></CldImage>
              </div>
            ) : null}

            {props.pageData?.section2Text ? (
              <p
                className={`${styles.manufacturing_text} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section2Text,
                }}
              ></p>
            ) : null}
          </div>
        </div>

        {props.pageData?.section2Gallery.data ? (
          <div className={`${styles.slug_gallery}`}>
            <Gallery props={props.pageData?.section2Gallery.data} squared />
          </div>
        ) : null}

        <div className={`container_small`}>
          {props.pageData?.section2Text2 ? (
            <Markdown
              className={`${styles.manufacturing_quote} observe fade-in`}
            >
              {props.pageData.section2Text2}
            </Markdown>
          ) : null}
        </div>
      </section>

      <section className={`${styles.manufacturing_section3}`}>
        <div className={`container_small`}>
          {props.pageData?.section3Title ? (
            <h2
              className={`${styles.manufacturing_title} observe fade-in`}
              dangerouslySetInnerHTML={{ __html: props.pageData.section3Title }}
            ></h2>
          ) : null}

          {props.pageData?.section3Heading ? (
            <Markdown
              className={`${styles.manufacturing_section3_heading} observe fade-in`}
            >
              {props.pageData.section3Heading}
            </Markdown>
          ) : null}

          <div className={`${styles.manufacturing_box}`}>
            {props.pageData?.section3Image.data ? (
              <div className={`${styles.manufacturing_image} observe fade-in`}>
                <CldImage
                  src={
                    props.pageData.section3Image.data.attributes.formats?.large
                      ?.url || props.pageData.section3Image.data.attributes.url
                  }
                  alt={
                    props.pageData.section3Image.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  width={600}
                  height={475}
                ></CldImage>
              </div>
            ) : null}

            {props.pageData?.section3Text ? (
              <Markdown
                className={`${styles.manufacturing_section3_text} ${styles.manufacturing_text} observe fade-in`}
              >
                {props.pageData.section3Text}
              </Markdown>
            ) : null}
          </div>

          {props.pageData?.section3Text2 ? (
            <p
              className={`${styles.manufacturing_quote} observe fade-in`}
              dangerouslySetInnerHTML={{ __html: props.pageData.section3Text2 }}
            ></p>
          ) : null}
        </div>

        {props.pageData?.section3Gallery.data ? (
          <div className={`${styles.slug_gallery}`}>
            <Gallery props={props.pageData?.section3Gallery.data} />
          </div>
        ) : null}
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  let pageData = await getPageData({
    route: 'manufacturing',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default Manufacturing;
