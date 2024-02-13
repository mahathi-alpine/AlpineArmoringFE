import styles from './InquiryForm.module.scss';
// import Image from 'next/image';
// import Form from 'components/global/form/Form';

const InquiryForm = (props) => {
  console.log(props);
  return (
    <div className={`${styles.inquiry_form_wrap}`} id="request-a-quote"></div>
  );
};

export default InquiryForm;
