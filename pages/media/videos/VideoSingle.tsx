import styles from './VideoSingle.module.scss';
import Image from 'next/image';
import PlayIcon from 'components/icons/Play';
import { FC } from 'react';

type VideoSingleProps = {
  props: any;
  large?: boolean;
  onLightboxOpen: (
    title: string,
    location: string,
    url: string,
    contentType: string
  ) => void;
};

const VideoSingle: FC<VideoSingleProps> = ({
  props,
  large = false,
  onLightboxOpen,
}) => {
  const handleClick = () => {
    onLightboxOpen(
      props.attributes.title,
      props.attributes.location,
      'video',
      props.attributes.URLExternal
    );
  };

  return (
    <div
      className={`
                ${styles.video} 
                ${large ? styles.video_large : ''}
                observe fade-in
            `}
      onClick={handleClick}
    >
      {props?.attributes?.URLExternal ? (
        <Image
          // src={`https://i.ytimg.com/vi/${item.attributes.URLExternal}/sd3.jpg`}
          src={`https://i.ytimg.com/vi/${props.attributes.URLExternal}/sddefault.jpg`}
          alt={props.attributes.title}
          width={630}
          height={400}
          sizes="(min-width: 768px ) 100vw, 80vw"
        ></Image>
      ) : null}

      <div className={`${styles.video_caption}`}>
        <PlayIcon />
        <div className={`${styles.video_caption_box}`}>
          {props ? <h3>{props.attributes.title}</h3> : null}
          {props ? (
            <h4 className={`${styles.video_location}`}>
              {props.attributes.location}
            </h4>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VideoSingle;
