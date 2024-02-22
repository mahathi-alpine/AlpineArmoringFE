import styles from './VideosPopup.module.scss';
import Button from 'components/global/button/Button';
import PlayIcon from 'components/icons/Play';

import NextJsImage from '../lightbox/NextJsImage';
import NextJsImageThumbs from '../lightbox/NextJsImageThumbs';
import useLightbox from '../lightbox/useLightbox';
import 'yet-another-react-lightbox/styles.css';
import Video from 'yet-another-react-lightbox/plugins/video';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';

const VideosPopup = (props) => {
  const { openLightbox, renderLightbox } = useLightbox();

  const slidesData = props.props.map((item) => {
    const type = item.image.data?.attributes.mime.split('/')[0];
    const url = item.image.data?.attributes.url;
    const width = item.image.data?.attributes.width;
    const height = item.image.data?.attributes.height;
    const alt = item.image.data?.attributes.alternativeText;
    const formats = item.image.data?.attributes?.formats;
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
            src: url,
            type: item.image.data.attributes.mime,
          },
        ],
      };
    } else {
      return {
        type: 'image',
        src: url,
        title: title,
        description: description,
        alt: alt,
        width: width,
        height: height,
        formats: formats,
      };
    }
  });

  return (
    <div className={`${styles.videoPopup_wrap}`}>
      <div className={`center`}>
        <div className={`${styles.videoPopup_button}`}>
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
    </div>
  );
};

export default VideosPopup;
