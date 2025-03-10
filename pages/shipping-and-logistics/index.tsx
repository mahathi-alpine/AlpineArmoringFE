import { useEffect, useState } from 'react';
import { getPageData } from 'hooks/api';
import styles from './Shipping.module.scss';
import routes from 'routes';
import useLocale from 'hooks/useLocale';
import Banner from 'components/global/banner/Banner';
import Image from 'next/image';
import TabSlider from 'components/global/tab-slider/TabSlider';

import Gallery from 'components/global/carousel/CarouselCurved';

import CustomMarkdown from 'components/CustomMarkdown';

import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

function Shipping(props) {
  const { lang } = useLocale();
  const banner = props?.pageData?.banner;
  const heading = props?.pageData?.heading;
  const boxes = props?.pageData?.boxes;
  const license = props?.pageData?.licenseText;
  const licenseImage = props?.pageData?.licenseImage;
  const licensePDF1 = props?.pageData?.licensePDF1?.data?.attributes;
  const licensePDF2 = props?.pageData?.licensePDF2?.data?.attributes;

  const tabSliderData = [
    {
      id: 0,
      titleNav: lang.groundShipping2,
    },
    {
      id: 1,
      titleNav: lang.oceanShipping2,
    },
    {
      id: 2,
      titleNav: lang.airCargoShipping2,
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
        {banner ? <Banner props={banner} shape="white" /> : null}

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
            <CustomMarkdown>{heading}</CustomMarkdown>
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
                  <h2 className={`${styles.shipping_box_item_title}`}>
                    {item.title}
                  </h2>
                ) : null}

                {item.description ? (
                  <div className={`${styles.shipping_box_item_text}`}>
                    <CustomMarkdown>{item.description}</CustomMarkdown>
                  </div>
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
              {lang.exportLicenseGuidelines}
            </h2>

            {license ? (
              <div className={`${styles.shipping_license_text}`}>
                <CustomMarkdown>{license}</CustomMarkdown>
              </div>
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
              <p>{lang.statementConsignee}</p>
            </div>

            <div className={`${styles.shipping_license_downloads}`}>
              {licensePDF1 ? (
                <div
                  onClick={() => togglePDFPopup(licensePDF1)}
                  className={`${styles.certificate_container}`}
                >
                  <span className={`${styles.certificate_text}`}>
                    <span className={`${styles.view_certificates}`}>
                      {lang.download}
                    </span>
                    {lang.form} BIS-711
                  </span>
                  <div className={`${styles.icon}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        stroke="currentColor"
                      ></circle>
                      <path
                        stroke="currentColor"
                        d="M7.714 12.286 12 8m0 0H7m5 0v5"
                      ></path>
                    </svg>
                  </div>
                </div>
              ) : null}

              {licensePDF2 ? (
                <div
                  onClick={() => togglePDFPopup(licensePDF2)}
                  className={`${styles.certificate_container}`}
                >
                  <span className={`${styles.certificate_text}`}>
                    <span
                      className={`${styles.view_certificates}`}
                      style={{ fontSize: '15px' }}
                    >
                      {lang.instructions}
                      <br />
                      {lang.toComplete}
                    </span>
                    {lang.form} BIS-711
                  </span>
                  <div className={`${styles.icon}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        stroke="currentColor"
                      ></circle>
                      <path
                        stroke="currentColor"
                        d="M7.714 12.286 12 8m0 0H7m5 0v5"
                      ></path>
                    </svg>
                  </div>
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

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.shippingAndLogistics;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData.data?.attributes || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, seoData, locale },
  };
}

export default Shipping;
