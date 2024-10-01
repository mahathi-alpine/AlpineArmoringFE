import { FC } from 'react';
import Image from 'next/image';
import styles from './TradeShows.module.scss';
import Button from 'components/global/button/Button';

type TradeShowsSingleProps = {
  props: any;
  list?: boolean;
  onLightboxOpen: (
    title: string,
    location: string,
    url: string,
    contentType: string,
    gallery: any,
    date: string,
    year: any
  ) => void;
};

const TradeShowsSingle: FC<TradeShowsSingleProps> = ({
  props,
  list = false,
  onLightboxOpen,
}) => {
  const data = props?.attributes;

  // Function to extract year from yyyy-mm-dd formatted date
  const extractYear = (dateString: string | undefined): string => {
    if (!dateString) return '';
    return dateString.split('-')[0];
  };

  const handleClick = () => {
    onLightboxOpen(
      data?.title,
      data?.location,
      'content',
      null,
      data?.gallery?.data,
      data?.description,
      data?.date
    );
  };

  return (
    <div
      className={`
                ${styles.tradeShowsSingle}
                ${list ? styles.tradeShowsSingle_list : ''}
            `}
      onClick={handleClick}
    >
      {data?.gallery?.data ? (
        <Image
          src={
            data.gallery.data[0].attributes.formats?.thumbnail?.url ||
            data.gallery.data[0].attributes.url
          }
          alt={
            data.gallery.data[0].attributes.alternativeText || 'Alpine Armoring'
          }
          width={400}
          height={300}
          sizes={'(min-width: 1280px ) 40vw, 100vw'}
        ></Image>
      ) : null}

      <div className={styles.tradeShowsSingle_content}>
        <div className={styles.tradeShowsSingle_left}>
          {data ? (
            <p className={styles.year}>{extractYear(data.date)}</p>
          ) : null}{' '}
          {/* Display year */}
          {data ? <p>{data.description}</p> : null}
        </div>
        <div className={styles.tradeShowsSingle_right}>
          {data ? <h4>{data.title}</h4> : null}
          {data ? <p>{data.location}</p> : null}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <Button button className={`${styles.tradeShowsSingle_link}`}>
          View
        </Button>
      </div>
    </div>
  );
};

export default TradeShowsSingle;
