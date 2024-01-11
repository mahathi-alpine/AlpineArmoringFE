import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'lib/api';
import Button from 'components/global/button/Button';
import Image from 'next/image';
// import { API_URL } from 'config/index';

function InventoryVehicle(props) {
  const data = props.data.data[0]?.attributes;
  const inventory = data.stock.data;

  return (
    <div className={`${styles.inventory}`}>
      <div className={`${styles.inventory_banner} container`}>
        <div className={`${styles.inventory_banner_content}`}>
          <h3 className={`${styles.inventory_banner_availability}`}>
            Available now
          </h3>
          <h1 className={`${styles.inventory_banner_title}`}>{data.title}</h1>
          <p className={`${styles.inventory_banner_description}`}>
            {data.descriptionBanner}
          </p>
          <Button href="/contact" icon className="icon">
            Request a quote
          </Button>
          <Button
            href={`/inventory/?vehicles_we_armor=${data.slug}`}
            icon
            {...(!inventory.length ? { disabled: true, button: true } : {})}
            className="icon"
          >
            View in-stock availability
          </Button>
        </div>

        <div className={`${styles.inventory_banner_image}`}>
          <h3 className={`${styles.inventory_banner_protection}`}>
            ARMORED AT PROTECTION LEVEL <span>A9</span>
          </h3>
          {data.featuredImage.data ? (
            <Image
              src={`${data.featuredImage.data.attributes.url}`}
              alt="Description of the image"
              width={475}
              height={320}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getPageData({
    route: 'vehicles-we-armors',
    populate: 'deep',
    params: `filters[slug][$eq]=${context.params.slug}`,
  });

  return {
    props: { data },
  };
}

export default InventoryVehicle;
