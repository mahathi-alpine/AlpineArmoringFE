import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import styles from './Shipping.module.scss';
import Banner from 'components/global/banner/Banner';
import { CldImage } from 'next-cloudinary';
import Seo from 'components/Seo';
import FillingText from 'components/global/filling-text/FillingText';

function Shipping(props) {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const heading = props?.pageData?.heading;
  const boxes = props?.pageData?.boxes;
  //   console.log(boxes)
  //   return null;

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Seo props={seoData} />

      <div className={`${styles.shipping}`}>
        {banner ? <Banner props={banner} center shape="white" /> : null}

        {heading ? <FillingText data={heading} dark /> : null}

        <div className={`${styles.shipping_box_wrap} container`}>
          {boxes.map((item, index) => (
            <div
              className={`${styles.shipping_box_item} observe fade-in-up`}
              key={index}
            >
              <div className={`${styles.shipping_box_item_content}`}>
                {item.title ? (
                  <h2
                    className={`${styles.shipping_box_item_title}`}
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></h2>
                ) : null}
                {item.description ? (
                  <p
                    className={`${styles.shipping_box_item_text}`}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></p>
                ) : null}
              </div>

              <div className={`${styles.shipping_box_item_image}`}>
                <CldImage
                  src={
                    item.image.data.attributes.formats?.large?.url ||
                    item.image.data.attributes.url
                  }
                  alt={
                    item.image.data.attributes.alternativeText ||
                    'Alpine Armoring'
                  }
                  width={1238}
                  height={346}
                ></CldImage>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  let pageData = await getPageData({
    route: 'shipping',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default Shipping;
