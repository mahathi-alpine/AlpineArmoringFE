import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import styles from './About.module.scss';
import Banner from 'components/global/banner/Banner';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import Seo from 'components/Seo';
import FillingText from 'components/global/filling-text/FillingText';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import Gallery from 'components/global/carousel/CarouselCurved';

function About(props) {
  const seoData = props?.pageData?.seo;
  const boxes = props?.pageData?.boxes;

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const currentObserverRef = observerRef.current; // Capture the current value of the ref

    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => currentObserverRef.observe(item));

    return () => {
      targets.forEach((item) => currentObserverRef.unobserve(item));
    };
  }, [observerRef]); // Include observerRef in the dependency array

  // console.log(props);
  // return null;

  return (
    <>
      <Seo props={seoData} />

      <div className={`${styles.about}`}>
        {props.pageData?.banner ? (
          <Banner props={props.pageData.banner} center shape="white" />
        ) : null}

        <div className={`${styles.about_text} observe fade-in container_small`}>
          {props.pageData?.text ? (
            <Markdown>{props.pageData.text}</Markdown>
          ) : null}
        </div>

        <div className={`${styles.about_box_wrap} container`}>
          {boxes?.map((item, index) => (
            <div
              className={`${styles.about_box_item} background-dark observe fade-in`}
              key={index}
            >
              <div
                className={`${styles.about_box_item_shape} shape-before`}
              ></div>

              <div className={`${styles.about_box_item_content}`}>
                {item.title ? (
                  <h2
                    className={`${styles.about_box_item_title}`}
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></h2>
                ) : null}

                {item.description ? (
                  <p
                    className={`${styles.about_box_item_text}`}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></p>
                ) : null}
              </div>

              {item.image.data ? (
                <div className={`${styles.about_box_item_image}`}>
                  <Gallery props={item.image.data} singular />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {props.pageData?.quote ? (
          <div className={`${styles.about_quote}`}>
            <FillingText data={props.pageData?.quote} dark />
          </div>
        ) : null}

        {props.pageData?.bottomImage.data ? (
          <div className={`${styles.about_bottom_img} container_small`}>
            <Image
              src={`${
                props.pageData?.bottomImage.data?.attributes.formats?.large
                  ?.url || props.pageData?.bottomImage.data?.attributes.url
              }`}
              alt={
                props.pageData?.bottomImage.data?.attributes.alternativeText ||
                'Alpine Armoring'
              }
              width={
                props.pageData?.bottomImage.data?.attributes.formats?.large
                  ?.width || props.pageData?.bottomImage.data?.attributes.width
              }
              height={
                props.pageData?.bottomImage.data?.attributes.formats?.large
                  ?.height ||
                props.pageData?.bottomImage.data?.attributes.height
              }
            />
          </div>
        ) : null}
      </div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'about',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default About;
