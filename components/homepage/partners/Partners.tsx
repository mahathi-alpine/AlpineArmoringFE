import styles from './Partners.module.scss';
// import { API_URL } from 'config/index';
// import Image from 'next/image';
import { CldImage } from 'next-cloudinary';

const Partners = (props) => {
  return (
    <div className={`${styles.partners} container`}>
      <h2 className={`c-title block-reveal observe`}>
        <span>Industry Partners</span>
      </h2>
      <div className={`${styles.partners_wrap}`}>
        {props.props.map((item) => (
          <div
            className={`${styles.partners_item} fade-in observe `}
            key={item.id}
          >
            <CldImage
              src={
                item.attributes.url.formats?.large?.url || item.attributes.url
              }
              alt={`Alpine Partner${
                item.attributes.alternativeText
                  ? ' | ' + item.attributes.alternativeText
                  : ''
              }`}
              // width={475}
              // height={320}
              width={item.attributes.width}
              height={item.attributes.height}
              className={`${styles.partners_image}`}
            ></CldImage>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
