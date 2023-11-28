import styles from './Categories.module.scss';
import Image from 'next/image';
import Button from '../global/Button';
import Link from 'next/link';

const Categories = ( props ) => {    
    return (
        <div className={`${styles.categories} container`}>            
            {props.props.map((item) => {
                const data = item.attributes;
                return (
                    <div className={`${styles.categories_item}`} key={item.id}>    

                        {data.heading ? <h3 className={`${styles.categories_item_title}`}>{ data.heading }</h3> : null }

                        <div className={`${styles.categories_item_buttons}`}>
                            <Button 
                                href={`/inventory?category=${data.slug}`}
                                className="primary"
                            >View In Stock</Button>
                            <Button 
                                href={`/vehicles-we-armor?category=${data.slug}`}
                            >Vehicles we Armor</Button>
                        </div>

                        {data.image.data ? <Image 
                            src={`http://localhost:1337${data.image.data.attributes.url}`} 
                            alt="Description of the image" 
                            width={475} 
                            height={320} 
                            className={`${styles.categories_item_image}`}
                        /> : null }
                    </div>
                );
            })}     
        </div>
    );
};

export default Categories;