import Link from 'next/link';
import styles from './Locations.module.scss';
import React from 'react';
import Image from 'next/image';

const Article = ({ props, limit = '' }) => {
  // Categorize items into countries, states, and cities
  const countries = props.filter((item) => item.attributes.type === 'country');
  const states = props.filter((item) => item.attributes.type === 'state');
  const cities = props.filter((item) => item.attributes.type === 'city');

  return (
    <div className={`${styles.locations_wrap}`}>
      {/* Render countries */}
      {countries.length > 0 && (
        <div className={`${styles.locations_category}`}>
          <h2 className={`${styles.locations_heading} block-reveal observe`}>
            COUNTRIES
          </h2>

          <div className={`${styles.locations_list}`}>
            {(limit ? countries.slice(0, limit) : countries).map(
              (item, index) => (
                <React.Fragment key={`country-${index}`}>
                  <Link
                    className={`${styles.locations_card} observe fade-in-up`}
                    href={`/locations-we-serve/${item.attributes.slug}`}
                  >
                    <div className={`${styles.locations_card_region}`}>
                      {item.attributes.region}
                    </div>
                    <div className={`${styles.locations_card_flag}`}>
                      <Image
                        src={
                          item.attributes.flag.data?.attributes.formats
                            ?.thumbnail?.url ||
                          item.attributes.flag.data?.attributes.url
                        }
                        alt={item.attributes.excerpt}
                        width={45}
                        height={26}
                      />
                    </div>
                    <div className={`${styles.locations_card_country}`}>
                      <h3>{item.attributes.excerpt}</h3>
                    </div>
                  </Link>
                </React.Fragment>
              )
            )}
          </div>
        </div>
      )}

      {/* Render states */}
      {states.length > 0 && (
        <div className={`${styles.locations_category}`}>
          <h2 className={`${styles.locations_heading} block-reveal observe`}>
            STATES
          </h2>

          <div className={`${styles.locations_list}`}>
            {(limit ? states.slice(0, limit) : states).map((item, index) => (
              <React.Fragment key={`state-${index}`}>
                <Link
                  className={`${styles.locations_card} observe fade-in-up`}
                  href={`/locations-we-serve/${item.attributes.slug}`}
                >
                  <div className={`${styles.locations_card_region}`}>
                    United States
                  </div>
                  <div className={`${styles.locations_card_flag}`}>
                    <Image
                      src={
                        item.attributes.flag.data?.attributes.formats?.thumbnail
                          ?.url || item.attributes.flag.data?.attributes.url
                      }
                      alt={item.attributes.excerpt}
                      width={45}
                      height={26}
                    />
                  </div>
                  <div className={`${styles.locations_card_country}`}>
                    <h3>{item.attributes.excerpt}</h3>
                  </div>
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {/* Render cities */}
      {cities.length > 0 && (
        <div className={`${styles.locations_category}`}>
          <h2 className={`${styles.locations_heading} block-reveal observe`}>
            MAJOR CITIES
          </h2>

          <div className={`${styles.locations_list}`}>
            {(limit ? cities.slice(0, limit) : cities).map((item, index) => (
              <React.Fragment key={`city-${index}`}>
                <Link
                  className={`${styles.locations_card} observe fade-in-up`}
                  href={`/locations-we-serve/${item.attributes.slug}`}
                >
                  <div className={`${styles.locations_card_country}`}>
                    <h3>{item.attributes.excerpt}</h3>
                  </div>
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
