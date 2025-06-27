import styles from './VideoScale.module.scss';
import React, { useEffect, useRef, useState } from 'react';

export function animateVideo(entry) {
  const { bottom } = entry.getBoundingClientRect();
  const video = entry.querySelector('.videoScaleVideo');
  let scale = 1 - (bottom - window.innerHeight) * 0.0005;

  scale = scale < 0.8 ? 0.8 : scale > 1 ? 1 : scale;
  video.style.transform = `scale(${scale})`;
}

const VideoScale = ({ videoWebm, videoMP4 }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lazyLoadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadVideo) {
            setShouldLoadVideo(true);
            lazyLoadObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px 0px 200px 0px',
        threshold: 0,
      }
    );

    lazyLoadObserver.observe(container);

    return () => {
      lazyLoadObserver.disconnect();
    };
  }, [shouldLoadVideo]);

  useEffect(() => {
    if (!shouldLoadVideo) return;

    const videoElement = videoRef.current;
    if (videoElement) {
      const handleEnded = () => {
        if (videoRef.current) {
          videoRef.current.play();
        }
      };

      const handleLoadedData = () => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      };

      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('loadeddata', handleLoadedData);

      return () => {
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [shouldLoadVideo]);

  return (
    <section
      ref={containerRef}
      className={`${styles.videoScale} observe videoScaleContainer`}
    >
      <div className={`${styles.videoScale_shim}`}></div>
      <div className={`${styles.videoScale_sticky}`}>
        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            className={`${styles.videoScale_video} videoScaleVideo`}
            muted={true}
            playsInline={true}
            loop={true}
            preload="metadata"
          >
            {videoWebm ? (
              <source src={`${videoWebm.url}`} type={`${videoWebm.mime}`} />
            ) : null}
            {videoMP4 ? (
              <source src={`${videoMP4.url}`} type={`${videoMP4.mime}`} />
            ) : null}
          </video>
        ) : (
          <div
            className={`${styles.videoScale_video} ${styles.videoScale_placeholder}`}
            style={{
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
            }}
          >
            Loading video...
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoScale;
