// import Link from 'next/link';
// import Image from 'next/image';
import styles from './Design.module.scss';
import { getPageData } from 'lib/api';
import { useEffect, useState, useRef } from 'react';
import Banner from 'components/global/banner/Banner';
import Markdown from 'markdown-to-jsx';
import { CldImage } from 'next-cloudinary';

const Design = (props) => {
  // console.log(props.pageData)
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
              <CldImage
                src={
                  props.pageData.section1Image.data.attributes.formats?.large
                    ?.url || props.pageData.section1Image.data.attributes.url
                }
                alt={
                  props.pageData.section1Image.data.attributes.alternativeText
                }
                width={840}
                height={445}
              ></CldImage>
            </div>
          ) : null}
        </div>
      </section>

      <section className={`${styles.design_section2}`}>
        <div className={`container_small`}>
          {props.pageData?.section2Title ? (
            <h2
              className={`${styles.design_title} observe fade-in`}
              dangerouslySetInnerHTML={{ __html: props.pageData.section2Title }}
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
              <CldImage
                src={
                  props.pageData.section2Image.data.attributes.formats?.large
                    ?.url || props.pageData.section2Image.data.attributes.url
                }
                alt={
                  props.pageData.section2Image.data.attributes.alternativeText
                }
                width={665}
                height={315}
              ></CldImage>
            </div>
          ) : null}

          {props.pageData?.section2Text2 ? (
            <Markdown className={`${styles.design_text} observe fade-in`}>
              {props.pageData.section2Text2}
            </Markdown>
          ) : null}

          {props.pageData?.section2Image2.data ? (
            <div className={`observe fade-in`}>
              <CldImage
                src={
                  props.pageData.section2Image2.data.attributes.formats?.large
                    ?.url || props.pageData.section2Image2.data.attributes.url
                }
                alt={
                  props.pageData.section2Image2.data.attributes.alternativeText
                }
                width={590}
                height={315}
              ></CldImage>
            </div>
          ) : null}
        </div>
      </section>

      <div className={`shape-before`}></div>
      <section className={`${styles.design_section3} background-dark`}>
        <div className={`${styles.design_section3_top} container_small`}>
          {props.pageData?.section3Title ? (
            <h2
              className={`${styles.design_title} observe fade-in`}
              dangerouslySetInnerHTML={{ __html: props.pageData.section3Title }}
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
              <h4 className={`${styles.design_armor_title}`}>{item.title}</h4>
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

              {item.image.data.attributes ? (
                <div className={`${styles.design_armor_image}`}>
                  <CldImage
                    src={
                      item.image.data.attributes.formats?.large?.url ||
                      item.image.data.attributes.url
                    }
                    alt={item.image.data.attributes.alternativeText}
                    width={240}
                    height={240}
                  ></CldImage>
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
                  <CldImage
                    src={
                      selectedItem.image.data.attributes.formats?.large?.url ||
                      selectedItem.image.data.attributes.url
                    }
                    alt={selectedItem.image.data.attributes.alternativeText}
                    width={240}
                    height={240}
                  ></CldImage>
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
    </div>
  );
};

export async function getServerSideProps() {
  let pageData = await getPageData({
    route: 'design-and-engineering',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default Design;
