import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItem.module.scss';
import useLocale from 'hooks/useLocale';

interface InventoryItemProps {
  props: any;
  index: number;
  isRental?: boolean;
  locale?: string;
}

const InventoryItem = ({
  props,
  index,
  isRental = false,
  locale,
}: InventoryItemProps) => {
  const { lang } = useLocale();
  const data = props.attributes;

  const linkHref = isRental
    ? `${locale === 'en' ? '' : `/${locale}`}${lang.rentalVehiclesURL}/${data.slug}`
    : `${locale === 'en' ? '' : `/${locale}`}/${lang.availableNowURL}/${data.slug}`;

  return (
    <Link
      href={linkHref}
      className={`
        ${styles.inventory_item} 
        ${data.flag == 'sold' ? styles.inventory_item_sold : ''}
        ${isRental ? styles.inventory_item_rental : ''}
      `}
    >
      <div className={`${styles.inventory_item_image}`}>
        {data.featuredImage.data ? (
          <Image
            src={`${
              data.featuredImage.data.attributes.formats.thumbnail?.url ||
              data.featuredImage.data.attributes.url
            }`}
            alt={
              data.featuredImage.data.attributes.alternativeText ||
              data.title + ' for sale | Alpine Armoring'
            }
            width={500}
            height={385}
            priority={index === 0}
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
          <p
            className={`${styles.inventory_item_level}`}
            dangerouslySetInnerHTML={{
              __html: `${lang.armoredTo} <span>${lang.level} ${data.armor_level}</span>`,
            }}
          />
        )}

        <ul className={`${styles.inventory_item_info}`}>
          {(() => {
            const fieldsToDisplay = isRental
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
