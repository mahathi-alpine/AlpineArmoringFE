import React from 'react';
import styles from './Categories.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import { API_URL } from 'config/index';

const Categories = (props) => {
  const data = props.props.data;
  
  return (
    <div className={`${styles.categories} container`}>
      {data.map((item) => {
        const data = item.attributes;
        return (
          <div className={`${styles.categories_item}`} key={item.id}>

            {data.image.data ? (
              <Image
                src={`${API_URL}${data.image.data.attributes.url}`}
                alt="Description of the image"
                width={608}
                height={236}
                className={`${styles.categories_item_image}`}
              />
            ) : null}

            <div className={`${styles.categories_item_content}`}>

              {data.heading ? (
                <h3 className={`${styles.categories_item_title}`}>
                  {data.heading}
                </h3>
              ) : null}

              <div className={`${styles.categories_item_buttons}`}>
                <Button
                  href={`/inventory?category=${data.slug}`}
                  className="primary button_small"
                >
                  View In Stock
                </Button>

                <Image
                  src={'/assets/logoAlpine.png'}
                  alt="Logo Alpine"
                  width={37}
                  height={44}
                  className={`${styles.categories_item_buttons_logo} desktop-only`}
                />

                <Button 
                  href={`/vehicles-we-armor?category=${data.slug}`}
                  className="button_small"
                >
                  Vehicles we armor
                </Button>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};

export default Categories;
