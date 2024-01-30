import React, { useState } from 'react';
import styles from './Form.module.scss';
import Button from 'components/global/button/Button';
import Dropdown from 'components/global/form/Dropdown';

const Form = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [country, setCountry] = useState('');
  const [preferredContact, setPreferredContact] = useState('');
  const [message, setMessage] = useState('');

  const [isCompanyDropdownActive, setIsCompanyDropdownActive] = useState(false);
  const [isInquiryDropdownActive, setIsInquiryDropdownActive] = useState(false);
  const [
    isPreferredContactDropdownActive,
    setIsPreferredContactDropdownActive,
  ] = useState(false);
  const [isCountryDropdownActive, setIsCountryDropdownActive] = useState(false);

  const countryOptions = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo, Democratic Republic of',
    'Congo, Republic of',
    'Costa Rica',
    "Côte d'Ivoire",
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(fullname, email, phone, company, message, mobile);

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
        placeholder="Full Name*"
        className={`${styles.form_input}`}
      />

      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email*"
        className={`${styles.form_input}`}
      />

      <input
        type="tel"
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number*"
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

      <Dropdown
        label="Company"
        options={[
          'Private Government',
          'US governmental agencies',
          'Foreign governmental agencies',
          'Private sector',
          'Individual',
          'Nonprofit',
          'NGO',
          'Other',
        ]}
        selectedOption={company}
        setSelectedOption={setCompany}
        isActive={isCompanyDropdownActive}
        setIsActive={setIsCompanyDropdownActive}
      />

      <Dropdown
        label="Inquiry"
        options={[
          'SUVs & Sedans',
          'SWAT & APC Trucks',
          'Riot/Water Cannon Crowd Control',
          'CIT Vans & Trucks',
          'Rental Vehicles',
          'Parts & Accessories',
          'Warranty Related',
          'Interested in Becoming a Dealer',
          'Employment Opportunity',
          'Other',
        ]}
        selectedOption={inquiry}
        setSelectedOption={setInquiry}
        isActive={isInquiryDropdownActive}
        setIsActive={setIsInquiryDropdownActive}
      />

      <Dropdown
        label="I prefer to be contacted via"
        options={['Mobile', 'Landline', 'Email', 'Text', 'Whatsapp']}
        selectedOption={preferredContact}
        setSelectedOption={setPreferredContact}
        isActive={isPreferredContactDropdownActive}
        setIsActive={setIsPreferredContactDropdownActive}
      />

      <Dropdown
        label="Country"
        options={countryOptions}
        selectedOption={country}
        setSelectedOption={setCountry}
        isActive={isCountryDropdownActive}
        setIsActive={setIsCountryDropdownActive}
      />

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
