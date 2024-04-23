import styles from './InquiryForm.module.scss';
import Image from 'next/image';
import Form from 'components/global/form/Form';

const InquiryForm = (props) => {
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
              <p>
                <strong
                  dangerouslySetInnerHTML={{
                    __html: props?.title,
                  }}
                ></strong>
              </p>
              {!props.plain ? (
                <span>
                  Vehicle ID: <strong>{props?.vehicleID}</strong>
                </span>
              ) : null}
            </div>

            {props?.featuredImage?.data ? (
              <Image
                src={
                  props.plain
                    ? props?.featuredImage?.data.attributes.formats?.medium
                        .url || props?.featuredImage?.data.attributes.url
                    : props?.featuredImage?.data.attributes.formats?.thumbnail
                        .url || props?.featuredImage?.data.attributes.url
                }
                alt={
                  props?.featuredImage?.data.attributes.alternativeText ||
                  'Alpine Armoring'
                }
                width={
                  props.plain
                    ? props?.featuredImage?.data.attributes.formats?.medium
                        .width
                    : props?.featuredImage?.data.attributes.formats?.thumbnail
                        .width
                }
                height={
                  props.plain
                    ? props?.featuredImage?.data.attributes.formats?.medium
                        .height
                    : props?.featuredImage?.data.attributes.formats?.thumbnail
                        .height
                }
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
