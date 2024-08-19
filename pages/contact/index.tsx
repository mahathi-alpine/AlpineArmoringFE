import styles from './Contact.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Banner from 'components/global/banner/Banner';
import Form from 'components/global/form/Form';
import Accordion from 'components/global/accordion/Accordion';
import Image from 'next/image';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

function Contact(props) {
  const faqs = props?.pageData?.fa_qs;

  const convertMarkdown = useMarkdownToHtml();

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

  return (
    <>
      <div className={`${styles.contact}`}>
        {props.pageData?.banner ? (
          <Banner props={props.pageData.banner} center shape="white" />
        ) : null}
        <div className={`${styles.contact_main} container_small`}>
          <div className={`${styles.contact_main_left}`}>
            <Form />
          </div>

          <div className={`${styles.contact_main_right}`}>
            <div className={`${styles.contact_main_right_boxes}`}>
              <div className={`${styles.contact_main_right_column}`}>
                <h3 className={`${styles.contact_main_right_title}`}>
                  Sales Inquiries
                </h3>
                {props.pageData?.salesInfo ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: convertMarkdown(props.pageData.salesInfo),
                    }}
                  ></div>
                ) : null}
              </div>
              <div className={`${styles.contact_main_right_column}`}>
                <h3 className={`${styles.contact_main_right_title}`}>
                  Parts, Service &<br /> Warranty
                </h3>
                {props.pageData?.partsInfo ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: convertMarkdown(props.pageData.partsInfo),
                    }}
                  ></div>
                ) : null}
              </div>
            </div>

            <div className={styles.contact_map}>
              <Image
                src="/assets/alpineLocations.png"
                alt={'Alpine Armoring Location'}
                fill
              />
            </div>
          </div>
        </div>

        {faqs?.data ? (
          <Accordion
            items={faqs.data}
            title="Frequently asked questions"
            button
          />
        ) : null}
      </div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'contact-page',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const seoData = pageData?.seo ?? null;

  return {
    props: { pageData, seoData },
  };
}

export default Contact;
