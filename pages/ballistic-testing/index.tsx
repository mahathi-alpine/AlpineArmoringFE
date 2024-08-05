import styles from './Testing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect, useState, useRef } from 'react';
import Banner from 'components/global/banner/Banner';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';
import TabSlider from 'components/global/tab-slider/TabSlider';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import PlayIcon from 'components/icons/Play';
import { useIsMobile } from 'hooks/useIsMobile';
import MediaList from 'pages/media/MediaList';
const Gallery = dynamic(
  () => import('components/global/carousel/CarouselCurved')
);

function Testing(props) {
  const convertMarkdown = useMarkdownToHtml();
  const title = props?.pageData?.mainTitle;
  const heading = props?.pageData?.heading;
  const videos = props?.pageData?.section3Video?.data;
  const certificate1 = props?.pageData?.certificate1?.data?.attributes?.url;
  const certificate2 = props?.pageData?.certificate2?.data?.attributes?.url;
  const isMobile = useIsMobile();

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
    {
      id: 3,
      titleNav: 'Vehicle Dynamic Testing',
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
          <Banner props={props.pageData?.banner} center shape="dark" />
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
                __html: props.pageData.section1Heading,
              }}
            ></p>
          ) : null}
          {props.pageData?.section1Text ? (
            <div
              className={`${styles.testing_section1_text1} ${styles.testing_text} fade-in observe`}
              dangerouslySetInnerHTML={{
                __html: convertMarkdown(props.pageData.section1Text),
              }}
            ></div>
          ) : null}
          <div className={styles.galleryContainer}>
            <div className={styles.gallerySection}>
              {props?.pageData?.titleGallery1 && (
                <h2 className={styles.title}>
                  {props?.pageData?.titleGallery1}
                </h2>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {certificate1 ? (
                  <Link
                    href={certificate1}
                    target="_blank"
                    style={{ maxWidth: '200px' }}
                  >
                    {props.pageData?.section1Gallery1.data ? (
                      <div
                        className={styles.imageWrapper}
                        style={{ maxWidth: '100%' }}
                      >
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
                  <div
                    className={`${styles.testing_image} observe fade-in`}
                    style={{
                      margin: '0 0 0 40px',
                      width: isMobile ? '100%' : 'auto',
                    }}
                  >
                    <div
                      className={`${styles.testing_image} observe fade-in`}
                      style={{ margin: '0 0 0 0', position: 'relative' }}
                    >
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
                          width={isMobile ? 380 : 300}
                          height={isMobile ? 200 : 200}
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {props.pageData?.section1Gallery22.data ? (
                  <div
                    className={`${styles.testing_image} observe fade-in`}
                    style={{
                      margin: '0 0 0 40px',
                      width: isMobile ? '100%' : 'auto',
                    }}
                  >
                    <div
                      className={`${styles.testing_image} observe fade-in`}
                      style={{ margin: '0 0 0 0', position: 'relative' }}
                    >
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
                          width={isMobile ? 380 : 300}
                          height={isMobile ? 200 : 200}
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
                  </div>
                ) : null}
                {certificate2 ? (
                  <Link
                    href={certificate2}
                    target="_blank"
                    style={{ maxWidth: '200px', margin: '0 0 0 40px' }}
                  >
                    {props.pageData?.section1Gallery2.data ? (
                      <div
                        className={styles.imageWrapper}
                        style={{ maxWidth: '100%' }}
                      >
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
                __html: props.pageData.section2Heading,
              }}
            ></p>
          ) : null}

          <div className={`${styles.testing_armor} container`}>
            {props.pageData?.section2Armor.map((item, index) => (
              <div
                className={`${styles.testing_armor_item}  observe fade-in-up`}
                key={index}
              >
                <h4 className={`${styles.testing_armor_title}`}>
                  {item.title}
                </h4>
                <p className={`${styles.testing_armor_description}`}>
                  {item.description}
                </p>
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
                ref={popupRef}
                className={`modal ${showPopup ? 'modal_active' : ''}`}
              >
                <div className={`modal_inner`}>
                  <h3 className={`modal_title`}>{selectedItem.title}</h3>
                  <div className={`modal_box`}>
                    <p className={`modal_description`}>
                      {selectedItem.description}
                    </p>
                    {selectedItem?.image?.data && (
                      <div className={`modal_images`}>
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
                            width={400}
                            height={400}
                            quality={100}
                          />
                        ))}
                      </div>
                    )}
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
                __html: props.pageData.section3Heading,
              }}
            ></p>
          ) : null}
          <MediaList props={videos} itemType="video" />
        </section>
        <section
          className={`${styles.testing_section1} ${styles.testing_container_small} container_small`}
          id="vehicle-dynamic-testing"
        >
          {props.pageData?.section4Title ? (
            <h2 className={`${styles.testing_title} block-reveal observe`}>
              <span
                dangerouslySetInnerHTML={{
                  __html: props.pageData.section4Title,
                }}
              ></span>
            </h2>
          ) : null}

          {props.pageData?.section4Heading ? (
            <p
              className={`${styles.testing_section1_heading} ${styles.testing_heading} fade-in observe`}
              dangerouslySetInnerHTML={{
                __html: props.pageData.section4Heading,
              }}
            ></p>
          ) : null}
          <div className={`${styles.testing_box}`}>
            {props.pageData?.section4Text ? (
              <div
                className={`${styles.testing_section1_text1} ${styles.testing_text} fade-in observe`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section4Text),
                }}
              ></div>
            ) : null}

            {props.pageData?.section4Image.data ? (
              <div className={`${styles.testing_image} observe fade-in`}>
                {props.pageData.section4Image.data.attributes.mime.startsWith(
                  'image/'
                ) ? (
                  <Image
                    src={`${
                      props.pageData.section4Image.data.attributes.formats
                        .medium?.url ||
                      props.pageData.section4Image.data.attributes.url
                    }`}
                    alt={
                      props.pageData.section4Image.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={620}
                    height={430}
                  />
                ) : props.pageData.section4Image.data.attributes.mime.startsWith(
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
                        src={`${props.pageData.section4Image.data.attributes?.url}`}
                        type={props.pageData.section4Image.data.attributes.mime}
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className={`${styles.testing_box}`}>
            {props.pageData?.section4Text2 ? (
              <div
                className={`${styles.testing_section1_text1} ${styles.testing_text} fade-in observe`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(props.pageData.section4Text2),
                }}
              ></div>
            ) : null}
            {props.pageData?.section4Image2.data ? (
              <div className={`${styles.testing_image} observe fade-in`}>
                {props.pageData.section4Image2.data.attributes.mime.startsWith(
                  'image/'
                ) ? (
                  <Image
                    src={`${
                      props.pageData.section4Image2.data.attributes.formats
                        .medium?.url ||
                      props.pageData.section4Image2.data.attributes.url
                    }`}
                    alt={
                      props.pageData.section4Image2.data.attributes
                        .alternativeText || 'Alpine Armoring'
                    }
                    width={620}
                    height={430}
                  />
                ) : props.pageData.section4Image2.data.attributes.mime.startsWith(
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
                        src={`${props.pageData.section4Image2.data.attributes?.url}`}
                        type={
                          props.pageData.section4Image2.data.attributes.mime
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
        {props.pageData?.section4Gallery.data ? (
          <div className={`${styles.slug_gallery}`}>
            <Gallery props={props.pageData?.section4Gallery.data} squared />
          </div>
        ) : null}
      </div>
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
