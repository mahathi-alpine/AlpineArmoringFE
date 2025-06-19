import styles from './Accordion.module.scss';
import React, { useState, useRef } from 'react';
import useLocale from 'hooks/useLocale';
import Button from 'components/global/button/Button';
import CustomMarkdown from 'components/CustomMarkdown';

const Accordion = ({ items, title = '', button = false }) => {
  const { lang } = useLocale();
  // Create an array of refs, one for each item
  const contentRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(null);

  const handleTitleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`${styles.accordion} container_small`}>
      {title ? <h2 className={`${styles.accordion_title}`}>{title}</h2> : null}

      {items.map((item, index) => (
        <div key={index} className={`${styles.accordion_item}`}>
          <div
            className={`${styles.accordion_item_heading}`}
            onClick={() => handleTitleClick(index)}
          >
            <div
              className={`
              ${styles.accordion_item_heading_title}
              ${
                activeIndex === index
                  ? styles['accordion_item_heading_title--active']
                  : ''
              }
            `}
            >
              {item.attributes?.title || item?.title}
            </div>

            <div
              className={`${styles.accordion_icon} ${
                activeIndex === index ? styles['accordion_icon--open'] : ''
              }`}
            ></div>
          </div>

          {item.attributes?.text || item?.text ? (
            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className={`${styles.accordion_item_content}`}
              style={{
                maxHeight:
                  activeIndex === index
                    ? `${contentRefs.current[index]?.scrollHeight}px`
                    : '0',
              }}
            >
              <div className={`${styles.accordion_item_content_text}`}>
                <CustomMarkdown>
                  {item.attributes?.text || item?.text}
                </CustomMarkdown>
              </div>
            </div>
          ) : null}
        </div>
      ))}

      {button ? (
        <div className={`${styles.accordion_button} center`}>
          <Button href={lang.faqsURL} className={`primary rounded`}>
            {lang.moreFAQ}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Accordion;
