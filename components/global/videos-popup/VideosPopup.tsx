import React, { useState, useEffect, useRef } from 'react';
import styles from './VideosPopup.module.scss';
import Image from 'next/image';

const VideosPopup = () => {
  const [isVideoPopupOpen, setVideoPopupOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState({
    type: 'video',
    src: '/AlpineArmoringHP.mp4',
    width: 1920,
    height: 1080,
    alt: 'Alpine Armoring',
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isVideoPopupOpen && videoRef.current) {
      videoRef.current.load();
    }
  }, [isVideoPopupOpen]);

  useEffect(() => {
    if (isVideoPopupOpen) {
      document.body.style.marginRight =
        window.innerWidth - document.body.offsetWidth + 'px';
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      document.body.style.marginRight = '0';
    }
  }, [isVideoPopupOpen]);

  return (
    <div
      className={`
                ${styles.videoPopup}
                ${isVideoPopupOpen ? styles.videoPopup_open : ''}
            `}
      onClick={() => setVideoPopupOpen((prevState) => !prevState)}
    >
      <div className={`${styles.videoPopup_wrap}`}>
        <div className={`${styles.videoPopup_wrap_media}`}>
          {currentMedia.type === 'video' ? (
            <video
              ref={videoRef}
              muted={true}
              autoPlay={true}
              playsInline={true}
              loop={true}
              className={`${styles.videoPopup_wrap_media}`}
            >
              <source src={currentMedia.src} />
            </video>
          ) : (
            <Image
              src={currentMedia.src}
              alt={currentMedia.alt}
              width={currentMedia.width}
              height={currentMedia.height}
            />
          )}
        </div>
        <div className={`${styles.videoPopup_wrap_nav}`}>
          <div
            className={`${styles.videoPopup_wrap_nav_item}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMedia({
                type: 'video',
                src: '/video2.mp4',
                width: 1920,
                height: 1080,
                alt: 'Alpine Armoring',
              });
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
          >
            <video muted={true} autoPlay={true} playsInline={true} loop={true}>
              <source src="/video2.mp4" />
            </video>
          </div>
          <div
            className={`${styles.videoPopup_wrap_nav_item}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMedia({
                type: 'image',
                src: '/assets/shooting-ballistic-testing-alpine-armoring.gif',
                width: 527,
                height: 365,
                alt: 'Alpine Armoring 2',
              });
            }}
          >
            <Image
              src={`/assets/shooting-ballistic-testing-alpine-armoring.gif`}
              alt="Description of the image"
              width={530}
              height={405}
            />
          </div>
          <div
            className={`${styles.videoPopup_wrap_nav_item}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMedia({
                type: 'image',
                src: '/Banner-width.jpg',
                width: 1920,
                height: 885,
                alt: 'Alpine Armoring',
              });
            }}
          >
            <Image
              src={`/Banner-width.jpg`}
              alt="Description of the image"
              width={530}
              height={405}
            />
          </div>
          <div
            className={`${styles.videoPopup_wrap_nav_item}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMedia({
                type: 'image',
                src: '/assets/Explotion-purpler-Car.gif',
                width: 527,
                height: 365,
                alt: 'Alpine Armoring',
              });
            }}
          >
            <Image
              src={`/assets/Explotion-purpler-Car.gif`}
              alt="Description of the image"
              width={530}
              height={405}
            />
          </div>
          <div
            className={`${styles.videoPopup_wrap_nav_item}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMedia({
                type: 'image',
                src: '/assets/Explotion-Silver-Car.gif',
                width: 527,
                height: 365,
                alt: 'Alpine Armoring',
              });
            }}
          >
            <Image
              src={`/assets/Explotion-Silver-Car.gif`}
              alt="Description of the image"
              width={530}
              height={405}
            />
          </div>
        </div>
      </div>
      <div className={`${styles.videoPopup_text}`}>
        <span data-text="See Our Ballistic Testings"></span>
      </div>
    </div>
  );
};

export default VideosPopup;
