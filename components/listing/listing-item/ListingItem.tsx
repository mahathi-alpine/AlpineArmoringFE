import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItem.module.scss';
// import { API_URL } from 'config/index';

interface InventoryItemProps {
  props: any;
  stock?: any;
}

const InventoryItem = ({ props, stock }: InventoryItemProps) => {
  const data = props.attributes;

  return (
    <div
      className={`${styles.inventory_item} ${
        stock ? styles.inventory_item_stock : ''
      }`}
    >
      <Link href={`${stock ? 'inventory' : 'vehicles-we-armor'}/${data.slug}`}>
        <div className={`${styles.inventory_item_image}`}>
          {data.featuredImage.data ? (
            <Image
              src={`${data.featuredImage.data.attributes.url}`}
              alt="Description of the image"
              width={475}
              height={320}
            />
          ) : null}
        </div>
        <div className={`${styles.inventory_item_content}`}>
          <h2 className={`${styles.inventory_item_title}`}>{data.title}</h2>
          {stock ? (
            <h3 className={`${styles.inventory_item_level}`}>
              Armored to <span>level A9</span>
            </h3>
          ) : null}
          <ul className={`${styles.inventory_item_info}`}>
            {data.VIN ? (
              <li className={`${styles.inventory_item_info_item}`}>
                <span>VIN</span>
                {data.VIN}
              </li>
            ) : null}
            {data.vehicleID ? (
              <li className={`${styles.inventory_item_info_item}`}>
                <span>Vehicle ID</span>
                {data.vehicleID}
              </li>
            ) : null}
            {data.engine ? (
              <li className={`${styles.inventory_item_info_item}`}>
                <span>Engine</span>
                {data.engine}
              </li>
            ) : null}
          </ul>
        </div>
      </Link>
    </div>
  );
};

export default InventoryItem;
