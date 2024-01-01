import styles from './Contact.module.scss';
import { useEffect } from 'react';

function Contact() {
  useEffect(() => {
    document.body.classList.add('contact');
    return () => {
      document.body.classList.remove('contact');
    };
  }, []);

  return (
    <div className={`${styles.contact} container`}>
      <div className={`${styles.contact} banner-curved`}></div>
    </div>
  );
}

export default Contact;
