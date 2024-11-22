import styles from './Partners.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const Partners = (props) => {
  return (
    <div className={`${styles.partners} container`}>
      <h2 className={`${styles.partners_heading} block-reveal observe`}>
        Industry Partners
      </h2>
      <div className={`${styles.partners_wrap}`}>
        {props.props.map((item) =>
          item.linkURL ? (
            <Link
              href={item.linkURL}
              className={`${styles.partners_item} fade-in observe`}
              key={item.id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={
                  item.image.data[0].attributes.formats?.thumbnail?.url ||
                  item.image.data[0].attributes.url
                }
                alt={
                  item.image.data[0].attributes.alternativeText ||
                  'Alpine Armoring'
                }
                width={310}
                height={90}
                className={`${styles.partners_image}`}
                sizes={'(min-width: 1280px ) 25vw, 40vw'}
              />
              <h3>{item.title}</h3>
            </Link>
          ) : (
            <div
              className={`${styles.partners_item} fade-in observe`}
              key={item.id}
            >
              <Image
                src={
                  item.image.data[0].attributes.formats?.thumbnail?.url ||
                  item.image.data[0].attributes.url
                }
                alt={
                  item.image.data[0].attributes.alternativeText ||
                  'Alpine Armoring'
                }
                width={310}
                height={90}
                className={`${styles.partners_image}`}
                sizes={'(min-width: 1280px ) 25vw, 40vw'}
              />
              <h3>{item.title}</h3>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Partners;
