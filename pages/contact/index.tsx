import styles from './Contact.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import Banner from 'components/global/banner/Banner';
import Form from 'components/global/form/Form';
import Accordion from 'components/global/accordion/Accordion';

function Contact(props) {
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

  const faq = [
    { title: 'What do people mean by armored vehicles?', content: 'Content 1' },
    {
      title: 'How do I know what protection level I need?',
      content: 'Content 2',
    },
    {
      title: 'What countries are right hand drive (rhd)?',
      content: 'Content 3',
    },
    {
      title:
        'What do low profile design (lpd) and high profile design (hpd) mean?',
      content: 'Content 3',
    },
    {
      title: 'How much armored weight is usually added to these vehicles?',
      content: 'Content 3',
    },
    {
      title:
        'Are the suspension & brakes upgraded to allow for the extra weight?',
      content: 'Content 3',
    },
  ];

  return (
    <div className={`${styles.contact}`}>
      {props.pageData?.banner ? (
        <Banner props={props.pageData.banner} center shape="white" />
      ) : null}
      <div className={`${styles.contact_main} container_small`}>
        <div className={`${styles.contact_main_left}`}>
          {/* {props.pageData?.formTitle ? (
            <h2 className={`${styles.contact_main_left_title}`}>
              {props.pageData.formTitle}
            </h2>
          ) : null}
          {props.pageData?.formDescription ? (
            <Markdown className={`${styles.contact_main_left_description}`}>
              {props.pageData.formDescription}
            </Markdown>
          ) : null} */}

          <Form />
        </div>
        <div className={`${styles.contact_main_right}`}>
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
      </div>
      <Accordion items={faq} title="Frequently asked questions" />;
    </div>
  );
}

export async function getServerSideProps() {
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
