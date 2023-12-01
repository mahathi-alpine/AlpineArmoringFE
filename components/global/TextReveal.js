import styles from './TextReveal.module.scss';
import Script from 'next/script';
import { useEffect } from 'react';

const TextReveal = ({text}) => {
  useEffect(() => {     
    const textReveals = [...document.querySelectorAll('.text_reveal')];
      
    textReveals.forEach(text => {
      let string = text.innerText;
      let html = '';
      for(let i = 0; i < string.length; i++){
        html += `<span>${string[i]}</span>`;
      }
      text.innerHTML = html;
    })

    const observer = new IntersectionObserver(
     (entries) => {
       entries.forEach((entry) => {
         if (entry.isIntersecting) {
          [...entry.target.querySelectorAll('span')].forEach((span, idx) => {
            setTimeout(() => {
              span.style.transform = `translateY(0)`;
            }, (idx+1) * 50)
          })          
         }
       });
     }
    );
   
    textReveals.forEach(text => observer.observe(text));
   
    // Clean up the observer when the component unmounts
    return () => {
      textReveals.forEach(text => observer.unobserve(text));
      observer.disconnect();
    };
   }, []);


  return (   
    <section className={`${styles.textReveal}`}>
      <h2 className={`${styles.textReveal_text} text_reveal`}>{ text }</h2>
    </section>
  );
};

export default TextReveal;