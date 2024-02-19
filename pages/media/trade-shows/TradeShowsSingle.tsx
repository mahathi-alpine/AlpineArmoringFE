// import Link from 'next/link';
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
    gallery: any
  ) => void;
};

const TradeShowsSingle: FC<TradeShowsSingleProps> = ({
  props,
  list = false,
  onLightboxOpen,
}) => {
  const data = props?.attributes;

  const handleClick = () => {
    onLightboxOpen(
      data?.title,
      data.description,
      'gallery',
      null,
      data.gallery.data
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
      {data ? <h4>{data.title}</h4> : null}
      {data ? <h4>{data.description}</h4> : null}

      <Image
        src={
          data.gallery.data[0].attributes.formats?.large?.url ||
          data.gallery.data[0].attributes.url
        }
        alt={
          data.gallery.data[0].attributes.alternativeText || 'Alpine Armoring'
        }
        width={400}
        height={300}
        sizes={'(min-width: 1280px ) 40vw, 100vw'}
      ></Image>

      <Button button className={`${styles.tradeShowsSingle_link}`}>
        View Pics
      </Button>
    </div>
  );
};

export default TradeShowsSingle;
