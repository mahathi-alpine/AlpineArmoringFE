import React, { useRef, useState } from 'react';
import useEffectOnce from 'hooks/useEffectOnce';
import styles from './HpBanner.module.scss';
import PauseIcon from 'components/icons/Pause';
import PlayIcon from 'components/icons/Play';

interface HPBannerProps {
  props: {
    subtitle: string;
    title: string;
  };
  error?: Error;
  languageCookie?: string;
}

const HpBanner = ({ props, languageCookie }: HPBannerProps) => {
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

  useEffectOnce(() => {
    function stepAnimateText(props, animation, delay) {
      props.forEach((text) => {
        const string = text.innerHTML;
        let html = '';
        for (let i = 0; i < string.length; i++) {
          html +=
            `<span class="` +
            animation +
            `" style="animation-delay: ` +
            i * delay +
            `s">${string[i]}</span>`;
        }
        text.innerHTML = html;
      });
    }

    if (languageCookie == 'en') {
      stepAnimateText(
        [...document.querySelectorAll('.animateLetter')],
        'fadeInDown',
        0.1
      );
    }
  });

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
        >
          <source src="/AlpineArmoringHP.mp4" />
        </video>

        <div className={`${styles.hp_banner_pause}`} onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </div>

        <div className={`${styles.hp_banner_content}`}>
          <div className={`${styles.hp_banner_content_left}`}>
            <h2
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
            </h2>

            <h1
              className={`${styles.hp_banner_title} observe animate fade-in-left`}
            >
              {props.title}
            </h1>
          </div>
          <div
            className={`${styles.hp_banner_content_right} observe animate fade-in delay-3`}
          >
            <p>
              <strong>Designed, Engineered and Manufactured</strong> like no
              other armored SUVs, Sedans and Trucks in the world
            </p>
          </div>
        </div>
      </div>

      <div className="shape-before"></div>
    </div>
  );
};

export default HpBanner;
