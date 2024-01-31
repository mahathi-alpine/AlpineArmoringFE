import styles from './Accordion.module.scss';
import React, { useState } from 'react';

const Accordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleTitleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`${styles.accordion} container_small`}>
      {items.map((item, index) => (
        <div key={index} className={`${styles.accordion_item}`}>
          <div
            className={`${styles.accordion_item_heading}`}
            onClick={() => handleTitleClick(index)}
          >
            {item.title}

            <div
              className={`${styles.accordion_button} ${
                activeIndex === index ? styles['accordion_button--open'] : ''
              }`}
            ></div>
          </div>

          <div
            style={{
              maxHeight: activeIndex === index ? '100%' : '0',
            }}
            className={`${styles.accordion_item_content}`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
