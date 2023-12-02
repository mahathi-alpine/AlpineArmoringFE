import styles from './IntroText.module.scss';
import TextReveal from '/components/global/TextReveal';

const IntroText = ({ props, error }) => {
  return (
    <div className={`${styles.introText} container`}>
        {/* <h3 className={`${styles.introText_subheading} observe animate fade-in-up`}>No one protects you better®</h3> */}
        
        <TextReveal text="Alpine Armoring" />
        <p className={`${styles.introText_text} observe animate fade-in-up`}>We offer a wide array of armored vehicles including <a href="">VIP luxury armored sedans</a>, <a href="">SUVs</a>, <a href="">SWAT trucks</a>, <a href="">Riot Control trucks</a>, and <a href="">Cash in-Transit (CIT)</a> vehicles. </p>

        <h3 className={`${styles.introText_subheading}`}>No one protects you better®</h3>
    </div>
  );
};

export default IntroText;