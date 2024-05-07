import styles from './Banner.module.scss';
import { BannerProps } from 'types';
import React, { useEffect, useRef } from 'react';

import Image from 'next/image';

const TopBanner = ({ props, shape, center, small }: BannerProps) => {
  const bannerImage = props.media.data?.attributes;
  const bannerMimeType = props.media.data?.attributes.mime;
  const bannerTitle = props.title;
  const bannerDescription = props.description;
  const videoMP4 = props.mediaMP4?.data?.attributes;
  const videoRef = useRef<HTMLVideoElement>(null);

  function isSafari() {
    const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

    const isNotChrome =
      navigator.userAgent.toLowerCase().indexOf('chrome') === -1;

    const isNotFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') === -1;

    const isNotEdge = navigator.userAgent.toLowerCase().indexOf('edg') === -1;

    const isNotOpera = navigator.userAgent.toLowerCase().indexOf('opr') === -1;

    const isNotIE = navigator.userAgent.toLowerCase().indexOf('trident') === -1;

    return (
      isSafari &&
      isNotChrome &&
      isNotFirefox &&
      isNotEdge &&
      isNotOpera &&
      isNotIE
    );
  }

  useEffect(() => {
    if (isSafari()) {
      const videoElement = videoRef.current;
      if (videoElement) {
        const webmSource = videoElement.querySelector(
          'source[type="video/webm"]'
        );
        if (webmSource) {
          webmSource.setAttribute(
            'src',
            props.video.video_mp4.data.attributes.url
          );
          webmSource.setAttribute('type', 'video/mp4');
          videoElement.load();
        }
      }
    }
  }, []);

  let mediaElement;
  if (bannerImage && bannerMimeType?.split('/')[0] === 'image') {
    mediaElement = (
      <Image
        src={`${bannerImage?.formats?.xlarge?.url || bannerImage.url}`}
        alt={bannerImage?.alternativeText || 'Alpine Armoring'}
        width={bannerImage.formats?.xlarge?.width || bannerImage.width}
        height={bannerImage.formats?.xlarge?.height || bannerImage.height}
        className={`${styles.banner_media}`}
        priority
        // quality='100'
        sizes="100vw"
      />
    );
  } else if ((bannerImage && bannerMimeType?.startsWith('video')) || videoMP4) {
    mediaElement = (
      <video
        loop={true}
        autoPlay={true}
        muted={true}
        ref={videoRef}
        playsInline={true}
        className={`${styles.banner_media}`}
        preload="metadata"
      >
        {bannerImage ? (
          <source
            src={`${bannerImage.url}`}
            type={`${bannerImage.mime}`}
          ></source>
        ) : null}
        {videoMP4 ? (
          <source src={`${videoMP4.url}`} type={`${videoMP4.mime}`}></source>
        ) : null}
      </video>
    );
  }

  return (
    <div
      className={`
      ${styles.banner}
      ${small ? styles.banner_small : ''}
      ${center ? styles.banner_center : ''}
    `}
    >
      <div className={`${styles.banner_inner}`}>
        {mediaElement}

        <div className={`${styles.banner_content}`}>
          <div className={`${styles.banner_text} observe fade-in-scale`}>
            {bannerTitle ? (
              <h1
                className={`${styles.banner_title}`}
                dangerouslySetInnerHTML={{ __html: bannerTitle }}
              ></h1>
            ) : null}
            {bannerDescription ? (
              <h2
                className="observe fade-in"
                dangerouslySetInnerHTML={{ __html: bannerDescription }}
              ></h2>
            ) : null}
          </div>
        </div>
      </div>

      {shape ? (
        <div
          className={`${styles.banner_shape} shape-before shape-before-${shape}`}
        ></div>
      ) : null}
    </div>
  );
};

export default TopBanner;
