import React from 'react';
import styles from './Categories.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import useLocale from 'hooks/useLocale';

const Categories = ({ props, allVehiclesImage }) => {
  const { lang } = useLocale();

  return (
    <div className={`${styles.categories} container`}>
      {props.map((item) => {
        const data = item.attributes;

        if (data.title == lang.vansAndBussesTitle) {
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
                      href={`/${lang.availableNowURL}/${lang.type}/${data.slug}`}
                      className="primary shiny"
                    >
                      {data.slug === lang.armoredRentalURL
                        ? lang.readyToRent
                        : data.slug === lang.specialOfTheMonth2
                          ? lang.specialOfTheMonthButton
                          : lang.categoriesMainButton}
                    </Button>
                  )}

                  {data.slug !== lang.preOwnedURL &&
                    data.slug !== lang.specialOfTheMonth2 &&
                    data.slug !== lang.armoredRentalURL && (
                      <Button
                        href={`${lang.vehiclesWeArmorURL}/${lang.type}/${data.slug}`}
                        className="shiny"
                      >
                        {data.title
                          .replace('Armored ', '')
                          .replace(/[Bb]lindado(s)?/g, '')
                          .replace(/[Bb]lindada(s)?/g, '')}{' '}
                        {lang.weArmor}
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
            <h3
              className={`${styles.categories_item_title}`}
              dangerouslySetInnerHTML={{
                __html: lang.allArmoredVehicles,
              }}
            ></h3>

            <div className={`${styles.categories_item_buttons}`}>
              <Button
                href={'/' + lang.availableNowURL}
                className="primary shiny"
              >
                {lang.categoriesMainButton}
              </Button>

              <Button href={lang.vehiclesWeArmorURL} className="shiny">
                {lang.vehiclesWeArmor}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
