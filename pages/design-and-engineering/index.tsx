// import Link from 'next/link';
// import Image from 'next/image';
import styles from './Design.module.scss';
import { getPageData } from 'lib/api';
import { useEffect, useState, useRef } from 'react';
import Banner from 'components/global/banner/Banner';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import Seo from 'components/Seo';

const Design = (props) => {
  const seoData = props.pageData?.seo;

  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const popupRef = useRef<HTMLDivElement>(null);

  const handleReadMore = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (
        popupRef.current &&
        popupRef.current.classList.contains('modal_active')
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  return (
    <>
      <Seo props={seoData} />

      <div className={`${styles.design}`}>
        {props.pageData?.banner ? (
          <>
            <Banner props={props.pageData.banner} center shape="white" />
          </>
        ) : null}

        <section className={`${styles.design_section1} container_small`}>
          {props.pageData?.section1Title ? (
            <h2
              className={`${styles.design_title} observe fade-in`}
              dangerouslySetInnerHTML={{ __html: props.pageData.section1Title }}
            ></h2>
          ) : null}

          {props.pageData?.section1Text ? (
            <Markdown className={`${styles.design_heading} observe fade-in`}>
              {props.pageData.section1Text}
            </Markdown>
          ) : null}

          <div className={`${styles.design_box}`}>
            {props.pageData?.section1Text2 ? (
              <Markdown className={`${styles.design_text} observe fade-in`}>
                {props.pageData.section1Text2}
              </Markdown>
            ) : null}

            {props.pageData?.section1Image.data ? (
              <div className={`observe fade-in`}>
                <Image
                  src={
                    props.pageData.section1Image.data.attributes.formats?.large
                      ?.url || props.pageData.section1Image.data.attributes.url
                  }
                  alt={
                    props.pageData.section1Image.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  width={840}
                  height={445}
                ></Image>
              </div>
            ) : null}
          </div>
        </section>

        <section className={`${styles.design_section2}`}>
          <div className={`container_small`}>
            {props.pageData?.section2Title ? (
              <h2
                className={`${styles.design_title} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section2Title,
                }}
              ></h2>
            ) : null}

            {props.pageData?.section2Text ? (
              <Markdown className={`${styles.design_heading} observe fade-in`}>
                {props.pageData.section2Text}
              </Markdown>
            ) : null}
          </div>

          <div className={`${styles.design_box} container`}>
            {props.pageData?.section2Image.data ? (
              <div className={`observe fade-in`}>
                <Image
                  src={
                    props.pageData.section2Image.data.attributes.formats?.large
                      ?.url || props.pageData.section2Image.data.attributes.url
                  }
                  alt={
                    props.pageData.section2Image.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  width={665}
                  height={315}
                ></Image>
              </div>
            ) : null}

            {props.pageData?.section2Text2 ? (
              <Markdown className={`${styles.design_text} observe fade-in`}>
                {props.pageData.section2Text2}
              </Markdown>
            ) : null}

            {props.pageData?.section2Image2.data ? (
              <div className={`observe fade-in`}>
                <Image
                  src={
                    props.pageData.section2Image2.data.attributes.formats?.large
                      ?.url || props.pageData.section2Image2.data.attributes.url
                  }
                  alt={
                    props.pageData.section2Image2.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  width={590}
                  height={315}
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
                  className={`${styles.design_title} observe fade-in`}
                  dangerouslySetInnerHTML={{
                    __html: props.pageData.section3Title,
                  }}
                ></h2>
              ) : null}

              <div className={`${styles.design_section3_top_box}`}>
                {props.pageData?.section3Heading ? (
                  <div
                    className={`${styles.design_section3_heading} observe fade-in`}
                  >
                    <Markdown>{props.pageData.section3Heading}</Markdown>
                  </div>
                ) : null}

                {props.pageData?.section3Text ? (
                  <div className={`${styles.design_text} observe fade-in`}>
                    <Markdown>{props.pageData.section3Text}</Markdown>
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
                  <p className={`${styles.design_armor_description}`}>
                    {item.description}
                  </p>
                  {/* <div className={`${styles.design_armor_read}`}>Read More</div> */}
                  <div
                    className={`${styles.design_armor_read}`}
                    onClick={() => handleReadMore(item)}
                  >
                    Read More
                  </div>

                  {item.image?.data?.attributes ? (
                    <div
                      className={`${styles.design_armor_image} observe fade-in`}
                    >
                      <Image
                        src={
                          item.image.data.attributes.formats?.large?.url ||
                          item.image.data.attributes.url
                        }
                        alt={
                          item.image.data.attributes.alternativeText ||
                          'Alpine Armoring'
                        }
                        width={240}
                        height={240}
                      ></Image>
                    </div>
                  ) : null}
                </div>
              ))}

              {showPopup && (
                <div
                  ref={popupRef}
                  className={`modal ${showPopup ? 'modal_active' : ''}`}
                >
                  <div className={`modal_inner`}>
                    <h3 className={`modal_title`}>{selectedItem.title}</h3>
                    <div className={`modal_box`}>
                      <p className={`modal_description`}>
                        {selectedItem.description}
                      </p>
                      <Image
                        src={
                          selectedItem.image.data.attributes.formats?.large
                            ?.url || selectedItem.image.data.attributes.url
                        }
                        alt={
                          selectedItem.image.data.attributes.alternativeText ||
                          'Alpine Armoring'
                        }
                        width={240}
                        height={240}
                      ></Image>
                    </div>
                    <button
                      className={`modal_close`}
                      onClick={() => setShowPopup(false)}
                    ></button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className={`${styles.design_section4} container_small`}>
            {props.pageData?.section4Title ? (
              <h2
                className={`${styles.design_title} observe fade-in`}
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section4Title,
                }}
              ></h2>
            ) : null}

            {props.pageData?.section4Heading ? (
              <div className={`${styles.design_heading} observe fade-in`}>
                <Markdown>{props.pageData.section4Heading}</Markdown>
              </div>
            ) : null}

            <div className={`${styles.design_box}`}>
              {props.pageData?.section4Text ? (
                <div className={`${styles.design_text} observe fade-in`}>
                  <Markdown>{props.pageData.section4Text}</Markdown>
                </div>
              ) : null}

              {props.pageData?.section4Image.data.attributes ? (
                <Image
                  src={
                    props.pageData.section4Image.data.attributes.formats?.large
                      ?.url || props.pageData.section4Image.data.attributes.url
                  }
                  alt={
                    props.pageData.section4Image.data.attributes
                      .alternativeText || 'Alpine Armoring'
                  }
                  width={350}
                  height={350}
                  className={`observe fade-in`}
                ></Image>
              ) : null}
            </div>
          </section>
        </div>

        <div className={`shape-after`}></div>

        <section className={`${styles.design_section5} container_small`}>
          {props.pageData?.section5Title ? (
            <h2
              className={`${styles.design_title} observe fade-in`}
              dangerouslySetInnerHTML={{ __html: props.pageData.section5Title }}
            ></h2>
          ) : null}

          {props.pageData?.section5Heading ? (
            <div className={`${styles.design_heading} observe fade-in`}>
              <Markdown>{props.pageData.section5Heading}</Markdown>
            </div>
          ) : null}

          <div className={`${styles.design_box}`}>
            {props.pageData?.section5Image.data.attributes ? (
              <Image
                src={
                  props.pageData.section5Image.data.attributes.formats?.large
                    ?.url || props.pageData.section5Image.data.attributes.url
                }
                alt={
                  props.pageData.section5Image.data.attributes
                    .alternativeText || 'Alpine Armoring'
                }
                width={710}
                height={397}
                className={`observe fade-in`}
              ></Image>
            ) : null}

            {props.pageData?.section5Text ? (
              <div className={`${styles.design_text} observe fade-in`}>
                <Markdown>{props.pageData.section5Text}</Markdown>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
};

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'design-and-engineering',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  if (!pageData || !pageData.data || pageData.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { pageData },
  };
}

export default Design;
