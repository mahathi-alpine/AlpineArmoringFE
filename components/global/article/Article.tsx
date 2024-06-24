import Link from 'next/link';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import styles from './Article.module.scss';
import React from 'react';

const Article = ({
  props,
  button = false,
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
                  {item.attributes.thumbnail.data?.attributes.url ? (
                    <Link
                      href={`/landing/${item.attributes.slug}`}
                      className={`${styles.article_item_image}`}
                    >
                      <Image
                        src={`${
                          item.attributes.thumbnail.data.attributes.formats
                            ?.medium?.url ||
                          item.attributes.thumbnail.data.attributes.url
                        }`}
                        alt={
                          item.attributes.thumbnail.data.attributes
                            .alternativeText || 'Alpine Armoring'
                        }
                        width={700}
                        height={300}
                        sizes="(max-width: 550px) 100vw, 50vw"
                      />
                    </Link>
                  ) : null}
                  <div className={`${styles.article_item_content}`}>
                    <div className={`${styles.article_item_content_main}`}>
                      <div
                        className={`${styles.article_item_content_main_inner}`}
                      >
                        <Link href={`/landing/${item.attributes.slug}`}>
                          <h3 className={`${styles.article_item_title}`}>
                            {item.attributes.title}
                          </h3>
                        </Link>
                        {item.attributes.excerpt ? (
                          <p className={`${styles.article_item_excerpt}`}>
                            {item.attributes.excerpt}
                          </p>
                        ) : null}
                      </div>
                      <Button
                        href={`/landing/${item.attributes.slug}`}
                        className={`${styles.article_item_button} rounded border desktop-only`}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        {button ? (
          <div className={`${styles.article_button}`}>
            <Button
              href={`/landing`}
              className={`${styles.article_button_link} rounded primary`}
            >
              See All Articles
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Article;
