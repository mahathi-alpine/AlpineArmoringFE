import { useEffect, useState, useCallback } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import styles from './Videos.module.scss';
import EmblaCarousel from 'embla-carousel';
import VideoSingle from 'components/global/videos/VideoSingle';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';

function Videos(props) {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const videos = props?.videos;

  const groupedByCategory = videos?.reduce((acc, item) => {
    const category = item.attributes.category.data?.attributes.name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

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
  // const [contentType, setContentType] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  const handleLightboxOpen = (title, location, contentType, url = null) => {
    setSelectedTitle(title);
    setSelectedLocation(location);
    // setContentType(contentType);
    setVideoSrc(url);
    setLightboxPopupOpen(true);
  };

  const lightboxData = {
    title: selectedTitle,
    location: selectedLocation,
    contentType: 'video',
    videoSrc: videoSrc,
  };

  // Animations
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
      {banner ? <Banner props={banner} center shape="white" /> : null}
      {groupedByCategory &&
        Object.keys(groupedByCategory).map((category, index) => {
          const itemsInCategory = groupedByCategory[category];

          const prevButtonDisabled = prevBtnDisabledStates[index]
            ? `${styles.videos_list_slider_arrow_disabled}`
            : '';
          const nextButtonDisabled = nextBtnDisabledStates[index]
            ? `${styles.videos_list_slider_arrow_disabled}`
            : '';

          return (
            <div className={`${styles.videos_list} container`} key={index}>
              <h2 className={`${styles.videos_list_title}`}>{category}</h2>

              <div className={`${styles.videos_list_slider} embla`}>
                <div className={`${styles.videos_list_slider_inner}`}>
                  {itemsInCategory.map((item, index) => (
                    <VideoSingle
                      props={item}
                      key={index}
                      onVideoClick={handleLightboxOpen}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    onPrevButtonClick(index);
                  }}
                  className={`${styles.videos_list_slider_arrow} ${prevButtonDisabled}`}
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
                  className={`${styles.videos_list_slider_arrow} ${styles.videos_list_slider_arrow_next} ${nextButtonDisabled}`}
                >
                  <svg viewBox="0 0 532 532">
                    <path
                      fill="currentColor"
                      d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                    />
                  </svg>
                </button>
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
      ;
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'video-page',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  let videos = await getPageData({
    route: 'videos',
    order: true,
    populate: 'deep',
  });
  videos = videos.data || null;

  return {
    props: { pageData, videos },
  };
}

export default Videos;
