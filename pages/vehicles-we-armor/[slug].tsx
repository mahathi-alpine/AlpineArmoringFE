import styles from './InventoryVehicle.module.scss';
import { getPageData } from 'lib/api';
import Button from 'components/global/button/Button';
import ComparisonSlider from 'components/global/comparison-slider/ComparisonSlider';
import Image from 'next/image';

function InventoryVehicle(props) {
  const data = props.data.data[0]?.attributes;
  const inventory = data.stock.data;

  return (
    <div className={`${styles.inventory}`}>
      <div className={`${styles.banner}`}>
        <h1 className={`${styles.banner_title}`}>{data.title}</h1>

        <div className={`${styles.banner_image}`}>
          {data.featuredImage.data ? (
            <div className={`${styles.banner_image_wrap}`}>
              <Image
                src={`${data.featuredImage.data.attributes.url}`}
                alt="Description of the image"
                width={760}
                height={400}
              />
            </div>
          ) : null}

          <div className={`${styles.banner_protection}`}>
            <h3>Offered At Protection Levels</h3>
            <div className={`${styles.banner_protection_levels}`}>
              <span>A4</span>
              <span>A6</span>
              <span>A9</span>
              <span>A11</span>
            </div>
          </div>
        </div>

        <div className="shape-before shape-before-white mobile-only"></div>

        <div className={`${styles.banner_text}`}>
          <p className={`${styles.banner_description}`}>
            {data.descriptionBanner}
          </p>

          <div className={`${styles.banner_buttons}`}>
            <Button
              href="/contact"
              className={`${styles.banner_buttons_item} primary shiny`}
            >
              Request a quote
            </Button>
            <Button
              href={`/inventory/?vehicles_we_armor=${data.slug}`}
              {...(!inventory.length ? { disabled: true, button: true } : {})}
              className={`${styles.banner_buttons_item} shiny`}
            >
              View in-stock availability
            </Button>
          </div>
        </div>
      </div>

      <div className={`container`}>
        <ComparisonSlider
          beforeImage="/assets/beforeSlide.png"
          afterImage="/assets/afterSlide.png"
        />
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
