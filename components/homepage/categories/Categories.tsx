import React from 'react';
import styles from './Categories.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';

const Categories = ({ props, allVehiclesImage }) => {
  return (
    <div className={`${styles.categories} container`}>
      {props.map((item) => {
        const data = item.attributes;
        return (
          <div
            className={`${styles.categories_item} observe fade-in-up`}
            key={item.id}
          >
            {data.image.data ? (
              <picture>
                <source
                  media="(min-width: 500px)"
                  srcSet={data.image.data.attributes.formats?.medium?.url}
                />
                <Image
                  src={`${
                    data.image.data.attributes.formats?.thumbnail?.url ||
                    data.image.data.attributes.url
                  }`}
                  alt={
                    data.image.data.attributes.alternativeText ||
                    'Alpine Armoring'
                  }
                  width={740}
                  height={290}
                  className={`${styles.categories_item_image}`}
                />
              </picture>
            ) : null}

            <div className={`${styles.categories_item_content}`}>
              <div className={`${styles.categories_item_content_inner}`}>
                {data.title ? (
                  <h3 className={`${styles.categories_item_title}`}>
                    {data.title}
                  </h3>
                ) : null}

                <div className={`${styles.categories_item_buttons}`}>
                  {data.inventory_vehicles?.data.length > 0 && (
                    <Button
                      href={`/available-now/type/${data.slug}`}
                      className="primary shiny"
                    >
                      {data.slug === 'rental'
                        ? 'Ready to Rent'
                        : 'Available Now / Ready-To-Ship'}
                    </Button>
                  )}

                  {data.slug !== 'armored-pre-owned' &&
                    data.slug !== 'armored-rental' && (
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
          <picture>
            <source
              media="(min-width: 500px)"
              srcSet={
                allVehiclesImage.formats?.medium?.url || allVehiclesImage.url
              }
            />
            <Image
              src={`${
                allVehiclesImage.formats?.thumbnail?.url || allVehiclesImage.url
              }`}
              alt={allVehiclesImage.alternativeText || 'Alpine Armoring'}
              width={740}
              height={290}
              className={`${styles.categories_item_image}`}
            />
          </picture>
        ) : null}

        <div className={`${styles.categories_item_content}`}>
          <div className={`${styles.categories_item_content_inner}`}>
            <h3 className={`${styles.categories_item_title}`}>
              All &nbsp;Armored Vehicles
            </h3>

            <div className={`${styles.categories_item_buttons}`}>
              <Button href={`/available-now`} className="primary shiny">
                Available Now / Ready-To-Ship
              </Button>

              <Button href={`/vehicles-we-armor`} className="shiny">
                Vehicles we Armor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
