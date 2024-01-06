import styles from './VideoScale.module.scss';

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

const VideoScale = ({ video, text1, text2 }) => {
  return (
    <section className={`${styles.videoScale} observe videoScaleContainer`}>
      <div className={`${styles.videoScale_shim}`}></div>
      <div className={`${styles.videoScale_sticky}`}>
        <video
          className={`${styles.videoScale_video} videoScaleVideo`}
          autoPlay
          muted
          loop
          playsInline
          src={video}
        ></video>
        <div className={`${styles.videoScale_overlay}`}>
          <h2 className="videoScale_header_left">{text1}</h2>
          <h2 className="videoScale_header_right">{text2}</h2>
        </div>
      </div>
    </section>
  );
};

export default VideoScale;
