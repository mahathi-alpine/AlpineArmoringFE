import styles from './Contact.module.scss';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Form from 'components/global/form/Form';
import Markdown from 'markdown-to-jsx';
// import { useEffect } from 'react';

function Contact(props) {
  // const
  // console.log(props)
  // return null;

  return (
    <div className={`${styles.contact}`}>
      {props.pageData?.banner ? (
        <>
          <Banner props={props.pageData.banner} />
          <div className="shape-before shape-before-white"></div>
        </>
      ) : null}

      <div className={`${styles.contact_main} container_small`}>
        <div className={`${styles.contact_main_left}`}>
          {props.pageData?.formTitle ? (
            <h2 className={`${styles.contact_main_left_title}`}>
              {props.pageData.formTitle}
            </h2>
          ) : null}
          {props.pageData?.formDescription ? (
            <Markdown className={`${styles.contact_main_left_description}`}>
              {props.pageData.formDescription}
            </Markdown>
          ) : null}
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
