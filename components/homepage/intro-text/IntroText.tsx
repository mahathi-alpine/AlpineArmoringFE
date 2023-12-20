import styles from './IntroText.module.scss';
import { useEffect, useRef} from 'react';

const IntroText = () => {
  const introTextRef = useRef(null);

  useEffect(() => {
    let spans = [];
    let htmlString = '';
    const pArray = introTextRef.current.textContent.split('');
    for(let i = 0; i < pArray.length; i++){
      htmlString += `<span>${pArray[i]}</span>`;
    }
    introTextRef.current.innerHTML = htmlString;

    spans = [...introTextRef.current.querySelectorAll('span')];

    function revealSpans(){
      for(let i = 0; i < spans.length; i++){
        const left = spans[i].getBoundingClientRect();
        let top = spans[i].getBoundingClientRect();
        top = top - (window.innerHeight * .7);
        let opacityValue = 1 - ((top * .01) + (left * 0.001)) < 0.1 ? 0.1 : Number((1 - ((top * .01) + (left * 0.001))).toFixed(3));
        opacityValue = opacityValue > 1 ? 1 : Number(opacityValue.toFixed(3));
        spans[i].style.opacity = opacityValue;
      }
    }

    window.addEventListener('scroll', () => {
      if(introTextRef.current.getBoundingClientRect().top < (window.innerHeight / 2 + 300) && 
      !(window.scrollY > (introTextRef.current.offsetTop + introTextRef.current.offsetHeight))){
        revealSpans();
      }
    })

  })

  return (
    <div className={`${styles.introText} container`}>
      {/* <TextReveal text="Alpine" /> */}

      <div className={`${styles.introText_content}`}>
        <p 
          className={`${styles.introText_text} observe`} 
          ref={introTextRef}
        >Alpine Armoring Inc., headquartered in the suburb of Washington D.C., is a high-quality custom-manufacturer of a variety of bulletproof armoured vehicles (armoured sedans, SUVs, pickup trucks, SWAT trucks and more).</p>
        <h3 className={`${styles.introText_subheading} observe`}>
          No one protects you better®
        </h3>
      </div>
    </div>
  );
};

export default IntroText;
