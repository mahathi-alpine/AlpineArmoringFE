import React, { useState } from 'react';
import styles from './Form.module.scss';

const Form = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation here...

    const res = await fetch('/api/sendgrid', {
      body: JSON.stringify({
        email: email,
        fullname: fullname,
        phone: phone,
        company: company,
        message: message,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const { error } = await res.json();
    if (error) {
      console.log(error);
      return;
    }
    console.log(fullname, email, phone, company, message);
  };
  return (
    <form className={`${styles.form}`} onSubmit={handleSubmit}>
      <label htmlFor="fullname">Full Name</label>
      <input
        type="text"
        id="fullname"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="phone">Phone</label>
      <input
        type="tel"
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label htmlFor="company">Company</label>
      <select
        id="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      >
        <option value="">Select a company</option>
        {/* Add your company options here */}
      </select>

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
