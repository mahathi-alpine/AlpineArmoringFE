import TextReveal from 'components/global/text-reveal/TextReveal';
import styles from './IntroText.module.scss';

// const IntroText = ({ props, error }) => {
const IntroText = () => {
  return (
    <div className={`${styles.introText} container`}>
      {/* <h3 className={`${styles.introText_subheading} observe animate fade-in-up`}>No one protects you better®</h3> */}

      <h3 className={`${styles.introText_subheading}`}>
        No one protects you better®
      </h3>

      <h2 className={`${styles.introText_heading} observe animate fade-in-up`}>Alpine Armoring</h2>

      {/* <TextReveal text="Alpine" /> */}

      <div className={`${styles.introText_content}`}>
        <p className={`${styles.introText_text} observe animate fade-in-up`}>Alpine Armoring Inc., headquartered in the suburb of Washington D.C., is a high-quality custom-manufacturer of a variety of bulletproof armoured vehicles (<a href="">armoured sedans</a>, <a href="">SUVs</a>, <a href="">pickup trucks</a>, <a href="">SWAT trucks</a> and more).</p>
        <p className={`${styles.introText_text} observe animate fade-in-up`}>Having served our clients (the private sector, commercial and governmental agencies in US and worldwide) for over 30 years, we frequently conduct rigorous <a href="">ballistic testing</a> on our vehicles including providing certifications from European and United States government.</p>
      </div>
    </div>
  );
};

export default IntroText;
