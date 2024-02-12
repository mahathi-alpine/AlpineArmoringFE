import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import styles from './Shipping.module.scss';
import Banner from 'components/global/banner/Banner';
import Image from 'next/image';
import Seo from 'components/Seo';
import TabSlider from 'components/global/tab-slider/TabSlider';
import Markdown from 'markdown-to-jsx';
import PDFIcon from 'components/icons/PDF';
import Link from 'next/link';

function Shipping(props) {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const heading = props?.pageData?.heading;
  const boxes = props?.pageData?.boxes;
  const license = props?.pageData?.licenseText;
  const licenseImage = props?.pageData?.licenseImage;
  const licensePDF1 = props?.pageData?.licensePDF1.data.attributes.url;
  const licensePDF2 = props?.pageData?.licensePDF2.data.attributes.url;
  // console.log(props.pageData)
  //   return null;

  const tabSliderData = [
    {
      id: 0,
      titleNav: 'Ground Shipping',
    },
    {
      id: 1,
      titleNav: 'Ocean Shipping',
    },
    {
      id: 2,
      titleNav: 'Air Cargo Shipping',
    },
  ];
  const handleTabChange = (index, titleNav) => {
    const targetId = titleNav.toLowerCase().replace(/\s+/g, '-');
    const targetElement = document.getElementById(targetId);
    const offset = 100;

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

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

        <TabSlider
          className={`${styles.shipping_tabs} observe fade-in desktop-only`}
          props={tabSliderData}
          onTabChange={handleTabChange}
          anchor
        />

        {heading ? (
          <div
            className={`${styles.shipping_heading} observe fade-in container_small`}
          >
            <p dangerouslySetInnerHTML={{ __html: heading }}></p>
          </div>
        ) : null}

        <div className={`${styles.shipping_box_wrap}`}>
          {boxes?.map((item, index) => (
            <div
              className={`${styles.shipping_box_item} background-dark observe fade-in-up`}
              key={index}
              id={item.title.toLowerCase().replace(/\s+/g, '-')}
            >
              <div
                className={`${styles.shipping_box_item_shape} shape-before`}
              ></div>

              <div className={`${styles.shipping_box_item_content}`}>
                {item.title ? (
                  <h2
                    className={`${styles.shipping_box_item_title}`}
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></h2>
                ) : null}

                {item.description ? (
                  // <p
                  //   className={`${styles.shipping_box_item_text}`}
                  //   dangerouslySetInnerHTML={{ __html: item.description }}
                  // ></p>
                  <Markdown className={`${styles.shipping_box_item_text}`}>
                    {item.description}
                  </Markdown>
                ) : null}
              </div>

              <div className={`${styles.shipping_box_item_image}`}>
                <Image
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
                ></Image>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${styles.shipping_license} container_small`}
          id="license"
        >
          <div className={`${styles.shipping_license_left}`}>
            <h2 className={`${styles.shipping_license_title}`}>
              Export License Guidelines
            </h2>

            {license ? (
              <Markdown className={`${styles.shipping_license_text}`}>
                {license}
              </Markdown>
            ) : null}
          </div>

          <div className={`${styles.shipping_license_right}`}>
            <Image
              src={
                licenseImage.data.attributes.formats?.large?.url ||
                licenseImage.data.attributes.url
              }
              alt={
                licenseImage.data.attributes.alternativeText ||
                'Alpine Armoring'
              }
              width={licenseImage.data.attributes.width}
              height={licenseImage.data.attributes.height}
            ></Image>

            <div className={`${styles.shipping_license_right_description}`}>
              {/* <p><strong>Form BIS-711</strong></p> */}
              <p>Statement by ultimate consignee & purchaser</p>
            </div>

            <div className={`${styles.shipping_license_downloads}`}>
              {licensePDF1 ? (
                <Link href={licensePDF1} target="_blank">
                  <span>
                    <span style={{ fontSize: '18px' }}>Download</span>
                    Form BIS-711
                  </span>
                  <PDFIcon />
                </Link>
              ) : null}

              {licensePDF2 ? (
                <Link href={licensePDF2} target="_blank">
                  <span>
                    <span style={{ fontSize: '15px' }}>
                      Instructions
                      <br />
                      to complete
                    </span>
                    Form BIS-711
                  </span>
                  <PDFIcon />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
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
