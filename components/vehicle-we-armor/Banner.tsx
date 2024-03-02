import styles from './Banner.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import Link from 'next/link';
import PDFIcon from 'components/icons/PDF';
import { useIsMobile } from 'hooks/useIsMobile';

const Banner = (props) => {
  const isMobile = useIsMobile();
  const data = props.props;

  const protectionLevel = data.protectionLevel || 'A4, A6, A9, A11';
  const protectionLevelSplit = protectionLevel.split(',');

  return (
    <div className={`${styles.banner}`}>
      <div className={`${styles.banner_main}`}>
        <div className={`${styles.banner_title}`}>
          {data.title ? (
            <h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
          ) : null}
        </div>

        <div className={`${styles.banner_content}`}>
          <div className={`${styles.banner_description}`}>
            {data.descriptionBanner ? (
              <div
                dangerouslySetInnerHTML={{ __html: data.descriptionBanner }}
              ></div>
            ) : null}
          </div>

          <div className={`${styles.banner_buttons}`}>
            <Button
              href="#request-a-quote"
              className={`${styles.banner_buttons_item} primary shiny`}
            >
              Request a quote
            </Button>
            {/* <Button
              href={`/available-now/?vehicles_we_armor=${data.slug}`}
              {...(!data.inventory?.length
                ? { disabled: true, button: true }
                : {})}
              className={`${styles.banner_buttons_item} shiny`}
            >
              View in-stock availability
            </Button> */}
            {data.inventory?.length ? (
              <Button
                href={`/available-now/?vehicles_we_armor=${data.slug}`}
                className={`${styles.banner_buttons_item} shiny`}
              >
                View in-stock availability
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className={`${styles.banner_image}`}>
        <div className={`${styles.banner_overlay}`}>
          <div className={`${styles.banner_overlay_blob2}`}></div>

          <div className={`${styles.banner_overlay_noise}`}></div>
          <svg
            viewBox="0 0 500 500"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'none' }}
          >
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".75"
                numOctaves="2"
                stitchTiles="stitch"
              />
            </filter>
          </svg>
        </div>

        {data.featuredImage?.data ? (
          <div className={`${styles.banner_image_wrap} observe fade-in`}>
            <picture className={`${styles.banner_image_ratio}`}>
              <source
                media="(min-width: 1280px)"
                srcSet={
                  data.featuredImage.data.attributes.formats?.large?.url ||
                  data.featuredImage.data.attributes.url
                }
              />
              <Image
                src={
                  data.featuredImage.data.attributes.formats?.small.url ||
                  data.featuredImage.data.attributes.url
                }
                alt={
                  data.featuredImage.data.attributes.alternativeText ||
                  'Alpine Armoring'
                }
                quality={100}
                priority
                width={
                  isMobile
                    ? data.featuredImage.data.attributes.formats?.small?.width
                    : data.featuredImage.data.attributes.formats?.large
                        ?.width || data.featuredImage.data.attributes.width
                }
                height={
                  isMobile
                    ? data.featuredImage.data.attributes.formats?.small?.height
                    : data.featuredImage.data.attributes.formats?.large
                        ?.height || data.featuredImage.data.attributes.height
                }
              />
            </picture>
          </div>
        ) : null}

        {data.pdf?.data ? (
          <Link
            href={data.pdf.data.attributes.url}
            target="_blank"
            className={`${styles.banner_pdf} observe fade-in`}
          >
            <span>
              <span>OEM</span>
              <br />
              Specs
            </span>
            <PDFIcon />
          </Link>
        ) : null}

        <div className={`${styles.banner_protection}`}>
          <p>Offered At Protection Levels</p>
          <div className={`${styles.banner_protection_levels}`}>
            {/* {data?.protectionLevel} */}
            {protectionLevelSplit.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`${styles.banner_shape} shape-before shape-before-white`}
      ></div>
    </div>
  );
};

export default Banner;
