import styles from './Testing.module.scss';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import { getPageData } from 'hooks/api';
import { useState, useRef } from 'react';
import Banner from 'components/global/banner/Banner';
import CustomMarkdown from 'components/CustomMarkdown';
import TabSlider from 'components/global/tab-slider/TabSlider';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import Image from 'next/image';
import routes from 'routes';
import useLocale from 'hooks/useLocale';
import Link from 'next/link';
import PlayIcon from 'components/icons/Play';
import MediaList from 'pages/media/MediaList';
import { useOutsideClick } from 'hooks/useOutsideClick';
import ArrowIcon from 'components/icons/Arrow';

function Testing(props) {
  const { lang } = useLocale();
  const title = props?.pageData?.mainTitle;
  const heading = props?.pageData?.heading;
  const videos = props?.pageData?.section3Video?.data;
  const certificate1 = props?.pageData?.certificate1?.data?.attributes?.url;
  const certificate2 = props?.pageData?.certificate2?.data?.attributes?.url;

  const flipImage1 = props?.pageData?.flipImage1?.data?.attributes?.url;
  const flipImage2 = props?.pageData?.flipImage2?.data?.attributes?.url;

  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const popupRef = useRef(null);

  const ballisticFlip = {
    image: {
      data: [
        {
          attributes: {
            url: flipImage1,
            url2: flipImage2,
          },
        },
      ],
    },
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleReadMore = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  useOutsideClick(popupRef, () => {
    setShowPopup(false);
  });

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  const tabSliderData = [
    {
      id: 0,
      titleNav: lang.ballisticCertifications,
    },
    {
      id: 1,
      titleNav: lang.materialTesting,
    },
    {
      id: 2,
      titleNav: lang.liveFireTesting,
    },
  ];

  const handleTabChange = (index) => {
    // const targetId = titleNav.toLowerCase().replace(/\s+/g, '-');
    const targetId = `anchor${index + 1}`;
    const targetElement = document.getElementById(targetId);
    const offset = 100;

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  // Lightbox
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [contentType, setContentType] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  const handleLightboxOpen = (title, location, contentType, url = null) => {
    setSelectedTitle(title);
    setSelectedLocation(location);
    setContentType(contentType);
    if (contentType === 'video') {
      setVideoSrc(url);
    }
    setLightboxPopupOpen(true);
  };

  const lightboxData = {
    title: selectedTitle,
    location: selectedLocation,
    contentType: contentType,
    videoSrc: videoSrc,
  };

  return (
    <>
      <div className={`${styles.testing} background-dark`}>
        {props.pageData?.banner ? (
          <Banner props={props.pageData?.banner} shape="dark" />
        ) : null}

        {lang.ballisticCertifications ? (
          <TabSlider
            className={`${styles.testing_tabs} desktop-only`}
            props={tabSliderData}
            onTabChange={handleTabChange}
            anchor
          />
        ) : null}

        {title ? (
          <div
            className={`${styles.testing_title} observe fade-in container_small`}
          >
            <p dangerouslySetInnerHTML={{ __html: title }}></p>
          </div>
        ) : null}

        {heading ? (
          <div
            className={`${styles.testing_heading} observe fade-in container_small`}
          >
            <p dangerouslySetInnerHTML={{ __html: heading }}></p>
          </div>
        ) : null}

        <section
          className={`${styles.testing_section1} ${styles.testing_container_small} container_small`}
          id="anchor1"
        >
          {props.pageData?.section1Title ? (
            <h2 className={`${styles.testing_title} block-reveal observe`}>
              <span
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section1Title,
                }}
              ></span>
            </h2>
          ) : null}

          {props.pageData?.section1Heading ? (
            <div
              className={`${styles.testing_section1_heading} ${styles.testing_heading} fade-in observe`}
            >
              <CustomMarkdown>{props.pageData.section1Heading}</CustomMarkdown>
            </div>
          ) : null}

          <div className={styles.galleryContainer}>
            <div className={styles.gallerySection}>
              {props?.pageData?.titleGallery1 && (
                <h2 className={styles.title}>
                  {props?.pageData?.titleGallery1}
                </h2>
              )}
              <div className={styles.galleryTest}>
                {certificate1 ? (
                  <Link
                    href={certificate1}
                    target="_blank"
                    className={styles.galleryTest_link}
                  >
                    {props.pageData?.section1Gallery1.data ? (
                      <div className={styles.imageWrapper}>
                        <Image
                          src={
                            props.pageData.section1Gallery1.data.attributes
                              .formats?.medium?.url ||
                            props.pageData.section1Gallery1.data.attributes.url
                          }
                          alt={
                            props.pageData.section1Gallery1.data.attributes
                              .alternativeText || 'Alpine Armoring'
                          }
                          quality={100}
                          width={
                            props.pageData.section1Gallery1.data.attributes
                              .formats?.medium?.width ||
                            props.pageData.section1Gallery1.data.attributes
                              .width
                          }
                          height={
                            props.pageData.section1Gallery1.data.attributes
                              .formats?.medium?.height ||
                            props.pageData.section1Gallery1.data.attributes
                              .height
                          }
                        ></Image>
                      </div>
                    ) : null}
                  </Link>
                ) : null}
                {props.pageData?.section1Gallery12.data ? (
                  <div className={`${styles.testing_image} observe fade-in`}>
                    {/* Thumbnail with play button */}
                    <div
                      style={{ cursor: 'pointer', position: 'relative' }}
                      onClick={() =>
                        handleLightboxOpen(
                          props.pageData?.titleGallery1,
                          '',
                          'video',
                          props.pageData?.linkURL1
                        )
                      }
                    >
                      <Image
                        src={
                          props.pageData.section1Gallery12.data.attributes
                            .formats?.medium?.url ||
                          props.pageData.section1Gallery12.data.attributes.url
                        }
                        alt={props.pageData?.titleGallery1}
                        width="384"
                        height="266"
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'none',
                        }}
                      >
                        <PlayIcon />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.gallerySection}>
              {props?.pageData?.titleGallery2 && (
                <h2 className={styles.title}>
                  {props?.pageData?.titleGallery2}
                </h2>
              )}
              <div className={styles.galleryTest}>
                {props.pageData?.section1Gallery22.data ? (
                  <div className={`${styles.testing_image} observe fade-in`}>
                    {/* Thumbnail with play button */}
                    <div
                      style={{ cursor: 'pointer', position: 'relative' }}
                      onClick={() =>
                        handleLightboxOpen(
                          props.pageData?.titleGallery2,
                          '',
                          'video',
                          props.pageData?.linkURL2
                        )
                      }
                    >
                      <Image
                        src={
                          props.pageData.section1Gallery22.data.attributes
                            .formats?.medium?.url ||
                          props.pageData.section1Gallery22.data.attributes.url
                        }
                        alt={props.pageData?.titleGallery2}
                        width="384"
                        height="266"
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'none',
                        }}
                      >
                        <PlayIcon />
                      </div>
                    </div>
                  </div>
                ) : null}
                {certificate2 ? (
                  <Link
                    href={certificate2}
                    target="_blank"
                    className={styles.galleryTest_link}
                  >
                    {props.pageData?.section1Gallery2.data ? (
                      <div className={styles.imageWrapper}>
                        <Image
                          src={
                            props.pageData.section1Gallery2.data.attributes
                              .formats?.medium?.url ||
                            props.pageData.section1Gallery2.data.attributes.url
                          }
                          alt={
                            props.pageData.section1Gallery2.data.attributes
                              .alternativeText || 'Alpine Armoring'
                          }
                          quality={100}
                          width={
                            props.pageData.section1Gallery2.data.attributes
                              .formats?.medium?.width ||
                            props.pageData.section1Gallery2.data.attributes
                              .width
                          }
                          height={
                            props.pageData.section1Gallery2.data.attributes
                              .formats?.medium?.height ||
                            props.pageData.section1Gallery2.data.attributes
                              .height
                          }
                        ></Image>
                      </div>
                    ) : null}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>
        <section
          className={`${styles.testing_section1} ${styles.testing_container_small} container_small`}
          id="anchor2"
        >
          {props.pageData?.section2Title ? (
            <h2 className={`${styles.testing_title} block-reveal observe`}>
              <span
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section2Title,
                }}
              ></span>
            </h2>
          ) : null}

          {props.pageData?.section2Heading ? (
            <div
              className={`${styles.testing_section1_heading} ${styles.testing_heading} fade-in observe`}
            >
              <CustomMarkdown>{props.pageData.section2Heading}</CustomMarkdown>
            </div>
          ) : null}

          <div className={`${styles.testing_armor}`}>
            {props.pageData?.section2Armor.map((item, index) => (
              <div
                className={`${styles.testing_armor_item}  observe fade-in-up`}
                key={index}
              >
                <h4 className={`${styles.testing_armor_title}`}>
                  {item.title}
                </h4>

                <div className={`${styles.testing_armor_description}`}>
                  <CustomMarkdown>{item.description}</CustomMarkdown>
                </div>

                <div
                  className={`${styles.testing_armor_read}`}
                  onClick={() => handleReadMore(item)}
                >
                  Read More
                </div>

                {item.image?.data && (
                  <div className={`${styles.testing_armor_image}`}>
                    {item.image.data.map((imgData, imgIndex) => (
                      <Image
                        key={imgIndex}
                        src={
                          imgData.attributes.formats?.medium?.url ||
                          imgData.attributes.url
                        }
                        alt={
                          imgData.attributes.alternativeText ||
                          'Alpine Armoring'
                        }
                        width={250}
                        height={250}
                        quality={100}
                      />
                    ))}
                  </div>
                )}
                <div
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                  onClick={() =>
                    handleLightboxOpen(item.title, '', 'video', item.linkURL)
                  }
                >
                  <PlayIcon />
                </div>
              </div>
            ))}

            {showPopup && (
              <div
                className={`modal modal_vertical modal_flip ${showPopup ? 'modal_active' : ''} ${!selectedItem?.description ? 'modal_simple' : ''}`}
              >
                <div className={`modal_inner`} ref={popupRef}>
                  <div className={`modal_box`}>
                    <div className={`modal_description`}>
                      {selectedItem?.title ? (
                        <h3 className={`modal_title`}>{selectedItem.title}</h3>
                      ) : null}
                      {selectedItem?.description ? (
                        <CustomMarkdown>
                          {selectedItem.description}
                        </CustomMarkdown>
                      ) : null}
                    </div>

                    {selectedItem?.image?.data && (
                      <div
                        className={`modal_images ${selectedItem.image.data[0].attributes.url2 ? 'modal_images_flip' : ''} ${isFlipped ? 'flipActive' : ''}`}
                      >
                        {selectedItem.image.data.map((imgData, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={
                              imgData.attributes.formats?.medium?.url ||
                              imgData.attributes.url
                            }
                            alt={
                              imgData.attributes.alternativeText ||
                              'Alpine Armoring'
                            }
                            width={1000}
                            height={770}
                            quality={100}
                            style={{ borderRadius: '16px', padding: '10px' }}
                            className={`modal_images_front`}
                          />
                        ))}

                        {selectedItem.image.data[0].attributes.url2 ? (
                          <Image
                            src={selectedItem.image.data[0].attributes.url2}
                            alt={'Alpine Armoring'}
                            width={1000}
                            height={770}
                            quality={100}
                            style={{ borderRadius: '16px', padding: '10px' }}
                            className={`modal_images_back`}
                          />
                        ) : null}
                      </div>
                    )}
                  </div>

                  {selectedItem.image.data[0].attributes.url2 ? (
                    <div onClick={handleFlip}>
                      <ArrowIcon className={`modal_flipArrow`} />
                    </div>
                  ) : null}

                  <button
                    className={`modal_close`}
                    onClick={() => setShowPopup(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <g fill="currentColor">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          fill="#fff"
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section
          className={`${styles.testing_section1} ${styles.testing_container_small} container_small`}
          id="anchor3"
        >
          {props.pageData?.section3Title ? (
            <h2 className={`${styles.testing_title} block-reveal observe`}>
              <span
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section3Title,
                }}
              ></span>
            </h2>
          ) : null}

          {props.pageData?.section3Heading ? (
            <div
              className={`${styles.testing_section1_heading} ${styles.testing_heading} fade-in observe`}
            >
              <CustomMarkdown>{props.pageData.section3Heading}</CustomMarkdown>
            </div>
          ) : null}
          <MediaList props={videos} itemType="video" />
        </section>

        <section className={`container_small`}>
          {props.pageData?.section4Title ? (
            <div className={styles.section4Title}>
              <CustomMarkdown>{props.pageData.section4Title}</CustomMarkdown>
            </div>
          ) : null}

          {props.pageData?.section4Heading ? (
            <div className={styles.section4Heading}>
              <CustomMarkdown>{props.pageData.section4Heading}</CustomMarkdown>
            </div>
          ) : null}
        </section>
      </div>

      {ballisticFlip.image.data[0].attributes.url ? (
        <div
          className={`${styles.testing_flip} container_small`}
          onClick={() => handleReadMore(ballisticFlip)}
        >
          <h3 className={`${styles.testing_flip_title}`}>
            {lang.seeBallisticPostcard}
            <ArrowIcon />
          </h3>

          <Image
            src={ballisticFlip.image.data[0].attributes.url}
            alt="armored vehicles"
            width={500}
            height={500}
            sizes="(max-width: 767px) 50vw, 50vw"
          />
        </div>
      ) : null}

      {isLightboxPopupOpen ? (
        <LightboxCustom
          isLightboxPopupOpen={isLightboxPopupOpen}
          lightboxData={lightboxData}
          setLightboxPopupOpen={setLightboxPopupOpen}
        />
      ) : null}
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.ballisticTesting;

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

export default withLocaleRefetch(Testing, async (locale) => {
  const data = await getPageData({
    route: routes.ballisticTesting.collection,
    populate: 'deep',
    locale,
  });
  return data.data?.attributes || null;
});
