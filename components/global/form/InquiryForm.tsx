import styles from './InquiryForm.module.scss';
import Image from 'next/image';
import Form from 'components/global/form/Form';

const InquiryForm = (props) => {
  // console.log(props);
  // return null;
  return (
    <div className={`${styles.inquiry_form_wrap}`} id="request-a-quote">
      <div
        className={`
                ${styles.inquiry_form}
                ${props.plain ? styles.inquiry_form_plain : ''}
            `}
      >
        <div className={`${styles.inquiry_form_inner} container_small`}>
          <div className={`${styles.inquiry_form_left}`}>
            <div className={`${styles.inquiry_form_heading}`}>
              You are inquiring about
              {!props.plain ? ' this ready-to-ship' : null}
              <h4>
                <strong>{props?.title}</strong>
              </h4>
              {!props.plain ? (
                <span>
                  Vehicle ID: <strong>{props?.vehicleID}</strong>
                </span>
              ) : null}
            </div>

            {props?.featuredImage?.data ? (
              <Image
                src={`${props?.featuredImage?.data.attributes.url}`}
                alt={`${props?.featuredImage?.data.attributes.alternativeText}`}
                width={600}
                height={400}
              />
            ) : null}
          </div>

          <Form />
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;
