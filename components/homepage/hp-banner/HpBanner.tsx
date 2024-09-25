import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './HpBanner.module.scss';
import PlayIcon from 'components/icons/Play';
import PauseIcon from 'components/icons/Pause';
import { HPBannerProps } from 'types';

const HpBanner = ({ props }: HPBannerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const isIOS = useCallback(() => {
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
  }, []);

  const isSafari = useCallback(() => {
    const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    const isNotChrome =
      navigator.userAgent.toLowerCase().indexOf('chrome') === -1;
    const isNotFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') === -1;
    return isSafari && isNotChrome && isNotFirefox;
  }, []);

  const getSafariVersion = useCallback(() => {
    const userAgent = navigator.userAgent;
    const versionMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
    return versionMatch ? versionMatch[1] : null;
  }, []);

  const isChrome = useCallback(() => {
    const userAgent =
      typeof window !== 'undefined' ? navigator.userAgent : null;
    return userAgent ? Boolean(userAgent.match(/Chrome|CriOS/i)) : false;
  }, []);

  useEffect(() => {
    const isSafariCondition =
      isSafari() &&
      (parseInt(getSafariVersion() || '0') < 17 ||
        (parseInt(getSafariVersion() || '0') >= 17 &&
          window.innerWidth >= 768));

    const isChromeOnIOSCondition = isChrome() && isIOS();

    if (
      (props.video?.video_mp4?.data && isSafariCondition) ||
      isChromeOnIOSCondition
    ) {
      const videoElement = videoRef.current;
      if (videoElement) {
        const webmSource = videoElement.querySelector(
          'source[type="video/webm"]'
        ) as HTMLSourceElement | null;
        if (webmSource && props.video?.video_mp4?.data) {
          webmSource.setAttribute(
            'src',
            props.video.video_mp4.data.attributes.url
          );
          webmSource.setAttribute('type', 'video/mp4');
          videoElement.load();
        }
      }
    }
  }, [
    props.video?.video_mp4?.data,
    isChrome,
    isIOS,
    isSafari,
    getSafariVersion,
  ]);

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
  }, [togglePlayPause]);

  return (
    <div className={`${styles.hp_banner}`}>
      <div className={`${styles.hp_banner_inner}`}>
        {props.video?.video_webm.data || props.video?.video_mp4.data ? (
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
            {props.video.video_mp4.data && !props.video.video_webm.data ? (
              <source
                src={`${props.video.video_mp4.data.attributes.url}`}
                type={`${props.video.video_mp4.data.attributes.mime}`}
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
