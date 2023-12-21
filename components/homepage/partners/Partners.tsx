import styles from './Partners.module.scss';
import { API_URL } from 'config/index';
import Image from 'next/image';

const Partners = (props) => {
  // console.log(props)
  return (
    <div className={`${styles.partners} container`}>
      <h2 className={`c-title observe fade-in-up`}>
        <span>Industry Partners</span>
      </h2>
      <div className={`${styles.partners_wrap}`}>
        {props.props.map((item) => (
          <div className={`${styles.partners_item}`} key={item.id}>
            <Image
              src={`${API_URL}${item.attributes.url}`}
              alt={`Alpine Partner${
                item.attributes.alternativeText
                  ? ' | ' + item.attributes.alternativeText
                  : ''
              }`}
              width={475}
              height={320}
              className={`${styles.partners_image}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
