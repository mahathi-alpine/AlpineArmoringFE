import React, { useRef, useState, useEffect } from 'react';
import styles from './HpBanner.module.scss';
import dynamic from 'next/dynamic';
const PauseIcon = dynamic(() => import('components/icons/Pause'));
const PlayIcon = dynamic(() => import('components/icons/Play'));
import { HPBannerProps } from 'types';

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

  function getIOSVersion() {
    const userAgent = window.navigator.userAgent;

    if (/iP(hone|od|ad)/.test(userAgent)) {
      const versionMatch = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);

      if (versionMatch) {
        return [
          parseInt(versionMatch[1], 10),
          parseInt(versionMatch[2], 10),
          parseInt(String(versionMatch[3] || 0), 10),
        ];
      }
    }

    return null;
  }

  console.log(getIOSVersion());
  console.log('ste');
  console.log(getIOSVersion().join('.'));

  useEffect(() => {
    const safariVersion = getSafariVersion();
    const iosVersion = getIOSVersion();

    if (
      props.video?.video_mp4?.data &&
      ((isSafari() && parseInt(safariVersion) < 17) ||
        (parseInt(safariVersion) >= 17 && window.innerWidth > 768) ||
        (iosVersion && iosVersion.join('.') <= '16.7.2'))
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
