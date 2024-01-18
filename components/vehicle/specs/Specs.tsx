import styles from './Specs.module.scss';
import Image from 'next/image';

const Specs = (props) => {
  console.log(props);
  return null;

  return (
    <div className={`${styles.specs} container`}>
      <ul className={`${styles.specs_list}`}>
        {props.props.map((item, index) => (
          <li key={index} className={`${styles.specs_item}`}>
            <a className={`${styles.specs_item_link}`}>
              {item.attributes.displayTitle}
            </a>
            <Image
              src={`${item.attributes.media.data.attributes.url}`}
              alt="Description of the image"
              width={700}
              height={450}
              className={`${styles.specs_item_image}`}
            />
            <div className={`${styles.specs_item_overlay}`}>
              <div className={`${styles.specs_item_overlay_inner}`}>
                <span>{item.attributes.displayTitle}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ul className={`${styles.specs_list}`}>
        {props.props.map((item, index) => (
          <li key={index} className={`${styles.specs_item}`}>
            <a className={`${styles.specs_item_link}`}>
              {item.attributes.displayTitle}
            </a>
            <Image
              src={`${item.attributes.media.data.attributes.url}`}
              alt="Description of the image"
              width={700}
              height={450}
              className={`${styles.specs_item_image}`}
            />
            <div className={`${styles.specs_item_overlay}`}>
              <div className={`${styles.specs_item_overlay_inner}`}>
                <span>{item.attributes.displayTitle}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Specs;
