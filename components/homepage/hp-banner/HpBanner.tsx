import React from 'react';
import styles from './HpBanner.module.scss';
import Button from 'components/global/button/Button';
import { useEffect } from 'react';

interface HPBannerProps {
  props: any;
  error?: any;
}

const HpBanner = ({ props }: HPBannerProps) => {
  useEffect(() => {
    function stepAnimateText(props, animation, delay) {
      const textReveals = [...document.querySelectorAll('.animateLetter')];

      textReveals.forEach((text) => {
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
    stepAnimateText(
      document.querySelector('.animateLetter'),
      'fadeInDown',
      0.1
    );
  });

  return (
    <div className={`${styles.hp_banner}`}>
      <div className={`${styles.hp_banner_inner}`}>
        <video
          muted={true}
          autoPlay={true}
          playsInline={true}
          loop={true}
          className={`${styles.hp_banner_video}`}
        >
          <source src="/masserati.mp4" />
        </video>

        <div className={`${styles.hp_banner_content}`}>
          <h2
            className={`${styles.hp_banner_subtitle} animateLetter desktop-only`}
          >
            {props.subtitle}
          </h2>
          <h1
            className={`${styles.hp_banner_title} observe animate fade-in-left`}
          >
            {props.title}
          </h1>
          <div className="observe delay-8 animate fade-in-scale inline-block">
            <Button href="/inventory" className="transparent">
              View Inventory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HpBanner;
