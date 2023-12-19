// import TextReveal from 'components/global/text-reveal/TextReveal';
import styles from './IntroText.module.scss';

// const IntroText = ({ props, error }) => {
const IntroText = () => {
  return (
    <div className={`${styles.introText} container`}>
      {/* <h3 className={`${styles.introText_subheading} observe animate fade-in-up`}>No one protects you better®</h3> */}

      {/* <h2 className={`${styles.introText_heading} observe animate fade-in-up`}>Alpine Armoring</h2> */}

      {/* <TextReveal text="Alpine" /> */}

      <div className={`${styles.introText_content}`}>
        <p className={`${styles.introText_text} observe animate fade-in-up`}>Alpine Armoring Inc., headquartered in the suburb of Washington D.C., is a high-quality custom-manufacturer of a variety of bulletproof armoured vehicles (armoured sedans, SUVs, pickup trucks, SWAT trucks and more).</p>
        <h3 className={`${styles.introText_subheading} observe animate fade-in-up`}>
          No one protects you better®
        </h3>
      </div>
    </div>
  );
};

export default IntroText;
