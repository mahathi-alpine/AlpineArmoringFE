import { useEffect, useState, useCallback } from 'react';
import useLocale from 'hooks/useLocale';
import styles from './MediaList.module.scss';
import EmblaCarousel from 'embla-carousel';
import VideoSingle from './videos/VideoSingle';
import TradeShowsSingle from './trade-shows/TradeShowsSingle';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import { useRouter } from 'next/router';

function MediaList({ props, itemType }) {
  const router = useRouter();
  const { lang } = useLocale();
  const currentRoute = router.asPath;

  const categoryOrder = [
    'ballisticTests',
    'mediaAppearances',
    'coolVideos',
    'selectedVansAndTrucks',
    'selectedSUVsAndSedans',
  ];

  const getTranslatedCategory = (category) => {
    const translationMap = {
      'Ballistic Tests': lang.ballisticTests,
      'Media Appearances': lang.mediaAppearances,
      'Cool Videos': lang.coolVideos,
      'Selected Vans and Trucks': lang.selectedVansAndTrucks,
      'Selected SUVs and Sedans': lang.selectedSUVsAndSedans,
    };
    return translationMap[category] || category;
  };

  const categoryMap = new Map();
  props?.forEach((item) => {
    const category = item.attributes.videoCategory;
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category).push(item);
  });

  // Sort categories based on the predefined order
  const sortedCategories = Array.from(categoryMap.keys()).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    // If both categories are in the order list, compare their positions
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If one category is in the list and the other isn't, prioritize the one in the list
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither category is in the list, maintain alphabetical order
    return a.localeCompare(b);
  });

  // Slider setup
  const [emblaApis, setEmblaApis] = useState([]);
  const [prevBtnDisabledStates, setPrevBtnDisabledStates] = useState([]);
  const [nextBtnDisabledStates, setNextBtnDisabledStates] = useState([]);

  useEffect(() => {
    const emblaNodes = [].slice.call(document.querySelectorAll('.embla'));
    const sliderOptions = { dragFree: true };

    const emblaApis = emblaNodes.map((emblaNode) =>
      EmblaCarousel(emblaNode, sliderOptions)
    );

    setEmblaApis(emblaApis);

    const initialDisabledStatesPrev = emblaApis.map(
      (emblaApi) => !emblaApi.canScrollPrev()
    );
    setPrevBtnDisabledStates(initialDisabledStatesPrev);

    const initialDisabledStatesNext = emblaApis.map(
      (emblaApi) => !emblaApi.canScrollNext()
    );
    setNextBtnDisabledStates(initialDisabledStatesNext);

    emblaApis.forEach((emblaApi, index) => {
      const canScrollPrev = emblaApi.canScrollPrev();
      setPrevBtnDisabledStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = !canScrollPrev;
        return newStates;
      });

      emblaApi.on('scroll', () => {
        const canScrollPrev = emblaApi.canScrollPrev();
        setPrevBtnDisabledStates((prevStates) => {
          const newStates = [...prevStates];
          newStates[index] = !canScrollPrev;
          return newStates;
        });

        const canScrollNext = emblaApi.canScrollNext();
        setNextBtnDisabledStates((prevStates) => {
          const newStates = [...prevStates];
          newStates[index] = !canScrollNext;
          return newStates;
        });
      });
    });

    return () => {
      emblaApis.forEach((emblaApi) => emblaApi.destroy());
    };
  }, []);

  const onNextButtonClick = useCallback(
    (index) => {
      if (!emblaApis[index]) return;
      emblaApis[index].scrollNext();
    },
    [emblaApis]
  );

  const onPrevButtonClick = useCallback(
    (index) => {
      if (!emblaApis[index]) return;
      emblaApis[index].scrollPrev();
    },
    [emblaApis]
  );

  // Lightbox
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [contentType, setContentType] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [imageSrcs, setGallery] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  // Auto-open lightbox based on query parameter
  useEffect(() => {
    const { video } = router.query;

    if (video && props && itemType === 'video') {
      // Find the video with matching URLExternal
      const targetVideo = props.find(
        (item) => item.attributes.URLExternal === video
      );

      if (targetVideo) {
        handleLightboxOpen(
          targetVideo.attributes.title,
          targetVideo.attributes.location,
          'video',
          targetVideo.attributes.URLExternal,
          null,
          targetVideo.attributes.date,
          targetVideo.attributes.year
        );

        // // Remove the query parameter from URL without page reload
        // const { video: _, ...restQuery } = router.query;
        // router.replace(
        //   {
        //     pathname: router.pathname,
        //     query: restQuery,
        //   },
        //   undefined,
        //   { shallow: true }
        // );
      }
    }
  }, [router.query, props, itemType]);

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

  return (
    <>
      {sortedCategories.map((category, index) => {
        const itemsInCategory = categoryMap.get(category);

        const prevButtonDisabled = prevBtnDisabledStates[index]
          ? `${styles.mediaList_list_slider_arrow_disabled}`
          : '';
        const nextButtonDisabled = nextBtnDisabledStates[index]
          ? `${styles.mediaList_list_slider_arrow_disabled}`
          : '';

        return (
          <div className={`${styles.mediaList_list} container`} key={index}>
            {currentRoute !== '/ballistic-testing' ? (
              <h2 className={`${styles.mediaList_list_title} fade-in observe`}>
                {getTranslatedCategory(category)}
              </h2>
            ) : null}

            <div className={`${styles.mediaList_list_slider} embla`}>
              <div className={`${styles.mediaList_list_slider_inner}`}>
                {itemsInCategory.map((item, index) =>
                  itemType === 'video' ? (
                    <VideoSingle
                      props={item}
                      key={index}
                      onLightboxOpen={handleLightboxOpen}
                    />
                  ) : (
                    <TradeShowsSingle
                      key={index}
                      props={item}
                      onLightboxOpen={handleLightboxOpen}
                      list
                    />
                  )
                )}
              </div>

              <div className={`${styles.mediaList_list_slider_arrows}`}>
                <button
                  onClick={() => {
                    onPrevButtonClick(index);
                  }}
                  className={`${styles.mediaList_list_slider_arrow} ${prevButtonDisabled}`}
                >
                  <svg viewBox="0 0 532 532">
                    <path
                      fill="currentColor"
                      d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    onNextButtonClick(index);
                  }}
                  className={`${styles.mediaList_list_slider_arrow} ${styles.mediaList_list_slider_arrow_next} ${nextButtonDisabled}`}
                >
                  <svg viewBox="0 0 532 532">
                    <path
                      fill="currentColor"
                      d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {isLightboxPopupOpen ? (
              <LightboxCustom
                isLightboxPopupOpen={isLightboxPopupOpen}
                lightboxData={lightboxData}
                setLightboxPopupOpen={setLightboxPopupOpen}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default MediaList;
