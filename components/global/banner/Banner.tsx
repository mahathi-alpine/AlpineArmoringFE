import styles from './Banner.module.scss';
import { BannerProps } from 'types';
import React, { useRef, useEffect, useState } from 'react';
import { useIsMobile } from 'hooks/useIsMobile';
import { useRouter } from 'next/router';

import Image from 'next/image';

const TopBanner = ({ props, shape, center, small }: BannerProps) => {
  const router = useRouter(); // Initialize useRouter
  const currentRoute = router.pathname; // Get the current route
  const bannerImage = props.media.data?.attributes;
  const bannerMimeType = props.media.data?.attributes.mime;
  const bannerTitle = props.title;
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoMP4 = props.mediaMP4?.data;

  function isSafari() {
    const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

    const isNotChrome =
      navigator.userAgent.toLowerCase().indexOf('chrome') === -1;

    const isNotFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') === -1;

    return isSafari && isNotChrome && isNotFirefox;
  }

  function getSafariVersion() {
    const userAgent = navigator.userAgent;
    const versionMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
    if (versionMatch) {
      return versionMatch[1];
    }
    return null;
  }

  useEffect(() => {
    if (
      isSafari() &&
      videoMP4 &&
      (parseInt(getSafariVersion()) < 17 ||
        (parseInt(getSafariVersion()) >= 17 && window.innerWidth > 768))
    ) {
      const videoElement = videoRef.current;
      if (videoElement) {
        const webmSource = videoElement.querySelector(
          'source[type="video/webm"]'
        );
        if (webmSource) {
          webmSource.setAttribute('src', videoMP4.attributes.url);
          webmSource.setAttribute('type', 'video/mp4');
          videoElement.load();
        }
      }
    }
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleEnded = () => {
        videoRef.current.play();
      };

      videoElement.addEventListener('ended', handleEnded);

      return () => {
        videoElement.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getImageDimensions = () => {
    let width = bannerImage.formats?.thumbnail?.width || bannerImage.width;
    let height = bannerImage.formats?.thumbnail?.height || bannerImage.height;
    if (hasMounted && isMobile == false) {
      width = bannerImage.formats?.xlarge?.width || bannerImage.width;
      height = bannerImage.formats?.xlarge?.height || bannerImage.height;
    }
    return {
      width,
      height,
    };
  };

  let mediaElement;
  if (bannerImage && bannerMimeType?.split('/')[0] === 'image') {
    const { width, height } = getImageDimensions();

    mediaElement = (
      <Image
        src={`${bannerImage?.formats?.xlarge?.url || bannerImage.url}`}
        alt={bannerImage?.alternativeText || 'Alpine Armoring'}
        width={width}
        height={height}
        className={`${styles.banner_media}`}
        priority
        sizes="100vw"
      />
    );
  } else if ((bannerImage && bannerMimeType?.startsWith('video')) || videoMP4) {
    mediaElement = (
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        preload="auto"
        className={`${styles.banner_media}`}
      >
        {bannerImage ? (
          <source
            src={`${bannerImage.url}`}
            type={`${bannerImage.mime}`}
          ></source>
        ) : null}
        {videoMP4 && !bannerImage ? (
          <source
            src={`${videoMP4.attributes.url}`}
            type={`${videoMP4.attributes.mime}`}
          ></source>
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

        {currentRoute.startsWith('/available-now') ||
        currentRoute.startsWith('/vehicles-we-armor') ? (
          <div className={`${styles.banner_content}`}>
            <div className={`${styles.banner_text}`}>
              {bannerTitle ? (
                <h1
                  className="observe fade-in"
                  dangerouslySetInnerHTML={{ __html: bannerTitle }}
                ></h1>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {shape ? (
        <div
          className={`${styles['banner_shape']} ${styles[`banner_shape_${shape}`]} shape-before shape-before-${shape}`}
        />
      ) : null}

      {bannerTitle ? (
        <h1
          className={`
            ${styles.banner_heading} 
            ${
              [
                '/manufacturing',
                '/ballistic-testing',
                '/shipping-and-logistics',
              ].includes(currentRoute)
                ? styles.banner_heading_margin
                : ''
            }
            observe fade-in-scale`}
          dangerouslySetInnerHTML={{ __html: bannerTitle }}
        ></h1>
      ) : null}
    </div>
  );
};

export default TopBanner;
