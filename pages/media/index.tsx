import { useEffect, useState } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import BlogList from 'components/global/news/News';
import styles from './Media.module.scss';
import TabSlider from 'components/global/tab-slider/TabSlider';
import VideoSingle from './videos/VideoSingle';
import Button from 'components/global/button/Button';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import TradeShowsSingle from './trade-shows/TradeShowsSingle';

function Media(props) {
  const banner = props?.pageData?.banner;
  const news = props?.pageData?.blogs?.data;
  const videos = props?.pageData?.videos?.data;
  const tradeShows = props?.pageData?.tradeShows?.data;

  // Tabs Scroll
  const tabSliderData = [
    {
      id: 0,
      titleNav: 'News',
    },
    {
      id: 1,
      titleNav: 'Videos',
    },
    {
      id: 2,
      titleNav: 'Trade Shows',
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
  const [imageSrcs, setGallery] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  const handleLightboxOpen = (
    title,
    location,
    contentType,
    url = null,
    gallery = null
  ) => {
    setSelectedTitle(title);
    setSelectedLocation(location);
    setContentType(contentType);
    if (contentType === 'video') {
      setVideoSrc(url);
    } else if (contentType === 'gallery') {
      setGallery(gallery);
    }
    setLightboxPopupOpen(true);
  };

  const lightboxData = {
    title: selectedTitle,
    location: selectedLocation,
    contentType: contentType,
    videoSrc: videoSrc,
    gallery: imageSrcs,
  };

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

  return (
    <>
      {banner ? <Banner props={banner} center shape="white" /> : null}

      <TabSlider
        className={`${styles.manufacturing_tabs} desktop-only`}
        props={tabSliderData}
        onTabChange={handleTabChange}
        anchor
        banner
      />

      {news?.length > 0 ? (
        <div className={`${styles.media_news}`} id="news">
          <BlogList props={news} button limit="3" plain title="News" />
        </div>
      ) : null}

      {videos?.length > 0 ? (
        <div className={`${styles.media_videos} container_small`} id="videos">
          <h2 className={`${styles.media_heading} observe fade-in-up`}>
            Videos
          </h2>

          <div className={`${styles.media_videos_list}`}>
            {videos.slice(0, 4).map((item, index) => (
              <VideoSingle
                props={item}
                key={index}
                onLightboxOpen={handleLightboxOpen}
                large
              />
            ))}
          </div>

          <div className={`${styles.media_button} observe fade-in`}>
            <Button
              href={`/media/videos`}
              className={`${styles.media_button_link} rounded primary`}
            >
              See All Videos
            </Button>
          </div>
        </div>
      ) : null}

      {tradeShows?.length > 0 ? (
        <div
          className={`${styles.media_tradeShows} container_small`}
          id="trade-shows"
        >
          <h2 className={`${styles.media_heading} observe fade-in-up`}>
            Trade Shows
          </h2>

          <div className={`${styles.media_tradeShows_list}`}>
            {tradeShows.slice(0, 6).map((item, index) => (
              <TradeShowsSingle
                key={index}
                props={item}
                onLightboxOpen={handleLightboxOpen}
              />
            ))}
          </div>

          <div className={`${styles.media_button} observe fade-in`}>
            <Button
              href={`/media/trade-shows`}
              className={`${styles.media_button_link} rounded primary`}
            >
              See All Trade Shows
            </Button>
          </div>
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
    route: 'media',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default Media;
