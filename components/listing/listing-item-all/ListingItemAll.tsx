import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItemAll.module.scss';
import Button from 'components/global/button/Button';
import Markdown from 'markdown-to-jsx';

interface InventoryItemProps {
  props: any;
}

const InventoryItem = ({ props }: InventoryItemProps) => {
  const data = props.attributes;

  return (
    <div className={`${styles.listing_item} observe fade-in`}>
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
          <h2 className={`${styles.listing_item_title}`}>
            {data.titleDisplay ? (
              <Markdown>{data.titleDisplay}</Markdown>
            ) : data.title ? (
              data.title
            ) : null}
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default InventoryItem;
