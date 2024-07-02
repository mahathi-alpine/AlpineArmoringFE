import styles from './InquiryForm.module.scss';
import Form from 'components/global/form/Form';

const LandingInquiryForm = (props) => {
  return (
    <div
      className={`${styles.inquiry_form_wrap} inquiryFormContainer observe`}
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
            <strong>FOR MORE INFORMATION:</strong>
          </span>
          <br />
          <br />
          Call +1 (703) 471-0002 or complete the form below
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
