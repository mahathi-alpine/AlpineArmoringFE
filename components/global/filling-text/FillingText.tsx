import styles from './FillingText.module.scss';
import { useRef } from 'react';
import useEffectOnce from 'hooks/useEffectOnce';

const FillingText = ({ data, dark = false }) => {
  // console.log(data)
  // return null;
  const fillingTextRef = useRef(null);

  const title = data.title;
  const text = data.text || data;

  useEffectOnce(() => {
    let spans = [];
    let htmlString = '';
    const pArray = fillingTextRef.current?.textContent.split('');

    if (pArray) {
      for (let i = 0; i < pArray.length; i++) {
        htmlString += `<span>${pArray[i]}</span>`;
      }
      fillingTextRef.current.innerHTML = htmlString;

      spans = [...fillingTextRef.current.querySelectorAll('span')];
    }

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
      if (fillingTextRef.current) {
        if (
          fillingTextRef.current.getBoundingClientRect().top <
            window.innerHeight / 2 + 300 &&
          !(
            window.scrollY >
            fillingTextRef.current.offsetTop +
              fillingTextRef.current.offsetHeight
          )
        ) {
          revealSpans();
        }
      }
    });
  });

  return (
    <div
      className={`
      ${styles.fillingText} notranslate container
      ${dark ? styles.fillingText_dark : ''}

    `}
    >
      <div className={`${styles.fillingText_content}`}>
        {title ? (
          <h3
            className={`${styles.fillingText_subheading} observe block-reveal`}
          >
            <span dangerouslySetInnerHTML={{ __html: title }}></span>
          </h3>
        ) : null}

        {text ? (
          <p
            className={`${styles.fillingText_text} observe`}
            dangerouslySetInnerHTML={{ __html: text }}
            ref={fillingTextRef}
          ></p>
        ) : null}
      </div>
    </div>
  );
};

export default FillingText;
