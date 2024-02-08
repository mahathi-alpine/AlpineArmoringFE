import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItemAll.module.scss';
import Button from 'components/global/button/Button';

interface InventoryItemProps {
  props: any;
}

const InventoryItem = ({ props }: InventoryItemProps) => {
  const data = props.attributes;

  return (
    <div className={`${styles.listing_item}`}>
      <Link
        href={`/vehicles-we-armor/${data.slug}`}
        className={`${styles.listing_item_inner}`}
      >
        <div className={`${styles.listing_item_image}`}>
          {data.featuredImage.data ? (
            <Image
              src={`${data.featuredImage.data.attributes.url}`}
              alt="Description of the image"
              width={425}
              height={213}
            />
          ) : null}

          <Button
            className={`${styles.listing_item_button} desktop-only primary small`}
            button
          >
            View Vehicle
          </Button>
        </div>

        <div className={`${styles.listing_item_content}`}>
          {data.titleDisplay ? (
            <h2
              className={`${styles.listing_item_title}`}
              dangerouslySetInnerHTML={{ __html: data.titleDisplay }}
            ></h2>
          ) : data.title ? (
            <h2 className={`${styles.listing_item_title}`}>{data.title}</h2>
          ) : null}
        </div>
      </Link>
    </div>
  );
};

export default InventoryItem;
