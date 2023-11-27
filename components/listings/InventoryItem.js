import Link from 'next/link';
import Image from 'next/image';
import styles from './InventoryItem.module.scss';

const InventoryItem = ({props}) => {
    const data = props.attributes;

    return (
        <div className={`${styles.inventory_item}`}>
            <Link href={`/inventory-vehicles/${data.slug}`}>
                <div className={`${styles.inventory_item_image}`}>
                    <Image 
                        src={`http://localhost:1337${data.mainListImage.data[0].attributes.url}`} 
                        alt="Description of the image" 
                        width={475} 
                        height={320} 
                    />
                </div>
                <div className={`${styles.inventory_item_content}`}>
                    <h2 className={`${styles.inventory_item_title}`}>{ data.title }</h2>
                    <h3 className={`${styles.inventory_item_level}`}>Armored to <span>level A9</span></h3>
                    <ul className={`${styles.inventory_item_info}`}>
                        {data.VIN? <li className={`${styles.inventory_item_info_item}`}>
                            <span>VIN</span>
                            { data.VIN }
                        </li> : null}
                        {data.vehicleID? <li className={`${styles.inventory_item_info_item}`}>
                            <span>Vehicle ID</span>
                            { data.vehicleID }
                        </li> : null}
                        {data.engine? <li className={`${styles.inventory_item_info_item}`}>
                            <span>Engine</span>
                            { data.engine }
                        </li> : null}
                    </ul>
                </div>
            </Link>
        </div>
    );
};

export default InventoryItem;