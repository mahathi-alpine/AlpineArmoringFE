// import { useEffect, useState, useCallback } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import styles from './Videos.module.scss';
// import EmblaCarousel from 'embla-carousel';
import VideoSingle from 'components/global/videos/VideoSingle';
// import LightboxCustom from 'components/global/lightbox/LightboxCustom';

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

  const handleLightboxOpen = () => {
    console.log(groupedByCategory);
  };

  return (
    <>
      <Seo props={seoData} />
      {banner ? <Banner props={banner} center shape="white" /> : null}

      {Object.keys(groupedByCategory).map((category, index) => {
        const itemsInCategory = groupedByCategory[category];

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
            </div>
          </div>
        );
      })}
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
