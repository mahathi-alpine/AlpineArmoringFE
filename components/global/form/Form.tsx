import React, { useState } from 'react';
import styles from './Form.module.scss';
import ChevronIcon from 'components/icons/Chevron';
import Button from 'components/global/button/Button';

const Form = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [message, setMessage] = useState('');

  // const [company, setCompany] = useState("");
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isDropdownActive2, setIsDropdownActive2] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(fullname, email, phone, company, message, mobile);

    // Perform validation here...

    // const res = await fetch('/api/sendgrid', {
    //   body: JSON.stringify({
    //     email: email,
    //     fullname: fullname,
    //     phone: phone,
    //     company: company,
    //     message: message,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    // });

    // const { error } = await res.json();
    // if (error) {
    //   console.log(error);
    //   return;
    // }
  };
  return (
    <form className={`${styles.form}`} onSubmit={handleSubmit}>
      <input
        type="text"
        id="fullname"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        placeholder="Full Name"
        className={`${styles.form_input}`}
      />

      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className={`${styles.form_input}`}
      />

      <input
        type="tel"
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        className={`${styles.form_input}`}
      />

      <input
        type="tel"
        id="mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Mobile Number"
        className={`${styles.form_input}`}
      />

      <div
        className={`${styles.form_select} ${styles.form_input}`}
        onClick={() => setIsDropdownActive(!isDropdownActive)}
      >
        <button className={`${styles.form_select_selected}`}>
          <span>{company || 'Company'}</span>
          <ChevronIcon />
        </button>

        <div
          className={`${styles.form_select_list} ${
            isDropdownActive ? styles.form_select_list_active : ''
          }`}
        >
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setCompany('Private Government');
              setIsDropdownActive(false);
            }}
          >
            Private government
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setCompany('US governmental agencies');
              setIsDropdownActive(false);
            }}
          >
            US governmental agencies
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setCompany('Foreign governmental agencies');
              setIsDropdownActive(false);
            }}
          >
            Foreign governmental agencies
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setCompany('Private sector');
              setIsDropdownActive(false);
            }}
          >
            Private sector
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setCompany('Individual');
              setIsDropdownActive(false);
            }}
          >
            Individual
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setCompany('Nonprofit');
              setIsDropdownActive(false);
            }}
          >
            Nonprofit
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setCompany('NGO');
              setIsDropdownActive(false);
            }}
          >
            NGO
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setCompany('Other');
              setIsDropdownActive(false);
            }}
          >
            Other
          </button>
        </div>
      </div>

      <div
        className={`${styles.form_select} ${styles.form_input}`}
        onClick={() => setIsDropdownActive2(!isDropdownActive2)}
      >
        <button className={`${styles.form_select_selected}`}>
          <span>{inquiry || 'Your Inquiry'}</span>
          <ChevronIcon />
        </button>

        <div
          className={`${styles.form_select_list} ${
            isDropdownActive2 ? styles.form_select_list_active : ''
          }`}
        >
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('SUVs & Sedans');
              setIsDropdownActive2(false);
            }}
          >
            SUVs & Sedans
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('SWAT & APC Trucks');
              setIsDropdownActive2(false);
            }}
          >
            SWAT & APC Trucks
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('Riot/Water Cannon Crowd Control');
              setIsDropdownActive2(false);
            }}
          >
            Riot/Water Cannon Crowd Control
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('CIT Vans & Trucks');
              setIsDropdownActive2(false);
            }}
          >
            CIT Vans & Trucks
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('Rental Vehicles');
              setIsDropdownActive2(false);
            }}
          >
            Rental Vehicles
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('Parts & Accessories');
              setIsDropdownActive2(false);
            }}
          >
            Parts & Accessories
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('Warranty Related');
              setIsDropdownActive2(false);
            }}
          >
            Warranty Related
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('Interested in Becoming a Dealer');
              setIsDropdownActive2(false);
            }}
          >
            Interested in Becoming a Dealer
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('Employment Opportunity');
              setIsDropdownActive2(false);
            }}
          >
            Employment Opportunity
          </button>
          <button
            className={`${styles.form_select_option}`}
            onClick={() => {
              setInquiry('Other');
              setIsDropdownActive2(false);
            }}
          >
            Other
          </button>
        </div>
      </div>

      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={7}
        placeholder="Message"
        className={`${styles.form_input} ${styles.form_textarea}`}
      />

      <Button button={true} className={`primary rounded`}>
        Send message
      </Button>
    </form>
  );
};

export default Form;
