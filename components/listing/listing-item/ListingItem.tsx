import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItem.module.scss';
import { useRouter } from 'next/router';

interface InventoryItemProps {
  props: any;
  index: number;
}

const InventoryItem = ({ props, index }: InventoryItemProps) => {
  const data = props.attributes;
  const router = useRouter(); // Initialize useRouter
  const currentPath = router.asPath; // Get the current route

  const linkHref = currentPath.includes('armored-rental')
    ? `/rental-vehicles/${data.slug}`
    : `/available-now/${data.slug}`;

  return (
    <Link
      href={linkHref}
      className={`
        ${styles.inventory_item} 
        ${data.flag == 'sold' ? styles.inventory_item_sold : ''}
        ${
          currentPath.includes('available-now/type/armored-rental')
            ? styles.inventory_item_rental
            : ''
        }
      `}
    >
      <div className={`${styles.inventory_item_image}`}>
        {data.featuredImage.data ? (
          <Image
            src={`${
              data.featuredImage.data.attributes.formats.medium.url ||
              data.featuredImage.data.attributes.url
            }`}
            alt={
              data.featuredImage.data.attributes.alternativeText ||
              'Alpine Armoring'
            }
            width={563}
            height={433}
            priority={index === 0}
            sizes="(max-width: 1600px) 50vw, 30vw"
          />
        ) : null}

        <div className={`${styles.inventory_item_button}`}>
          <span>VIEW DETAILS</span>
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
              <strong>VIN:</strong>
              <span>{data.VIN}</span>
            </li>
          ) : null}
          {data.vehicleID ? (
            <li className={`${styles.inventory_item_info_item}`}>
              <strong>Vehicle ID:</strong>
              <span>{data.vehicleID}</span>
            </li>
          ) : null}
          {data.engine ? (
            <li className={`${styles.inventory_item_info_item}`}>
              <strong>Engine:</strong>
              <span>{data.engine}</span>
            </li>
          ) : null}
        </ul>
      </div>
    </Link>
  );
};

export default InventoryItem;
