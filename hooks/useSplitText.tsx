import { useEffect } from 'react';

function useSplitText() {
  useEffect(() => {
    const targets = document.querySelectorAll('.splitLetters');

    targets.forEach((target) => {
      const delay = parseInt(
        (target as HTMLElement).dataset.splitDelay || '25',
        10
      );
      const duration = parseInt(
        (target as HTMLElement).dataset.splitDuration || '500',
        10
      );
      let charDelay = 0;

      target.innerHTML = target.textContent.replace(
        /[\w-]+/g,
        (word) =>
          '<span className="splitLettersWord">' +
          word.replace(/./g, (char) => {
            const style = `transition-delay: ${charDelay}ms; transition-duration: ${duration}ms;`;
            charDelay += delay;
            return `<span style="${style}">${char}</span>`;
          }) +
          '</span>'
      );
    });
  }, []);
}

export default useSplitText;
