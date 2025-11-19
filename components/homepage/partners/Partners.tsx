import styles from './Partners.module.scss';
import Image from 'next/image';
import useLocale from 'hooks/useLocale';
import { useCallback } from 'react';

const Partners = (props) => {
  const { lang } = useLocale();

  const openPopupWindow = useCallback((url) => {
    const width = Math.min(1500, window.innerWidth * 0.8);
    const height = Math.min(1000, window.innerHeight * 0.8);

    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    window.open(
      url,
      `popup_${Date.now()}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,location=yes`
    );
  }, []);

  return (
    <section className={`${styles.partners} container`}>
      <h2 className={`${styles.partners_heading} block-reveal observe`}>
        {lang.industryPartners}
      </h2>
      <div className={`${styles.partners_wrap}`}>
        {props.props.map((item) =>
          item.linkURL ? (
            <a
              href={item.linkURL}
              className={`${styles.partners_item} fade-in observe`}
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                openPopupWindow(item.linkURL);
              }}
              rel="noopener noreferrer"
              aria-label={`${item.title} (opens in popup window)`}
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
                width="180"
                height="90"
                loading="lazy"
                className={`${styles.partners_image}`}
              />
              <h3>{item.title}</h3>
            </a>
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
    </section>
  );
};

export default Partners;
