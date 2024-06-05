import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItemAll.module.scss';
import Button from 'components/global/button/Button';

interface InventoryItemProps {
  props: any;
  index: number;
}

const InventoryItem = ({ props, index }: InventoryItemProps) => {
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
              src={`${
                data.featuredImage.data.attributes.formats.thumbnail.url ||
                data.featuredImage.data.attributes.url
              }`}
              alt="Description of the image"
              width={420}
              height={200}
              priority={index === 0}
            />
          ) : null}

          <Button
            className={`${styles.listing_item_button} desktop-only primary small`}
            button
          >
            View Details
          </Button>
        </div>

        <div className={`${styles.listing_item_content}`}>
          {data.title ? (
            <h2
              className={`${styles.listing_item_title}`}
              dangerouslySetInnerHTML={{ __html: data.title }}
            ></h2>
          ) : null}
        </div>
      </Link>
    </div>
  );
};

export default InventoryItem;
