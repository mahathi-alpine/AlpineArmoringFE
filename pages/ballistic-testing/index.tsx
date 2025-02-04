import styles from './Testing.module.scss';
import { getPageData } from 'hooks/api';
import { useEffect, useState, useRef } from 'react';
import Banner from 'components/global/banner/Banner';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';
import TabSlider from 'components/global/tab-slider/TabSlider';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import Image from 'next/image';
import Link from 'next/link';
import PlayIcon from 'components/icons/Play';
import MediaList from 'pages/media/MediaList';
import { useOutsideClick } from 'hooks/useOutsideClick';
import ArrowIcon from 'components/icons/Arrow';

function Testing(props) {
  const convertMarkdown = useMarkdownToHtml();
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
      titleNav: 'Ballistic Certifications',
    },
    {
      id: 1,
      titleNav: 'Material Testing',
    },
    {
      id: 2,
      titleNav: 'Live Fire Testing',
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

        <TabSlider
          className={`${styles.testing_tabs} desktop-only`}
          props={tabSliderData}
          onTabChange={handleTabChange}
          anchor
        />

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
          id="ballistic-certifications"
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
            <p
              className={`${styles.testing_section1_heading} ${styles.testing_heading} fade-in observe`}
              dangerouslySetInnerHTML={{
                __html: convertMarkdown(props.pageData.section1Heading),
              }}
            ></p>
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
          id="material-testing"
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
            <p
              className={`${styles.testing_section1_heading} ${styles.testing_heading} fade-in observe`}
              dangerouslySetInnerHTML={{
                __html: convertMarkdown(props.pageData.section2Heading),
              }}
            ></p>
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
                <p
                  className={`${styles.testing_armor_description}`}
                  dangerouslySetInnerHTML={{
                    __html: convertMarkdown(item.description),
                  }}
                ></p>
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
                className={`modal modal_vertical ${showPopup ? 'modal_active' : ''} ${!selectedItem?.description ? 'modal_simple' : ''}`}
              >
                <div className={`modal_inner`} ref={popupRef}>
                  <div className={`modal_box`}>
                    <div className={`modal_description`}>
                      {selectedItem?.title ? (
                        <h3 className={`modal_title`}>{selectedItem.title}</h3>
                      ) : null}
                      {selectedItem?.description ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: convertMarkdown(selectedItem.description),
                          }}
                        ></p>
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
          id="live-fire-testing"
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
            <p
              className={`${styles.testing_section1_heading} ${styles.testing_heading} fade-in observe`}
              dangerouslySetInnerHTML={{
                __html: convertMarkdown(props.pageData.section3Heading),
              }}
            ></p>
          ) : null}
          <MediaList props={videos} itemType="video" />
        </section>

        <section className={`container_small`}>
          {props.pageData?.section4Title ? (
            <h3 className={styles.section4Title}>
              <span
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section4Title),
                }}
              ></span>
            </h3>
          ) : null}

          {props.pageData?.section4Heading ? (
            <h3 className={styles.section4Heading}>
              <span
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section4Heading),
                }}
              ></span>
            </h3>
          ) : null}
        </section>
      </div>

      {ballisticFlip.image.data[0].attributes.url ? (
        <div
          className={`${styles.testing_flip} container_small`}
          onClick={() => handleReadMore(ballisticFlip)}
        >
          <h3 className={`${styles.testing_flip_title}`}>
            See Ballistic Postcard
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

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'ballistic-testing',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default Testing;
