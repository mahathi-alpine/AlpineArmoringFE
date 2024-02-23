import React, { useRef, useState } from 'react';
// import useEffectOnce from 'hooks/useEffectOnce';
import styles from './HpBanner.module.scss';
import PauseIcon from 'components/icons/Pause';
import PlayIcon from 'components/icons/Play';
import { HPBannerProps } from 'types';
import useSplitText from 'hooks/useSplitText';

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

  useSplitText();

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

  return (
    <div className={`${styles.hp_banner}`}>
      <div className={`${styles.hp_banner_inner}`}>
        <video
          ref={videoRef}
          muted={true}
          autoPlay={true}
          playsInline={true}
          loop={true}
          className={`${styles.hp_banner_video}`}
          // preload="metadata"
          // poster="/assets/hpBannerPoster.jpg"
        >
          <source src="/AlpineArmoringHP.webm" />
        </video>

        <div className={`${styles.hp_banner_pause}`} onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </div>

        <div className={`${styles.hp_banner_content}`}>
          <div className={`${styles.hp_banner_content_left}`}>
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

            {/* {props.subtitle ? (
              <h2
                className={`
                  ${styles.hp_banner_subtitle} observe splitLetters
                `}
                data-split-delay="15"
                data-split-duration="850"
              >
                {props.subtitle}
              </h2>
            ) : null} */}

            {props.title ? (
              <h1
                dangerouslySetInnerHTML={{
                  __html: props.title,
                }}
                className={`${styles.hp_banner_title}`}
              ></h1>
            ) : null}
            {/* {props.title ? (
              <h1
                className={`${styles.hp_banner_title} observe splitLetters`}
                data-split-delay="25"
                data-split-duration="500"
              >
                {props.title}
              </h1>
            ) : null} */}
          </div>

          {props.description ? (
            <p
              className={`${styles.hp_banner_content_right}`}
              dangerouslySetInnerHTML={{ __html: props.description }}
            ></p>
          ) : null}
        </div>
      </div>

      <div className={`${styles.hp_banner_shape} shape-before`}></div>
    </div>
  );
};

export default HpBanner;
