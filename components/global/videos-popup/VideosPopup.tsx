// import React, { useState } from 'react';
import styles from './VideosPopup.module.scss';
// import Image from 'next/image';
import Button from 'components/global/button/Button';
import PlayIcon from 'components/icons/Play';

import NextJsImage from '../lightbox/NextJsImage';
import NextJsImageThumbs from '../lightbox/NextJsImageThumbs';
import useLightbox from '../lightbox/useLightbox';
// import { Lightbox } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Video from 'yet-another-react-lightbox/plugins/video';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';

const VideosPopup = (props) => {
  // const [open, setOpen] = useState(false);
  const { openLightbox, renderLightbox } = useLightbox();

  const slidesData = props.props.map((item) => {
    const type = item.image.data?.attributes.mime.split('/')[0];
    const src = item.image.data?.attributes.url;
    const width = item.image.data?.attributes.width;
    const height = item.image.data?.attributes.height;
    const alt = item.image.data?.attributes.alternativeText;
    const title = item.title;
    const description = item.description;
    const poster = item.image.data?.attributes.previewUrl;

    if (type === 'video') {
      return {
        type: 'video',
        autoPlay: true,
        controls: false,
        muted: true,
        loop: true,
        title: title,
        description: description,
        poster: poster,
        sources: [
          {
            src: src,
            type: item.image.data.attributes.mime,
          },
        ],
      };
    } else {
      return {
        type: 'image',
        src: src,
        title: title,
        description: description,
        alt: alt,
        width: width,
        height: height,
      };
    }
  });

  // const [isVideoPopupOpen, setVideoPopupOpen] = useState(false);
  // const [isHovering, setIsHovering] = useState(false);
  // const [hoveredTitle, setHoveredTitle] = useState('');

  // const initialMedia = props.props[0].image.data.attributes;

  // const [currentMedia, setCurrentMedia] = useState({
  //   type: initialMedia.mime.split('/')[0],
  //   src: initialMedia.url,
  //   width: initialMedia.width,
  //   height: initialMedia.height,
  //   alt: initialMedia.alternativeText || '',
  // });
  // const videoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   if (!isVideoPopupOpen && videoRef.current) {
  //     videoRef.current.load();
  //   }
  // }, [isVideoPopupOpen]);

  // useEffect(() => {
  //   if (isVideoPopupOpen) {
  //     document.body.style.marginRight =
  //       window.innerWidth - document.body.offsetWidth + 'px';
  //     document.body.classList.add('no-scroll');
  //   } else {
  //     document.body.classList.remove('no-scroll');
  //     document.body.style.marginRight = '0';
  //   }
  // }, [isVideoPopupOpen]);

  return (
    <div className={`${styles.videoPopup_wrap}`}>
      <div className={`center`}>
        <div className={`${styles.videoPopup_button} observe fade-in-up`}>
          <Button
            button={true}
            className="attention"
            attention
            onClick={openLightbox}
          >
            View some cool videos
          </Button>
          <PlayIcon />
        </div>
      </div>

      {renderLightbox({
        slides: slidesData,
        plugins: [Video, Thumbnails, Captions],
        thumbnails: {
          padding: 0,
          gap: 4,
          imageFit: 'cover',
          borderColor: '#737373',
          borderRadius: 8,
        },
        render: { slide: NextJsImage, thumbnail: NextJsImageThumbs },
      })}
      {/* <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slidesData}
        plugins={[Thumbnails, Video, Captions]}
        thumbnails={{
          padding: 0,
          gap: 4,
          imageFit: 'cover',
          borderColor: '#737373',
          borderRadius: 8,
        }}
      /> */}

      {/* <div
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
            <p>{hoveredTitle}</p>
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
      </div> */}
    </div>
  );
};

export default VideosPopup;
