// import Link from 'next/link';
import styles from './Banner.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';
import PDFIcon from 'components/icons/PDF';

const Banner = (props) => {
  const data = props.props;
  // console.log(data)
  // return null;

  return (
    <div className={`${styles.banner}`}>
      <div className={`${styles.banner_main}`}>
        <div className={`${styles.banner_title}`}>
          {data.titleDisplay ? (
            <h1
              className={`observe fade-in`}
              dangerouslySetInnerHTML={{ __html: data.titleDisplay }}
            ></h1>
          ) : data.title ? (
            data.title
          ) : null}
        </div>

        <div className={`${styles.banner_content}`}>
          <div
            className={`${styles.banner_description} observe fade-in delay-1`}
          >
            {data.descriptionBanner ? (
              <Markdown>{data.descriptionBanner}</Markdown>
            ) : null}
          </div>

          <div className={`${styles.banner_buttons} observe fade-in delay-2`}>
            <Button
              href="/contact"
              className={`${styles.banner_buttons_item} primary shiny`}
            >
              Request a quote
            </Button>
            <Button
              href={`/available-now/?vehicles_we_armor=${data.slug}`}
              {...(!data.inventory?.length
                ? { disabled: true, button: true }
                : {})}
              className={`${styles.banner_buttons_item} shiny`}
            >
              View in-stock availability
            </Button>
          </div>
        </div>
      </div>

      <div className={`${styles.banner_image}`}>
        <div className={`${styles.banner_overlay}`}>
          {/* <div className={`${styles.banner_overlay_blob1}`}></div> */}
          <div className={`${styles.banner_overlay_blob2}`}></div>
          {/* <div className={`${styles.banner_overlay_blob3}`}></div> */}

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
          <div className={`${styles.banner_image_wrap} observe fade-in-right`}>
            <Image
              src={`${data.featuredImage.data.attributes.url}`}
              alt="Description of the image"
              width={1000}
              height={550}
            />
          </div>
        ) : null}

        {data.pdf.data ? (
          <Link
            href={data.pdf.data.attributes.url}
            target="_blank"
            className={`${styles.banner_pdf}`}
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
          <h3 className={`observe fade-in`}>Offered At Protection Levels</h3>
          <div className={`${styles.banner_protection_levels} observe fade-in`}>
            <span>A4</span>
            <span>A6</span>
            <span>A9</span>
            <span>A11</span>
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
