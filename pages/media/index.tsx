import { useState } from 'react';
import { getPageData } from 'hooks/api';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import Banner from 'components/global/banner/Banner';
import routes from 'routes';
import styles from './Media.module.scss';
import VideoSingle from './videos/VideoSingle';
import Button from 'components/global/button/Button';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import TradeShowsSingle from './trade-shows/TradeShowsSingle';
import useLocale from 'hooks/useLocale';

function Media(props) {
  const { lang } = useLocale();

  const banner = props?.pageData?.banner;
  const videos = props?.pageData?.videos?.data;
  const tradeShows = props?.pageData?.tradeShows?.data;

  // Lightbox
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [contentType, setContentType] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [imageSrcs, setGallery] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  const handleLightboxOpen = (
    title,
    location,
    contentType,
    url = null,
    gallery = null,
    date = null,
    year = null
  ) => {
    setSelectedTitle(title);
    setSelectedLocation(location);
    setContentType(contentType);
    if (contentType === 'video') {
      setVideoSrc(url);
    } else if (contentType === 'content') {
      setGallery(gallery);
    }
    setSelectedDate(date);
    setSelectedYear(year);
    setLightboxPopupOpen(true);
  };

  const lightboxData = {
    title: selectedTitle,
    location: selectedLocation,
    contentType: contentType,
    videoSrc: videoSrc,
    gallery: imageSrcs,
    date: selectedDate,
    year: selectedYear,
  };

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  return (
    <>
      {banner ? <Banner props={banner} shape="white" /> : null}

      {videos?.length > 0 ? (
        <div className={`${styles.media_videos} container_small`} id="videos">
          <h2 className={`${styles.media_heading} observe fade-in-up`}>
            {lang.videos}
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
              href={`${lang.mediaURL}${lang.videosURL}`}
              className={`${styles.media_button_link} rounded primary`}
            >
              {lang.seeAllVideos}
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
            {lang.tradeShows}
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
              href={`${lang.mediaURL}${lang.tradeShowsURL}`}
              className={`${styles.media_button_link} rounded primary`}
            >
              {lang.seeAllTradeShows}
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

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.media;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData.data?.attributes || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, seoData, locale },
  };
}

export default withLocaleRefetch(
  Media,
  {
    pageData: async (locale) => {
      const data = await getPageData({
        route: routes.media.collection,
        populate: 'deep',
        locale,
      });
      return data.data?.attributes || null;
    },
  },
  {
    routeName: 'media',
  }
);
