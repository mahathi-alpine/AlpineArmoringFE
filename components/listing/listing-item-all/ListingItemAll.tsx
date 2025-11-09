import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingItemAll.module.scss';
import Button from 'components/global/button/Button';
import useLocale from 'hooks/useLocale';
import { useRouter } from 'next/router';

interface InventoryItemProps {
  props: any;
  index: number;
}

const InventoryItem = ({ props, index }: InventoryItemProps) => {
  const { lang } = useLocale();
  const router = useRouter();
  const data = props.attributes;

  // Helper function to get the correct slug for the current locale
  const getLocalizedSlug = (): string => {
    const currentLocale = router.locale || 'en';

    // If the vehicle is already in the current locale, use its slug
    if (data.locale === currentLocale) {
      return data.slug;
    }

    // Otherwise, look for the localization with the current locale
    if (data.localizations?.data) {
      const localized = data.localizations.data.find(
        (loc: any) => loc.attributes.locale === currentLocale
      );
      if (localized) {
        return localized.attributes.slug;
      }
    }

    // Fallback: use the original slug (might result in 404 if no translation exists)
    return data.slug;
  };

  const localizedSlug = getLocalizedSlug();

  return (
    <div className={`${styles.listing_item}`}>
      <Link
        href={`${lang.vehiclesWeArmorURL}/${localizedSlug}`}
        className={`${styles.listing_item_inner}`}
      >
        <div className={`${styles.listing_item_image}`}>
          {data.featuredImage.data ? (
            <Image
              src={`${
                data.featuredImage.data.attributes.formats.thumbnail.url ||
                data.featuredImage.data.attributes.url
              }`}
              alt={
                data.featuredImage.data.attributes.alternativeText ||
                data.title
                  .replace(/[\r\n]+/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim() + ' | Alpine Armoring'
              }
              width={500}
              height={200}
              priority={index === 0}
            />
          ) : null}

          <Button
            className={`${styles.listing_item_button} desktop-only primary small`}
            button
          >
            {lang.viewDetails}
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
