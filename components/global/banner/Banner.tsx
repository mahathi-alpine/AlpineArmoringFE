import styles from './Banner.module.scss';
import { BannerProps } from 'types';
import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const TopBanner = ({ props, shape, small }: BannerProps) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const bannerImage = props.media.data?.attributes;
  const bannerImageMobile = props.imageMobile?.data?.attributes;
  const bannerMimeType = props.media.data?.attributes.mime;
  const bannerTitle = props.title;
  const bannerSubitle = props.subtitle;
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoMP4 = props.mediaMP4?.data;

  function isIOS() {
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
  }

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
    return versionMatch ? versionMatch[1] : null;
  }

  function isChrome() {
    const userAgent =
      typeof window !== 'undefined' ? navigator.userAgent : null;
    return userAgent ? Boolean(userAgent.match(/Chrome|CriOS/i)) : false;
  }

  useEffect(() => {
    const isSafariCondition =
      isSafari() &&
      (parseInt(getSafariVersion() || '0') < 17 ||
        (parseInt(getSafariVersion() || '0') >= 17 &&
          window.innerWidth >= 768));

    const isChromeOnIOSCondition = isChrome() && isIOS();

    if (videoMP4?.attributes && (isSafariCondition || isChromeOnIOSCondition)) {
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
  }, [videoMP4?.attributes]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleEnded = () => {
        videoElement.play();
      };

      videoElement.addEventListener('ended', handleEnded);

      return () => {
        videoElement.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  let mediaElement;
  if (bannerImage && bannerMimeType?.split('/')[0] === 'image') {
    mediaElement = (
      <>
        <Image
          src={bannerImage.url}
          alt={bannerImage?.alternativeText || 'Alpine Armoring'}
          sizes={bannerImageMobile ? '(max-width: 767px) 1vw, 100vw' : '100vw'}
          className={`${styles.banner_media} ${bannerImageMobile ? styles.banner_media_desktop : ''}`}
          priority
          fill
          quality={100}
        />
        {bannerImageMobile && (
          <Image
            src={bannerImageMobile.url}
            alt={bannerImageMobile?.alternativeText || 'Alpine Armoring'}
            sizes="(max-width: 767px) 100vw, 1vw"
            fill
            className={`${styles.banner_media} ${styles.banner_media_mobile}`}
            priority
            quality={100}
          />
        )}
      </>
    );
  } else if (bannerMimeType?.startsWith('video') || videoMP4) {
    mediaElement = (
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        preload="auto"
        className={`${styles.banner_media}`}
      >
        {bannerMimeType == 'video/webm' ? (
          <source src={`${bannerImage.url}`} type={`${bannerImage.mime}`} />
        ) : null}
        {videoMP4?.attributes && bannerMimeType !== 'video/webm' ? (
          <source
            src={`${videoMP4?.attributes.url}`}
            type={`${videoMP4?.attributes.mime}`}
          />
        ) : null}
        {!videoMP4?.attributes && bannerMimeType !== 'video/webm' ? (
          <source src={`${bannerImage?.url}`} type={`${bannerImage?.mime}`} />
        ) : null}
      </video>
    );
  }

  return (
    <div
      className={`
      ${styles.banner}
      ${small ? styles.banner_small : ''}
      ${currentRoute.startsWith('/ballistic-testing') ? styles.banner_full : ''}
    `}
    >
      <div className={`${styles.banner_inner}`}>
        {mediaElement}

        {currentRoute.startsWith('/available-now') ||
        currentRoute.startsWith('/vehicles-we-armor') ? (
          <div className={`${styles.banner_content}`}>
            <div className={`${styles.banner_text}`}>
              {bannerTitle ? (
                <h1 dangerouslySetInnerHTML={{ __html: bannerTitle }}></h1>
              ) : null}
              {bannerSubitle ? (
                <h2 dangerouslySetInnerHTML={{ __html: bannerSubitle }}></h2>
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

      {bannerTitle &&
      !currentRoute.startsWith('/available-now') &&
      !currentRoute.startsWith('/vehicles-we-armor') ? (
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
