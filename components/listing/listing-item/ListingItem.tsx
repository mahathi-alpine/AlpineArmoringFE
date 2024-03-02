import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItem.module.scss';
// import { API_URL } from 'config/index';

interface InventoryItemProps {
  props: any;
}

const InventoryItem = ({ props }: InventoryItemProps) => {
  const data = props.attributes;

  return (
    <Link
      href={`/available-now/${data.slug}`}
      className={`${styles.inventory_item} `}
    >
      <div className={`${styles.inventory_item_image}`}>
        {data.featuredImage.data ? (
          <Image
            src={`${data.featuredImage.data.attributes.url}`}
            alt="Description of the image"
            width={475}
            height={320}
          />
        ) : null}

        <div className={`${styles.inventory_item_button}`}>
          <span>VIEW VEHICLE</span>
        </div>

        {data.flag && data.label ? (
          <>
            {(() => {
              const flagClass = `inventory_item_label_${data.flag}`;
              return (
                <div
                  className={`${styles.inventory_item_label} ${styles[flagClass]}`}
                >
                  <span>{data.flag}</span>
                </div>
              );
            })()}
          </>
        ) : null}
      </div>

      <div className={`${styles.inventory_item_content}`}>
        <h2
          className={`${styles.inventory_item_title}`}
          dangerouslySetInnerHTML={{
            __html: data.title,
          }}
        ></h2>

        <h3 className={`${styles.inventory_item_level}`}>
          Armored to <span>level {data.armor_level}</span>
        </h3>

        <ul className={`${styles.inventory_item_info}`}>
          {data.VIN ? (
            <li className={`${styles.inventory_item_info_item}`}>
              <span>VIN:</span>
              {data.VIN}
            </li>
          ) : null}
          {data.vehicleID ? (
            <li className={`${styles.inventory_item_info_item}`}>
              <span>Vehicle ID:</span>
              {data.vehicleID}
            </li>
          ) : null}
          {data.engine ? (
            <li className={`${styles.inventory_item_info_item}`}>
              <span>Engine:</span>
              {data.engine}
            </li>
          ) : null}
        </ul>
      </div>
    </Link>
  );
};

export default InventoryItem;
