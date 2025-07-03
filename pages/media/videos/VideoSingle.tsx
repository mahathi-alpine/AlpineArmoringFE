import { useState } from 'react';
import styles from './VideoSingle.module.scss';
import Image from 'next/image';
import PlayIcon from 'components/icons/Play';
import { FC } from 'react';

type VideoSingleProps = {
  props: any;
  large?: boolean;
  onLightboxOpen?: (
    title: string,
    location: string,
    url: string,
    contentType: string
  ) => void;
};

const VideoSingle: FC<VideoSingleProps> = ({ props, large = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper function to determine video type
  const getVideoType = () => {
    if (props?.attributes?.URLExternal) {
      return 'youtube';
    }
    if (props?.attributes?.instagramReelId || props?.attributes?.instagramURL) {
      return 'instagram';
    }
    return null;
  };

  // Helper function to extract Instagram Reel ID from URL
  const getInstagramReelId = () => {
    if (props?.attributes?.instagramReelId) {
      return props.attributes.instagramReelId;
    }

    return null;
  };

  // Helper function to get thumbnail URL
  const getThumbnailUrl = () => {
    const videoType = getVideoType();

    if (videoType === 'youtube') {
      return `https://i.ytimg.com/vi/${props.attributes.URLExternal}/sddefault.jpg`;
    }

    if (videoType === 'instagram') {
      // For Instagram, you might want to use a custom thumbnail if available
      // or a placeholder image since Instagram doesn't provide direct thumbnail URLs
      return (
        props?.attributes?.customThumbnail ||
        '/placeholder-instagram-thumbnail.jpg'
      );
    }

    return '/placeholder-video-thumbnail.jpg';
  };

  const handleClick = () => {
    setIsPlaying(true);
  };

  // const handleVideoEnd = () => {
  //   setIsPlaying(false);
  // };

  const handleVideoError = () => {
    setIsPlaying(false);
    console.error('Video failed to load');
  };

  const videoType = getVideoType();
  console.log(videoType);

  return (
    <div
      className={`
        ${styles.video} 
        ${large ? styles.video_large : ''}
        ${isPlaying ? styles.video_playing : ''}
      `}
    >
      {!isPlaying && videoType ? (
        <>
          <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className={`${styles.video_image}`}>
              <Image
                src={getThumbnailUrl()}
                alt={props.attributes.title}
                width={630}
                height={400}
                sizes="(min-width: 768px ) 100vw, 80vw"
              />
            </div>

            <div className={`${styles.video_caption}`}>
              <PlayIcon />
              <div className={`${styles.video_caption_box}`}>
                {props && <h3>{props.attributes.title}</h3>}
                {props && (
                  <p className={`${styles.video_location}`}>
                    {props.attributes.location}
                    {props.attributes.year ? ` | ${props.attributes.year}` : ''}
                    {videoType === 'instagram' && ' | Instagram Reel'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {isPlaying && videoType === 'youtube' && (
        <div className={styles.video_player}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${props.attributes.URLExternal}?autoplay=1&rel=0`}
            title={props.attributes.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => console.log('Video loaded')}
            onError={handleVideoError}
          />

          <button
            className={styles.video_close}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(false);
            }}
            aria-label="Close video"
          >
            ×
          </button>
        </div>
      )}

      {isPlaying && videoType === 'instagram' && (
        <div className={styles.video_player}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.instagram.com/reel/${getInstagramReelId()}/embed/`}
            title={props.attributes.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => console.log('Instagram reel loaded')}
            onError={handleVideoError}
          />

          <button
            className={styles.video_close}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(false);
            }}
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
