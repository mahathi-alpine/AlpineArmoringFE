import React, { useState, useEffect, useRef } from 'react';
import styles from './VideosPopup.module.scss';
import Image from 'next/image';

const VideosPopup = (props) => {
  const [isVideoPopupOpen, setVideoPopupOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredTitle, setHoveredTitle] = useState('');

  const initialMedia = props.props[0].image.data.attributes;

  const [currentMedia, setCurrentMedia] = useState({
    type: initialMedia.mime.split('/')[0],
    src: initialMedia.url,
    width: initialMedia.width,
    height: initialMedia.height,
    alt: initialMedia.alternativeText || '',
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
      onClick={() => {
        if (!isVideoPopupOpen) {
          setVideoPopupOpen((prevState) => !prevState);
        }
      }}
    >
      <div className={`${styles.videoPopup_wrap}`}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <clipPath
            id="marker"
            clipPathUnits="objectBoundingBox"
            transform="scale(0.0625, 0.0625)"
          >
            <path d="M0,0.8v9c0,0.4,0.3,1,0.8,1.3l6.5,4.4c0.4,0.3,1.1,0.3,1.5,0l6.5-4.4c0.4-0.3,0.8-0.9,0.8-1.3v-9C16,0.3,15.5,0,14.9,0H1.1 C0.5,0,0,0.3,0,0.8L0,0.8z"></path>
          </clipPath>
        </svg>

        <div
          className={`${styles.videoPopup_wrap_media} ${
            isHovering ? styles.videoPopup_wrap_media_hover : ''
          }`}
        >
          {currentMedia.type === 'video' ? (
            <video
              ref={videoRef}
              muted={true}
              autoPlay={true}
              playsInline={true}
              loop={true}
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

          <div className={`${styles.videoPopup_wrap_media_content}`}>
            {hoveredTitle}
          </div>

          <div
            className={`${styles.videoPopup_close}`}
            onClick={() => {
              setVideoPopupOpen((prevState) => !prevState);
            }}
          ></div>
        </div>

        <div className={`${styles.videoPopup_wrap_nav}`}>
          {props.props.map((item) => {
            const mimeType = item.image.data.attributes.mime.split('/')[0];

            return (
              <div
                key={item.id}
                className={`${styles.videoPopup_wrap_nav_item}`}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setHoveredTitle(item.title);
                  setCurrentMedia({
                    type: mimeType,
                    src: item.image.data.attributes.url,
                    width: item.image.data.attributes.width,
                    height: item.image.data.attributes.height,
                    alt: item.image.data.attributes.alternativeText || '',
                  });
                  if (videoRef.current && mimeType == 'video') {
                    videoRef.current.load();
                  }
                  setIsHovering(true);
                  setHoveredTitle(item.title);
                }}
                onMouseLeave={() => setIsHovering(false)}
              >
                {mimeType.includes('video') ? (
                  <video>
                    <source src={`${item.image.data.attributes.url}`} />
                  </video>
                ) : (
                  <Image
                    src={`${item.image.data.attributes.url}`}
                    alt={item.image.data.attributes.alternativeText || ''}
                    width={`${item.image.data.attributes.width}`}
                    height={`${item.image.data.attributes.height}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={`${styles.videoPopup_text}`}>
        <span data-text="View some cool videos"></span>
      </div>
    </div>
  );
};

export default VideosPopup;
