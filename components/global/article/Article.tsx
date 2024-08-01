import Link from 'next/link';
import styles from './Article.module.scss';
import React from 'react';
// import { wrap } from 'module';
import Image from 'next/image';

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
          </div>
        ) : null}

        <div>
          {(limit ? props.slice(0, limit) : props).map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div
                  className={`
                    observe fade-in-up                
                  `}
                  style={{ display: 'inline-grid' }}
                  key={index}
                >
                  <ul
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: '1.125rem',
                      listStyle: 'none',
                      padding: '0',
                      margin: '0',
                    }}
                  >
                    <li
                      style={{
                        padding: '0.5625rem',
                      }}
                    >
                      <Link
                        style={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '2rem',
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          boxShadow: '0 4px 30px 0 #e8e5e2',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.5s ease-in-out',
                        }}
                        href={`/countries-we-service/${item.attributes.slug}`}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.boxShadow =
                            '0 4px 30px 0 #afafae')
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.boxShadow =
                            '0 4px 30px 0 #e8e5e2')
                        }
                      >
                        <div
                          style={{
                            order: '-1',
                            minHeight: '1px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            // margin: '0 0 1.5rem'
                          }}
                        >
                          {item.attributes.region}
                        </div>
                        <div style={{ margin: '0.75rem 0' }}>
                          <div style={{}}>
                            <Image
                              src={`/assets/countries/${item.attributes.excerpt
                                .toLowerCase()
                                .replace(/\s+/g, '-')}.png`}
                              alt={item.attributes.excerpt}
                              width={45}
                              height={26}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            color: '#00205b',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            flexGrow: 1, // Allow this section to fill the remaining space
                          }}
                        >
                          <h2
                            style={{
                              color: '#00205b',
                              fontSize: '1.25rem',
                              fontWeight: '700',
                              margin: '0',
                              position: 'relative',
                            }}
                          >
                            {item.attributes.excerpt}
                          </h2>
                        </div>
                      </Link>
                    </li>
                  </ul>
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
