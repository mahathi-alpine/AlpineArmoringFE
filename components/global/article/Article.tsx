import Link from 'next/link';
import styles from './Article.module.scss';
import React from 'react';

const Article = ({
  props,
  limit = '',
  plain = false,
  title = '',
  subtitle = '',
  featured = false,
}) => {
  return (
    <div
      className={`
      ${styles.article}
      ${plain ? styles.article_plain : ''}  
      ${featured ? styles.article_featured : ''}       
    `}
    >
      <div className={`${styles.article_inner} container_small`}>
        {subtitle || title ? (
          <div className={`${styles.article_heading}`}>
            {subtitle ? (
              <h3
                className={`${styles.article_heading_secondary} block-reveal observe`}
              >
                {subtitle}
              </h3>
            ) : null}

            {title ? (
              <h2
                className={`${styles.article_heading_primary} observe fade-in-up`}
              >
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}

        <div className={`${styles.article_list}`}>
          {(limit ? props.slice(0, limit) : props).map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div
                  className={`
                    ${styles.article_item} 
                    observe fade-in-up
                    ${
                      (index === 0 || index === 1) && featured
                        ? styles.landing_item_featured
                        : ''
                    }                
                  `}
                  key={index}
                >
                  <div className={`${styles.article_item_content}`}>
                    <div className={`${styles.article_item_content_main}`}>
                      <div
                        className={`${styles.article_item_content_main_inner}`}
                      >
                        <Link
                          href={`/countries-we-service/${item.attributes.slug}`}
                        >
                          <h3 className={`${styles.article_item_title}`}>
                            {item.attributes.excerpt}
                          </h3>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Article;
