import Link from 'next/link';
import styles from './Article.module.scss';
import React from 'react';
import Image from 'next/image';

const Article = ({
  props,
  limit = '',
  plain = false,
  title = '',
  subtitle = '',
  featured = false,
}) => {
  // Categorize items into countries, states, and cities
  const countries = props.filter((item) => item.attributes.type === 'country');
  const states = props.filter((item) => item.attributes.type === 'state');
  const cities = props.filter((item) => item.attributes.type === 'city');

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
                className={`${styles.article_heading_primary} block-reveal observe`}
              >
                {subtitle}
              </h3>
            ) : null}
          </div>
        ) : null}

        <div>
          {/* Render countries */}
          {countries.length > 0 && (
            <>
              <h3
                className={`${styles.article_heading_secondary} block-reveal observe`}
              >
                COUNTRIES
              </h3>
              <div style={{ marginBottom: '4rem' }}>
                {(limit ? countries.slice(0, limit) : countries).map(
                  (item, index) => (
                    <React.Fragment key={`country-${index}`}>
                      <div
                        className={`${styles.article_container}
                        observe fade-in-up
                      `}
                      >
                        <ul className={`${styles.article_section}`}>
                          <li>
                            <Link
                              className={`${styles.article_link}`}
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
                              <div className={`${styles.article_region}`}>
                                {item.attributes.region}
                              </div>
                              <div className={`${styles.article_flag}`}>
                                <Image
                                  src={`/assets/places/${item.attributes.excerpt
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}.png`}
                                  alt={item.attributes.excerpt}
                                  width={45}
                                  height={26}
                                />
                              </div>
                              <div className={`${styles.article_country}`}>
                                <h2>{item.attributes.excerpt}</h2>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                )}
              </div>
            </>
          )}

          {/* Render states */}
          {states.length > 0 && (
            <>
              <h3
                className={`${styles.article_heading_secondary} block-reveal observe`}
              >
                STATES
              </h3>
              <div style={{ marginBottom: '4rem' }}>
                {(limit ? states.slice(0, limit) : states).map(
                  (item, index) => (
                    <React.Fragment key={`state-${index}`}>
                      <div
                        className={`${styles.article_container}
                        observe fade-in-up                
                      `}
                      >
                        <ul className={`${styles.article_section}`}>
                          <li>
                            <Link
                              className={`${styles.article_link}`}
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
                              <div className={`${styles.article_region}`}>
                                {item.attributes.region}
                              </div>
                              <div className={`${styles.article_flag}`}>
                                <Image
                                  src={`/assets/places/${item.attributes.excerpt
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}.png`}
                                  alt={item.attributes.excerpt}
                                  width={45}
                                  height={26}
                                />
                              </div>
                              <div className={`${styles.article_country}`}>
                                <h2>{item.attributes.excerpt}</h2>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                )}
              </div>
            </>
          )}
          {/* Render cities */}
          {cities.length > 0 && (
            <>
              <h3
                className={`${styles.article_heading_secondary} block-reveal observe`}
              >
                CITIES
              </h3>
              <div style={{ marginBottom: '4rem' }}>
                {(limit ? cities.slice(0, limit) : cities).map(
                  (item, index) => (
                    <React.Fragment key={`city-${index}`}>
                      <div
                        className={`${styles.article_container}
                        observe fade-in-up                
                      `}
                      >
                        <ul className={`${styles.article_section}`}>
                          <li>
                            <Link
                              className={`${styles.article_link}`}
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
                              <div className={`${styles.article_region}`}>
                                {item.attributes.region}
                              </div>
                              <div className={`${styles.article_flag}`}>
                                <Image
                                  src={`/assets/places/${item.attributes.excerpt
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}.png`}
                                  alt={item.attributes.excerpt}
                                  width={45}
                                  height={26}
                                />
                              </div>
                              <div className={`${styles.article_country}`}>
                                <h2>{item.attributes.excerpt}</h2>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
