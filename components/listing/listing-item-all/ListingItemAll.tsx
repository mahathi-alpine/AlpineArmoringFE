import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItemAll.module.scss';

interface InventoryItemProps {
  props: any;
}

const InventoryItem = ({ props }: InventoryItemProps) => {
  const data = props.attributes;

  return (
    <div className={`${styles.listing_item}`}>
      <Link href={`vehicles-we-armor/${data.slug}`}>
        <div className={`${styles.listing_item_image}`}>
          {data.featuredImage.data ? (
            <Image
              src={`${data.featuredImage.data.attributes.url}`}
              alt="Description of the image"
              width={425}
              height={213}
            />
          ) : null}

          {/* <div className={`${styles.listing_item_button} desktop-only`}><span>VIEW VEHICLE</span></div> */}
        </div>

        <div className={`${styles.listing_item_content}`}>
          <h2 className={`${styles.listing_item_title}`}>{data.title}</h2>
        </div>
      </Link>
    </div>
  );
};

export default InventoryItem;
