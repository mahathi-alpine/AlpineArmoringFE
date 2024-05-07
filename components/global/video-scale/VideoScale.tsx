import styles from './VideoScale.module.scss';
import React, { useEffect, useRef } from 'react';

export function animateVideo(entry) {
  const { bottom } = entry.getBoundingClientRect();
  const video = entry.querySelector('.videoScaleVideo');
  let scale = 1 - (bottom - window.innerHeight) * 0.0005;

  scale = scale < 0.2 ? 0.2 : scale > 1 ? 1 : scale;
  video.style.transform = `scale(${scale})`;

  // Text transformation
  let textTrans = bottom - window.innerHeight;
  const headerLeft = entry.querySelector('.videoScale_header_left');
  const headerRight = entry.querySelector('.videoScale_header_right');

  textTrans = textTrans < 0 ? 0 : textTrans;
  headerLeft.style.transform = `translateX(${-textTrans}px)`;
  headerRight.style.transform = `translateX(${textTrans}px)`;
}

const VideoScale = ({ videoWebm, videoMP4, text1 = '', text2 = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // function isSafari() {
  //   const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

  //   const isNotChrome =
  //     navigator.userAgent.toLowerCase().indexOf('chrome') === -1;

  //   const isNotFirefox =
  //     navigator.userAgent.toLowerCase().indexOf('firefox') === -1;

  //   return isSafari && isNotChrome && isNotFirefox;
  // }

  // useEffect(() => {
  //   if (isSafari() && videoMP4) {
  //     const videoElement = videoRef.current;
  //     if (videoElement) {
  //       const webmSource = videoElement.querySelector(
  //         'source[type="video/webm"]'
  //       );
  //       if (webmSource) {
  //         webmSource.setAttribute('src', videoMP4.url);
  //         webmSource.setAttribute('type', 'video/mp4');
  //         videoElement.load();
  //       }
  //     }
  //   }
  // }, []);

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

  return (
    <section className={`${styles.videoScale} observe videoScaleContainer`}>
      <div className={`${styles.videoScale_shim}`}></div>
      <div className={`${styles.videoScale_sticky}`}>
        <video
          ref={videoRef}
          className={`${styles.videoScale_video} videoScaleVideo`}
          // loop={true}
          autoPlay={true}
          muted={true}
          playsInline={true}
          preload="metadata"
        >
          {videoWebm ? (
            <source
              src={`${videoWebm.url}`}
              type={`${videoWebm.mime}`}
            ></source>
          ) : null}
          {videoMP4 ? (
            <source src={`${videoMP4.url}`} type={`${videoMP4.mime}`}></source>
          ) : null}
        </video>

        <div className={`${styles.videoScale_overlay}`}>
          <h2 className="videoScale_header_left">{text1}</h2>
          <h2 className="videoScale_header_right">{text2}</h2>
        </div>
      </div>
    </section>
  );
};

export default VideoScale;
