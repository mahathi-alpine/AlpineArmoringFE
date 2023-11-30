import styles from './VideoScale.module.scss';

export function animateVideo(entry) {
  let {bottom} = entry.getBoundingClientRect();
  let scale = 1 - ((bottom - window.innerHeight) * .0005);
  let video = entry.querySelector('.videoScaleVideo');;
 
  scale = scale < .2 ? .2 : scale > 1 ? 1 : scale;
  video.style.transform = `scale(${scale})`;
 
  // Text transformation
  let textTrans = bottom - window.innerHeight;
  const headerLeft = entry.querySelector('.videoScale_header_left');
  const headerRight = entry.querySelector('.videoScale_header_right');
 
  textTrans = textTrans < 0 ? 0 : textTrans;
  headerLeft.style.transform = `translateX(${-textTrans}px)`;
  headerRight.style.transform = `translateX(${textTrans}px)`;
}

const VideoScale = ({props}) => {
  return (   
    <section className={`${styles.videoScale} observe videoScaleContainer background-dark`}>
        <div className={`${styles.videoScale_shim}`}></div>
        <div className={`${styles.videoScale_sticky}`}>
            <video className={`${styles.videoScale_video} videoScaleVideo`} autoPlay muted loop playsInline src={props}></video>
            <div className={`${styles.videoScale_overlay}`}>
                <h2 className="videoScale_header_left">ALPINE</h2>
                <h2 className="videoScale_header_right">ARMORING</h2>
            </div>
        </div>
    </section>
  );
};

export default VideoScale;