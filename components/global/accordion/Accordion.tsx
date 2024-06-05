import styles from './Accordion.module.scss';
import React, { useState } from 'react';
import Button from 'components/global/button/Button';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

const Accordion = ({ items, title = '', button = false }) => {
  const convertMarkdown = useMarkdownToHtml();
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
            <div className={`${styles.accordion_item_heading_title}`}>
              {item.attributes?.title}
            </div>

            <div
              className={`${styles.accordion_icon} ${
                activeIndex === index ? styles['accordion_icon--open'] : ''
              }`}
            ></div>
          </div>

          {item.attributes?.text ? (
            <div
              style={{
                maxHeight: activeIndex === index ? '300px' : '0',
              }}
              className={`${styles.accordion_item_content}`}
            >
              <div
                className={`${styles.accordion_item_content_text}`}
                dangerouslySetInnerHTML={{
                  __html: convertMarkdown(item.attributes?.text),
                }}
              ></div>
            </div>
          ) : null}
        </div>
      ))}

      {button ? (
        <div className={`${styles.accordion_button} center`}>
          <Button href="/faqs" className={`primary rounded`}>
            More FAQ
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Accordion;
