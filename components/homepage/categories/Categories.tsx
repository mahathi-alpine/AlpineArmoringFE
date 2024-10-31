import React from 'react';
import styles from './Categories.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';

const Categories = ({ props, allVehiclesImage }) => {
  return (
    <div className={`${styles.categories} container`}>
      {props.map((item) => {
        const data = item.attributes;

        if (data.title == 'Vans & Busses') {
          return;
        }

        return (
          <div
            className={`${styles.categories_item} observe fade-in-up`}
            key={item.id}
          >
            {data.image.data ? (
              <Image
                src={`${
                  data.image.data.attributes.formats?.medium?.url ||
                  data.image.data.attributes.url
                }`}
                alt={
                  data.image.data.attributes.alternativeText ||
                  'Alpine Armoring'
                }
                width={740}
                height={290}
                sizes="(max-width: 768px) 80vw, (max-width: 1600px) 50vw, 33vw"
                // quality={100}
                className={`${styles.categories_item_image}`}
              />
            ) : null}

            <div className={`${styles.categories_item_content}`}>
              <div
                className={`shapeCurved_topLeft shapeCurved_small shapeCurved_white shapeCurved`}
              ></div>
              <div
                className={`shapeCurved_topRight shapeCurved_small shapeCurved_white shapeCurved`}
              ></div>

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
                      {data.slug === 'armored-rental'
                        ? 'Ready to Rent'
                        : data.slug === 'special-of-the-month'
                          ? 'CHECK OUT OUR LIMITED OFFER DEALS!'
                          : 'Available Now / Ready-To-Ship'}
                    </Button>
                  )}

                  {data.slug !== 'armored-pre-owned' &&
                    data.slug !== 'special-of-the-month' &&
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
          <Image
            src={`${
              allVehiclesImage.formats?.medium?.url || allVehiclesImage.url
            }`}
            alt={allVehiclesImage.alternativeText || 'Alpine Armoring'}
            width={740}
            height={290}
            sizes="(max-width: 768px) 80vw, (max-width: 1600px) 50vw, 33vw"
            // quality={100}
            className={`${styles.categories_item_image}`}
          />
        ) : null}

        <div className={`${styles.categories_item_content}`}>
          <div
            className={`shapeCurved_topLeft shapeCurved_small shapeCurved_white shapeCurved`}
          ></div>
          <div
            className={`shapeCurved_topRight shapeCurved_small shapeCurved_white shapeCurved`}
          ></div>

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
