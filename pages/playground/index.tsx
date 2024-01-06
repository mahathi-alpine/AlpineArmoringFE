import React from 'react';
import { useEffect } from 'react';

import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';
import TextTransform, {
  textTransformAnimate,
} from 'components/global/text-transform/TextTransform';

function Playground() {
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);

            // VideoScale
            if (entry.target.classList.contains('videoScaleContainer')) {
              window.addEventListener(
                'scroll',
                () => animateVideo(entry.target),
                { passive: true }
              );
            }

            // TextTransform
            if (entry.target.classList.contains('textTransform')) {
              window.addEventListener(
                'scroll',
                () => textTransformAnimate(entry.target),
                { passive: true }
              );
            }
          } else {
            if (entry.target.classList.contains('videoScaleContainer')) {
              window.removeEventListener('scroll', () =>
                animateVideo(entry.target)
              );
            }

            if (entry.target.classList.contains('textTransform')) {
              window.removeEventListener('scroll', () =>
                textTransformAnimate(entry.target)
              );
            }
          }
        });
      }
      // {
      //   root: null,
      //   rootMargin: '0px',
      //   threshold: 0.4,
      // }
    );

    targets.forEach((item) => observer.observe(item));

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <VideoScale
        video="/AlpineArmoringHP.mp4"
        text1="Armored Cadillac"
        text2="ESV V-Series"
      />

      <TextTransform
        text1="Alpine Armoring"
        text2="Triple Certification Process"
      />
    </div>
  );
}

export default Playground;
