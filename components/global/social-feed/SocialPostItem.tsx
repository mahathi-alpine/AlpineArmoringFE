import { useState, useRef } from 'react';
import styles from './SocialPostItem.module.scss';
import Image from 'next/image';
import PlayIcon from 'components/icons/Play';
import { FC } from 'react';

type VideoSingleProps = {
  props: {
    attributes: {
      title: string;
      URLExternal?: string;
      videoFile?: string;
      thumbnailImage?: string;
      description?: string;
      duration?: string;
      uploadDate?: string;
      author?: string;
    };
  };
  large?: boolean;
};

const VideoSingle: FC<VideoSingleProps> = ({ props }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideoType = () => {
    if (props?.attributes?.URLExternal) {
      return 'youtube';
    }
    if (props?.attributes?.videoFile) {
      return 'upload';
    }
    return null;
  };

  const getThumbnailUrl = () => {
    const videoType = getVideoType();

    if (props.attributes.thumbnailImage) {
      return props.attributes.thumbnailImage;
    }

    if (videoType === 'youtube') {
      return `https://i.ytimg.com/vi/${props.attributes.URLExternal}/sddefault.jpg`;
    }

    return '/placeholder-video-thumbnail.jpg';
  };

  const handleClick = () => {
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    setHasError(true);
    console.error('Video failed to load');
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleCloseVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    setIsLoading(false);

    if (videoRef.current && getVideoType() === 'upload') {
      videoRef.current.pause();
    }
  };

  const videoType = getVideoType();

  return (
    <div
      className={`
        ${styles.socialPost} 
        ${isPlaying ? styles.video_playing : ''}
      `}
    >
      {!isPlaying && videoType ? (
        <>
          <div
            onClick={handleClick}
            className={`${styles.socialPost_notPlaying}`}
          >
            <Image
              src={getThumbnailUrl()}
              alt={props.attributes.title}
              width={630}
              height={400}
              sizes="(min-width: 768px) 100vw, 80vw"
              style={{ objectFit: 'cover' }}
              className={`${styles.socialPost_notPlaying_image}`}
            />

            <div className={`${styles.socialPost_notPlaying_icon}`}>
              <PlayIcon />
            </div>

            {/* <div className={`${styles.video_caption}`}>
              <div className={`${styles.video_caption_box}`}>
                {props && <h3>{props.attributes.title}</h3>}
              </div>
            </div> */}
          </div>
        </>
      ) : null}

      {isPlaying && (
        <div className={styles.socialPost_player}>
          {isLoading && (
            <div className={styles.socialPost_loading}>
              <div className={styles.socialPost_spinner}></div>
            </div>
          )}

          {hasError && (
            <div className={styles.video_error}>
              <p>Failed to load video. Please try again.</p>
              <button onClick={() => window.location.reload()}>
                Reload Page
              </button>
            </div>
          )}

          {videoType === 'youtube' && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${props.attributes.URLExternal}?autoplay=1&rel=0`}
              title={props.attributes.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoad}
              onError={handleVideoError}
            />
          )}

          {videoType === 'upload' && (
            <video
              ref={videoRef}
              width="100%"
              height="100%"
              controls
              autoPlay
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              onLoadedData={handleVideoLoad}
            >
              <source src={props.attributes.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <button
            className={styles.video_close}
            onClick={handleCloseVideo}
            aria-label="Close video"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoSingle;
