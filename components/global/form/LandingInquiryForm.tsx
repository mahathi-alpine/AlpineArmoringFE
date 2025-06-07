import styles from './LandingInquiryForm.module.scss';
import Form from 'components/global/form/Form';
import useLocale from 'hooks/useLocale';

const LandingInquiryForm = () => {
  const { lang } = useLocale();

  return (
    <div className={`${styles.inquiry_form_wrap}`}>
      <div className={`${styles.inquiry_form}`}>
        <div className={`${styles.inquiry_form_heading}`}>
          {lang.moreInformationForm}
        </div>

        <div className={`${styles.inquiry_form_inner}`}>
          <Form />
        </div>
      </div>
    </div>
  );
};

export default LandingInquiryForm;
