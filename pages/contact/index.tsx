import styles from './Contact.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import Banner from 'components/global/banner/Banner';
import Form from 'components/global/form/Form';
import Accordion from 'components/global/accordion/Accordion';
import Seo from 'components/Seo';
import Image from 'next/image';

function Contact(props) {
  const seoData = props.pageData?.seo;
  const faqs = props?.pageData?.fa_qs;

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
                  <Markdown>{props.pageData.salesInfo}</Markdown>
                ) : null}
              </div>
              <div className={`${styles.contact_main_right_column}`}>
                <h3 className={`${styles.contact_main_right_title}`}>
                  Parts & Service
                </h3>
                {props.pageData?.partsInfo ? (
                  <Markdown>{props.pageData.partsInfo}</Markdown>
                ) : null}
              </div>
            </div>

            <div className={styles.contact_map}>
              <Image
                src="/assets/alpineArmoringMap.jpg"
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

  return {
    props: { pageData },
  };
}

export default Contact;
