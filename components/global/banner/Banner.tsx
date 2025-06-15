import styles from './Banner.module.scss';
import { BannerProps } from 'types';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useLocale from 'hooks/useLocale';

const TopBanner = ({ props, shape, small }: BannerProps) => {
  const router = useRouter();
  const currentRoute = router.asPath;

  const bannerImage = props.media.data?.attributes;
  const bannerImageMobile = props.imageMobile?.data?.attributes;
  const bannerMimeType = props.media.data?.attributes.mime;
  const bannerTitle = props.title;
  const bannerSubitle = props.subtitle;
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoMP4 = props.mediaMP4?.data;
  const { lang } = useLocale();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    setImageKey((prev) => prev + 1);
  }, [bannerImage?.url]);

  // Special uppercase cases
  const specialUppercaseCases = ['bmw', 'cuda', 'gmc', 'mastiff', 'pointer'];

  function formatMake(make: string) {
    if (make.toLowerCase() === 'pit-bull') {
      return 'Pit-Bull';
    }

    return make
      .toString()
      .replace('-', ' ')
      .split(' ')
      .map((word) => {
        // Check if the word is in special uppercase cases (case-insensitive)
        if (specialUppercaseCases.includes(word.toLowerCase())) {
          return word.toUpperCase();
        }
        // Otherwise, do standard capitalization
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

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
          key={`banner-${imageKey}`}
          src={bannerImage.url}
          alt={bannerImage?.alternativeText || 'Alpine Armoring'}
          sizes={
            bannerImageMobile ? '(max-width: 767px) 0.1vw, 100vw' : '100vw'
          }
          className={`${styles.banner_media} ${bannerImageMobile ? styles.banner_media_desktop : ''}`}
          priority
          width={2200}
          height={500}
          style={{
            animation: imageKey > 0 ? 'fadeIn 0.4s ease-in-out' : 'none',
          }}
        />
        {bannerImageMobile && (
          <Image
            key={`bannerMobile-${imageKey}`}
            src={bannerImageMobile.url}
            alt={bannerImageMobile?.alternativeText || 'Alpine Armoring'}
            sizes="(max-width: 767px) 100vw, 1vw"
            width={375}
            height={250}
            className={`${styles.banner_media} ${styles.banner_media_mobile}`}
            priority
            style={{
              animation: imageKey > 0 ? 'fadeIn 0.4s ease-in-out' : 'none',
            }}
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

  // const [isClient, setIsClient] = useState(false)

  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  // Check if current language is not the default (en)
  const isNonDefaultLanguage = router.locale !== 'en';

  const [showSpecialBanner, setShowSpecialBanner] = useState(false);
  const [showRegularBanner, setShowRegularBanner] = useState(true);

  useEffect(() => {
    // Only use this logic for non-default languages
    if (isNonDefaultLanguage) {
      const shouldShowSpecial =
        currentRoute.startsWith(`/${lang.availableNowURL}`) ||
        currentRoute.startsWith(`${lang.vehiclesWeArmorURL}`);
      setShowSpecialBanner(shouldShowSpecial);

      const shouldShowRegular =
        !currentRoute.startsWith(`/${lang.availableNowURL}`) &&
        !currentRoute.startsWith(`${lang.vehiclesWeArmorURL}`);
      setShowRegularBanner(shouldShowRegular);
    } else {
      // For default language (en), use original logic
      setShowSpecialBanner(
        currentRoute.startsWith('/' + lang.availableNowURL) ||
          currentRoute.startsWith(lang.vehiclesWeArmorURL)
      );
      setShowRegularBanner(
        !currentRoute.startsWith('/' + lang.availableNowURL) &&
          !currentRoute.startsWith(lang.vehiclesWeArmorURL)
      );
    }
  }, [
    currentRoute,
    lang.availableNowURL,
    lang.vehiclesWeArmorURL,
    isNonDefaultLanguage,
  ]);

  return (
    <div
      className={`
      ${styles.banner}
      ${small ? styles.banner_small : ''}
      ${currentRoute.startsWith(lang.ballisticTestingURL) || currentRoute.startsWith('/ballistic-testing') ? styles.banner_full : ''}
    `}
    >
      <div className={`${styles.banner_inner}`}>
        {mediaElement}

        {/* {currentRoute.startsWith('/' + lang.availableNowURL) ||
        currentRoute.startsWith(lang.vehiclesWeArmorURL) ? ( */}
        {/* {isClient && (currentRoute.startsWith(`/${lang.availableNowURL}`) || currentRoute.startsWith(lang.vehiclesWeArmorURL)) && ( */}
        {/* {(currentRoute.startsWith(availableNowPath) || currentRoute.startsWith(vehiclesArmorPath)) && ( */}
        {showSpecialBanner && (
          <div className={`${styles.banner_content}`}>
            <div className={`${styles.banner_text}`}>
              {bannerTitle ? (
                <h1
                  className={`${router.query.make ? styles.banner_text_withMake : ''}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      router.query.type && router.query.make
                        ? `${bannerTitle}<strong>
                          ${formatMake(router.query.make.toString())}</strong>`
                        : router.query.make
                          ? `${lang.armored}
                          ${formatMake(router.query.make.toString())}
                        ${lang.forPreorder}`
                          : bannerTitle,
                  }}
                ></h1>
              ) : null}
              {bannerSubitle ? (
                <h2 dangerouslySetInnerHTML={{ __html: bannerSubitle }}></h2>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {shape ? (
        <div
          className={`${styles['banner_shape']} ${styles[`banner_shape_${shape}`]} shape-before shape-before-${shape}`}
        />
      ) : null}

      {bannerTitle && showRegularBanner && (
        <>
          <h1
            className={`
              ${styles.banner_heading} 
              c-title
              ${
                [
                  '/manufacturing',
                  '/ballistic-testing',
                  '/shipping-and-logistics',
                ].includes(router.pathname)
                  ? styles.banner_heading_margin
                  : ''
              }
              ${!isNonDefaultLanguage ? 'observe fade-in-scale' : ''}`}
            dangerouslySetInnerHTML={{ __html: bannerTitle }}
          ></h1>
          {bannerSubitle ? (
            <h2
              className={`${styles.banner_subheading} ${!isNonDefaultLanguage ? 'observe fade-in-scale' : ''}`}
              dangerouslySetInnerHTML={{ __html: bannerSubitle }}
            ></h2>
          ) : null}
        </>
      )}
    </div>
  );
};

export default TopBanner;
