import styles from './Contact.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import Banner from 'components/global/banner/Banner';
import Form from 'components/global/form/Form';
import Link from 'next/link';
import Accordion from 'components/global/accordion/Accordion';
import Seo from 'components/Seo';
import Image from 'next/image';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Contact(props) {
  const seoData = props.pageData?.seo;
  const faqs = props?.pageData?.fa_qs;

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => observerRef.current.observe(item));

    return () => {
      targets.forEach((item) => observerRef.current.unobserve(item));
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

            <Link
              href="https://maps.app.goo.gl/H49yxzm1B3ZMRqLbA"
              className={styles.contact_map}
              target="_blank"
            >
              <Image
                src="/assets/alpineArmoringMap.jpg"
                alt={'Alpine Armoring Location'}
                fill
              />
            </Link>
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
