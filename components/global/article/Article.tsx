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
            <br />
            <p className={`${styles.article_description}`}>
              Alpine Armoring is dedicated to providing high-quality armored
              vehicles and services across the globe. We proudly serve 178
              countries, ensuring that clients worldwide can benefit from our
              expertise in vehicle armoring. Whether for personal protection,
              business security, or government use, our vehicles are designed to
              meet the highest standards of safety and performance. Explore the
              extensive list of locations we serve and discover how Alpine
              Armoring can deliver unparalleled security solutions wherever you
              are.
            </p>
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
                              href={`/locations-we-serve/${item.attributes.slug}`}
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
                                  style={{
                                    maxHeight: '26px',
                                    minHeight: '26px',
                                  }}
                                  src={
                                    item.attributes.flag.data?.attributes
                                      .formats?.thumbnail?.url ||
                                    item.attributes.flag.data?.attributes.url
                                  }
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
                              href={`/locations-we-serve/${item.attributes.slug}`}
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
                                United States
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
                MAJOR CITIES
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
                              href={`/locations-we-serve/${item.attributes.slug}`}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.boxShadow =
                                  '0 4px 30px 0 #afafae')
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.boxShadow =
                                  '0 4px 30px 0 #e8e5e2')
                              }
                            >
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
