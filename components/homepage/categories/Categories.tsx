import React from 'react';
import styles from './Categories.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';
// import { API_URL } from 'config/index';

const Categories = ({ props, allVehiclesImage }) => {
  return (
    <>
      <div className={`${styles.categories} container`}>
        {props.map((item) => {
          const data = item.attributes;
          return (
            <div
              className={`${styles.categories_item} observe fade-in-up`}
              key={item.id}
            >
              {data.image.data ? (
                <Image
                  src={`${data.image.data.attributes.url}`}
                  alt={
                    data.image.data.attributes.alternativeText ||
                    'Alpine Armoring'
                  }
                  width={740}
                  height={290}
                  quality={100}
                  className={`${styles.categories_item_image}`}
                />
              ) : null}

              <div className={`${styles.categories_item_content}`}>
                <div className={`${styles.categories_item_content_inner}`}>
                  {data.title ? (
                    <h3 className={`${styles.categories_item_title}`}>
                      {data.title}
                    </h3>
                  ) : null}

                  <div className={`${styles.categories_item_buttons}`}>
                    {data.inventories.data.length > 0 && (
                      <Button
                        href={`/available-now/type/${data.slug}`}
                        className="primary shiny"
                      >
                        {data.slug === 'rental'
                          ? 'Ready to Rent'
                          : 'Available Now / Ready-To-Ship'}
                      </Button>
                    )}

                    {data.slug !== 'pre-owned' && data.slug !== 'rental' && (
                      <Button
                        href={`/vehicles-we-armor/type/${data.slug}`}
                        className="shiny"
                      >
                        {data.title.replace('Armored ', '')} we armor
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className={`${styles.categories_item} observe fade-in-up`}>
          {allVehiclesImage ? (
            <Image
              src={`${allVehiclesImage.url}`}
              alt={allVehiclesImage.alternativeText || 'Alpine Armoring'}
              width={912}
              height={355}
              quality={100}
              className={`${styles.categories_item_image}`}
            />
          ) : null}

          <div className={`${styles.categories_item_content}`}>
            <div className={`${styles.categories_item_content_inner}`}>
              <h3 className={`${styles.categories_item_title}`}>
                All Armored Vehicles
              </h3>

              <div className={`${styles.categories_item_buttons}`}>
                <Button href={`/available-now`} className="primary shiny">
                  Available Now / Ready-To-Ship
                </Button>

                <Button href={`/vehicles-we-armor`} className="shiny">
                  All Types of vehicles we Armor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
