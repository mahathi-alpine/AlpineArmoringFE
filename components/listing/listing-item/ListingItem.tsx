import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItem.module.scss';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';

interface InventoryItemProps {
  props: any;
  index: number;
}

const InventoryItem = ({ props, index }: InventoryItemProps) => {
  const { lang } = useLocale();
  const data = props.attributes;
  const router = useRouter();
  const currentPath = router.asPath;

  const linkHref = currentPath.includes(lang.armoredRentalURL)
    ? `${lang.rentalVehiclesURL}/${data.slug}`
    : `/${lang.availableNowURL}/${data.slug}`;

  return (
    <Link
      href={linkHref}
      className={`
        ${styles.inventory_item} 
        ${data.flag == 'sold' ? styles.inventory_item_sold : ''}
        ${
          currentPath.includes(
            `/${lang.availableNowURL}/${lang.type}/${lang.armoredRentalURL}`
          )
            ? styles.inventory_item_rental
            : ''
        }
      `}
    >
      <div className={`${styles.inventory_item_image}`}>
        {data.featuredImage.data ? (
          <Image
            src={`${
              data.featuredImage.data.attributes.formats.medium?.url ||
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
          <span>{lang.viewDetails}</span>
        </div>

        {data.flag && data.label ? (
          <>
            {(() => {
              const flagClass = `inventory_item_label_${data.flag}`;
              const getFlagTranslation = (flag: string) => {
                const flagMap: Record<string, string> = {
                  sold: 'soldFlag',
                  'coming soon': 'comingSoonFlag',
                  'pre-owned': 'preOwnedFlag',
                  'export only': 'exportOnlyFlag',
                };

                const translationKey = flagMap[flag];
                return translationKey && lang[translationKey]
                  ? lang[translationKey]
                  : flag;
              };

              return (
                <div
                  className={`${styles.inventory_item_label} ${styles[flagClass]}`}
                >
                  <span>{getFlagTranslation(data.flag)}</span>
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

        {data.armor_level && (
          <h3 className={`${styles.inventory_item_level}`}>
            {lang.armoredTo}{' '}
            <span>
              {lang.level} {data.armor_level}
            </span>
          </h3>
        )}

        <ul className={`${styles.inventory_item_info}`}>
          {(() => {
            const fieldsToDisplay = currentPath.includes(lang.armoredRentalURL)
              ? [
                  { key: 'rentalsVehicleID', label: lang.vehicleID },
                  { key: 'engine', label: lang.engine },
                  { key: 'trans', label: lang.trans },
                ]
              : [
                  { key: 'VIN', label: lang.VIN },
                  { key: 'vehicleID', label: lang.vehicleID },
                  { key: 'engine', label: lang.engine },
                ];

            return fieldsToDisplay.map(({ key, label }) =>
              data[key] ? (
                <li key={key} className={`${styles.inventory_item_info_item}`}>
                  <strong>{label}:</strong>
                  <span>{data[key]}</span>
                </li>
              ) : null
            );
          })()}
        </ul>
      </div>
    </Link>
  );
};

export default InventoryItem;
