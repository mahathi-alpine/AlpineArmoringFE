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
                className={`${styles.article_heading_secondary} block-reveal observe`}
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
              <h3>Countries</h3>
              <div>
                {(limit ? countries.slice(0, limit) : countries).map(
                  (item, index) => (
                    <React.Fragment key={`country-${index}`}>
                      <div
                        className={`
                        observe fade-in-up                
                      `}
                        style={{ display: 'inline-grid' }}
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
                                  flexGrow: 1,
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
                  )
                )}
              </div>
            </>
          )}

          {/* Render states */}
          {states.length > 0 && (
            <>
              <h3>States</h3>
              <div>
                {(limit ? states.slice(0, limit) : states).map(
                  (item, index) => (
                    <React.Fragment key={`state-${index}`}>
                      <div
                        className={`
                        observe fade-in-up                
                      `}
                        style={{ display: 'inline-grid' }}
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
                                  flexGrow: 1,
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
                  )
                )}
              </div>
            </>
          )}

          {/* Render cities */}
          {cities.length > 0 && (
            <>
              <h3>Cities</h3>
              <div>
                {(limit ? cities.slice(0, limit) : cities).map(
                  (item, index) => (
                    <React.Fragment key={`city-${index}`}>
                      <div
                        className={`
                        observe fade-in-up                
                      `}
                        style={{ display: 'inline-grid' }}
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
                                  flexGrow: 1,
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
