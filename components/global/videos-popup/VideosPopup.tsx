import React, { useState, useEffect, useRef } from 'react';
import styles from './VideosPopup.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';

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
    <div className={`${styles.videoPopup_wrap}`}>
      <div className={`center`}>
        <div className={`${styles.videoPopup_button} shake observe`}>
          <Button
            button={true}
            className="fill"
            dot
            icon
            onClick={() => {
              setVideoPopupOpen((prevState) => !prevState);
            }}
          >
            View some cool videos
          </Button>
        </div>
      </div>

      <div
        className={`
          ${styles.videoPopup}
          ${isVideoPopupOpen ? styles.videoPopup_open : ''}
        `}
      >
        <div
          className={`${styles.videoPopup_media} ${
            isHovering ? styles.videoPopup_media_hover : ''
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

          <div className={`${styles.videoPopup_media_content}`}>
            {hoveredTitle}
          </div>

          <div
            className={`${styles.videoPopup_close}`}
            onClick={() => {
              setVideoPopupOpen((prevState) => !prevState);
            }}
          ></div>
        </div>

        <div className={`${styles.videoPopup_nav}`}>
          {props.props.map((item) => {
            const mimeType = item.image.data.attributes.mime.split('/')[0];

            return (
              <div
                key={item.id}
                className={`${styles.videoPopup_nav_item}`}
                onMouseEnter={() => {
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
    </div>
  );
};

export default VideosPopup;
