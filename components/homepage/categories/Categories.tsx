import React from 'react';
// import Link from 'next/link';
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
          return null;
        }

        return (
          <div
            className={`${styles.categories_item} ${styles.categories_item_main} observe fade-in-up`}
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
                  data.title + ' | Alpine Armoring®'
                }
                width={740}
                height={290}
                sizes="(max-width: 980px) 40vw, min(22vw, 750px)"
                quality={100}
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
                  {data.hasVehicles ? (
                    <>
                      <Button
                        href={`/${lang.availableNowURL}/${lang.type}/${data.slug}`}
                        className={`${styles.categories_item_buttons_button} primary shiny`}
                        // button
                        // href={
                        //   data.inventory_vehicles?.data.length > 0
                        //     ? `/${lang.availableNowURL}/${lang.type}/${data.slug}`
                        //     : `${lang.vehiclesWeArmorURL}/${lang.type}/${data.slug}`
                        // }
                      >
                        {data.slug === lang.armoredRentalURL
                          ? lang.exploreArmoredRentalVehicles
                          : data.slug === lang.specialOfTheMonth2
                            ? lang.specialOfTheMonthButton
                            : `${lang.explore} ${data.title} ${lang.forSale}`}
                      </Button>
                      {data.slug !== lang.specialOfTheMonth2 &&
                        data.slug !== lang.armoredRentalURL && (
                          <span
                            className={`${styles.categories_item_buttons_info}`}
                          >
                            *{lang.readyToShipNow}
                          </span>
                        )}
                    </>
                  ) : (
                    data.slug !== lang.preOwnedURL &&
                    data.slug !== lang.specialOfTheMonth2 &&
                    data.slug !== lang.armoredRentalURL && (
                      <Button
                        href={`${lang.vehiclesWeArmorURL}/${lang.type}/${data.slug}`}
                        // button
                        className={`${styles.categories_item_buttons_button} ${styles.categories_item_buttons_plain} shiny`}
                      >
                        {lang.explore}&nbsp;
                        {data.title
                          .replace('Armored ', '')
                          .replace(/[Bb]lindado(s)?/g, '')
                          .replace(/[Bb]lindada(s)?/g, '')}{' '}
                        {lang.weArmor}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {allVehiclesImage ? (
        <div className={`${styles.categories_item} observe fade-in-up`}>
          <Image
            src={`${
              allVehiclesImage.formats?.medium?.url || allVehiclesImage.url
            }`}
            alt={
              allVehiclesImage.alternativeText ||
              'All Armored Vehicles | Alpine Armoring®'
            }
            width={740}
            height={290}
            sizes="(max-width: 980px) 40vw, min(22vw, 750px)"
            quality={100}
            className={`${styles.categories_item_image}`}
          />

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
                  {lang.explore}&nbsp;{lang.allArmoredVehiclesForSale}
                </Button>

                <Button
                  href={lang.vehiclesWeArmorURL}
                  className={`${styles.categories_item_buttons_plain} shiny`}
                >
                  {lang.explore}&nbsp;{lang.all}&nbsp;{lang.armored}&nbsp;
                  {lang.vehiclesWeArmor}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Categories;
