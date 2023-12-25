import styles from './IntroText.module.scss';
import { useRef } from 'react';
import useEffectOnce from 'hooks/useEffectOnce';

const IntroText = () => {
  const introTextRef = useRef(null);

  useEffectOnce(() => {
    let spans = [];
    let htmlString = '';
    const pArray = introTextRef.current.textContent.split('');
    for (let i = 0; i < pArray.length; i++) {
      htmlString += `<span>${pArray[i]}</span>`;
    }
    introTextRef.current.innerHTML = htmlString;

    spans = [...introTextRef.current.querySelectorAll('span')];

    function revealSpans() {
      for (let i = 0; i < spans.length; i++) {
        const left = spans[i].getBoundingClientRect().left;
        let top = spans[i].getBoundingClientRect().top;
        top = top - window.innerHeight * 0.7;
        let opacityValue =
          1 - (top * 0.01 + left * 0.001) < 0.1
            ? 0.1
            : Number((1 - (top * 0.01 + left * 0.001)).toFixed(3));
        opacityValue = opacityValue > 1 ? 1 : Number(opacityValue.toFixed(3));
        spans[i].style.opacity = opacityValue;
      }
    }

    window.addEventListener('scroll', () => {
      if (introTextRef.current) {
        if (
          introTextRef.current.getBoundingClientRect().top <
            window.innerHeight / 2 + 300 &&
          !(
            window.scrollY >
            introTextRef.current.offsetTop + introTextRef.current.offsetHeight
          )
        ) {
          revealSpans();
        }
      }
    });
  });

  return (
    <div className={`${styles.introText} notranslate container`}>
      {/* <TextReveal text="Alpine" /> */}

      <div className={`${styles.introText_content}`}>
        <p className={`${styles.introText_text} observe`} ref={introTextRef}>
          Alpine Armoring Inc., headquartered in the suburb of Washington D.C.,
          is a high-quality custom-manufacturer of a variety of bulletproof
          armoured vehicles (armoured sedans, SUVs, pickup trucks, SWAT trucks
          and more).
        </p>
        <h3 className={`${styles.introText_subheading} observe block-reveal`}>
          No one protects you better®
        </h3>
      </div>
    </div>
  );
};

export default IntroText;
