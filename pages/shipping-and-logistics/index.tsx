import { useEffect, useState } from 'react';
import { getPageData } from 'hooks/api';
import styles from './Shipping.module.scss';
import Banner from 'components/global/banner/Banner';
import Image from 'next/image';
import TabSlider from 'components/global/tab-slider/TabSlider';
import PDFIcon from 'components/icons/PDF';

import Gallery from 'components/global/carousel/CarouselCurved';

import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

function Shipping(props) {
  const banner = props?.pageData?.banner;
  const heading = props?.pageData?.heading;
  const boxes = props?.pageData?.boxes;
  const license = props?.pageData?.licenseText;
  const licenseImage = props?.pageData?.licenseImage;
  const licensePDF1 = props?.pageData?.licensePDF1?.data?.attributes?.url;
  const licensePDF2 = props?.pageData?.licensePDF2?.data?.attributes?.url;

  const convertMarkdown = useMarkdownToHtml();

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

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
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

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  return (
    <>
      <div className={`${styles.shipping}`}>
        {banner ? <Banner props={banner} center shape="white" /> : null}

        <TabSlider
          className={`${styles.shipping_tabs} desktop-only`}
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
              className={`${styles.shipping_box_item} background-dark observe fade-in`}
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
                  <div
                    className={`${styles.shipping_box_item_text}`}
                    dangerouslySetInnerHTML={{
                      __html: convertMarkdown(item.description),
                    }}
                  ></div>
                ) : null}
              </div>

              {item.image?.data ? (
                <div className={`${styles.shipping_box_item_image}`}>
                  <Gallery props={item.image?.data} singular />
                </div>
              ) : null}
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
              <div
                className={`${styles.shipping_license_text}`}
                dangerouslySetInnerHTML={{ __html: convertMarkdown(license) }}
              ></div>
            ) : null}
          </div>

          <div className={`${styles.shipping_license_right}`}>
            {licenseImage?.data ? (
              <Image
                src={
                  licenseImage.data.attributes?.formats?.large?.url ||
                  licenseImage.data.attributes?.url
                }
                alt={
                  licenseImage.data.attributes?.alternativeText ||
                  'Alpine Armoring'
                }
                width={licenseImage.data.attributes.width}
                height={licenseImage.data.attributes.height}
              ></Image>
            ) : null}

            <div className={`${styles.shipping_license_right_description}`}>
              {/* <p><strong>Form BIS-711</strong></p> */}
              <p>Statement by ultimate consignee & purchaser</p>
            </div>

            <div className={`${styles.shipping_license_downloads}`}>
              {licensePDF1 ? (
                <div
                  onClick={() => togglePDFPopup(licensePDF1)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '10px' }}>
                    <span style={{ fontSize: '18px' }}>Download</span>
                    Form BIS-711
                  </span>
                  <PDFIcon />
                </div>
              ) : null}

              {licensePDF2 ? (
                <div
                  onClick={() => togglePDFPopup(licensePDF2)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '10px' }}>
                    <span style={{ fontSize: '15px' }}>
                      Instructions
                      <br />
                      to complete
                    </span>
                    Form BIS-711
                  </span>
                  <PDFIcon />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <PopupPDF
          isOpen={isPDFPopupOpen}
          onClose={() => togglePDFPopup('')}
          pdfUrl={currentPdfUrl}
        />
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

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default Shipping;
