import styles from './LandingInquiryForm.module.scss';
import Form from 'components/global/form/Form';

const LandingInquiryForm = (props) => {
  return (
    <div
      className={`${styles.inquiry_form_wrap} ${styles.inquiry_form_wrap_locations} inquiryFormContainer observe`}
      id="request-a-quote"
    >
      <div
        className={`
                ${styles.inquiry_form}
                ${props.plain ? styles.inquiry_form_plain : ''}
            `}
      >
        <div className={`shapeCurved_leftBottom shapeCurved`}></div>
        <div className={`${styles.inquiry_form_heading}`}>
          <span>
            <strong>FOR MORE INFORMATION, PLEASE COMPLETE THIS FORM:</strong>
          </span>
        </div>
        <div className={`${styles.inquiry_form_inner} container_small`}>
          <Form />
        </div>

        <div className={`shapeCurved_rightBottom shapeCurved`}></div>
      </div>
    </div>
  );
};

export default LandingInquiryForm;
