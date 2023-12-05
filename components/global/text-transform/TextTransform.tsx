import React from 'react';
import styles from './TextTransform.module.scss';

export function textTransformAnimate(entry) {
  const leftTexts = entry.querySelector('.textTransform_left');
  const rightTexts = entry.querySelector('.textTransform_right');

  const { bottom } = entry.getBoundingClientRect();
  let textTrans = bottom - window.innerHeight;
  textTrans = textTrans < 0 ? 0 : textTrans;
  leftTexts.style.transform = `translateX(${-textTrans}px)`;
  rightTexts.style.transform = `translateX(${textTrans}px)`;
}

const TextTransform = ({ text1, text2 }) => {
  return (
    <section className={`${styles.textTransform} observe textTransform`}>
      <p className="textTransform_left">{text1}</p>
      <p className="textTransform_right">{text2}</p>
    </section>
  );
};

export default TextTransform;
