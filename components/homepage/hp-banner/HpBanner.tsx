import React, { useRef, useState, useEffect } from 'react';
import styles from './HpBanner.module.scss';
import dynamic from 'next/dynamic';
const PauseIcon = dynamic(() => import('components/icons/Pause'));
const PlayIcon = dynamic(() => import('components/icons/Play'));
import { HPBannerProps } from 'types';

// const HpBanner = ({ props, languageCookie }: HPBannerProps) => {
const HpBanner = ({ props }: HPBannerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // const getiOSVersion = (): [number, number, number] | null => {
  //   if (/iP(hone|od|ad)/.test(navigator.platform)) {
  //     const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
  //     if (v) {
  //       return [
  //         parseInt(v[1], 10),
  //         parseInt(v[2], 10),
  //         parseInt(v[3] || '0', 10),
  //       ];
  //     }
  //   }
  //   return null;
  // };

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
    return null; // Safari version not found
  }

  // const version = getiOSVersion();
  // console.log(version);
  // if (version && version[0] === 13) {

  useEffect(() => {
    if (
      isSafari() &&
      parseInt(getSafariVersion()) <= 17 &&
      props.video?.video_mp4?.data
    ) {
      const videoElement = videoRef.current;
      if (videoElement) {
        const webmSource = videoElement.querySelector(
          'source[type="video/webm"]'
        );
        if (webmSource) {
          webmSource.setAttribute(
            'src',
            props.video?.video_mp4?.data.attributes.url
          );
          webmSource.setAttribute('type', 'video/mp4');
          videoElement.load();
        }
      }
    }
  }, []);

  // useEffectOnce(() => {
  //   function stepAnimateText(props, animation, delay) {
  //     props.forEach((text) => {
  //       const string = text.innerHTML;
  //       let html = '';
  //       for (let i = 0; i < string.length; i++) {
  //         html +=
  //           `<span class="` +
  //           animation +
  //           `" style="animation-delay: ` +
  //           i * delay +
  //           `s">${string[i]}</span>`;
  //       }
  //       text.innerHTML = html;
  //     });
  //   }

  //   if (languageCookie == 'en') {
  //     stepAnimateText(
  //       [...document.querySelectorAll('.animateLetter')],
  //       'fadeInDown',
  //       0.1
  //     );
  //   }
  // });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleEnded = () => {
        togglePlayPause();
      };

      videoElement.addEventListener('ended', handleEnded);

      return () => {
        videoElement.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  return (
    <div className={`${styles.hp_banner}`}>
      <div className={`${styles.hp_banner_inner}`}>
        {props.video?.video_mp4.data || props.video?.video_webm.data ? (
          <video
            ref={videoRef}
            muted
            autoPlay
            playsInline
            preload="auto"
            className={`${styles.hp_banner_video}`}
          >
            {props.video.video_webm.data ? (
              <source
                src={`${props.video.video_webm.data.attributes.url}`}
                type={`${props.video.video_webm.data.attributes.mime}`}
              ></source>
            ) : null}
            {props.video.video_mp4.data ? (
              <source
                src={`${props.video.video_mp4.data.attributes.url}`}
                type={`${props.video.video_mp4.data.attributes.mime}`}
                media="(min-width:768px)"
              ></source>
            ) : null}
          </video>
        ) : null}

        <div className={`${styles.hp_banner_pause}`} onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </div>

        <div className={`${styles.hp_banner_content}`}>
          {props.title ? (
            <h1
              dangerouslySetInnerHTML={{
                __html: props.title,
              }}
              className={`${styles.hp_banner_title}`}
            ></h1>
          ) : null}

          {/* <h2
            className={`
              ${styles.hp_banner_subtitle} animateLetter
              ${
                languageCookie !== 'en'
                  ? styles.hp_banner_subtitle_noAnimation
                  : ''
              }
            `}
          >
            {props.subtitle}
          </h2> */}

          {props.description ? (
            <h2
              className={`${styles.hp_banner_description}`}
              dangerouslySetInnerHTML={{ __html: props.description }}
            ></h2>
          ) : null}
        </div>
      </div>

      <div className={`${styles.hp_banner_shape} shape-before`}></div>
    </div>
  );
};

export default HpBanner;
