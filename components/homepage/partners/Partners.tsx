import styles from './Partners.module.scss';
// import { API_URL } from 'config/index';
// import Image from 'next/image';
import Image from 'next/image';

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
            <Image
              src={item.attributes.formats?.small?.url || item.attributes.url}
              alt={item.attributes.alternativeText || 'Alpine Armoring'}
              width={310}
              height={90}
              className={`${styles.partners_image}`}
              sizes={'(min-width: 1280px ) 25vw, 40vw'}
            ></Image>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
