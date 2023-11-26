import styles from './BannerTop.module.scss';

const TopBanner = ({props}) => {
    const data = props.data.attributes;
    const bannerImage = data.BannerImage.data.attributes.url;

    return (
        <div className={`${styles.banner_top}`}  
            style={{
                backgroundImage: `url(http://localhost:1337${bannerImage})`, 
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}>
            <div className={`${styles.banner_top_content}`}>
                <h1 className={`${styles.banner_top_title}`}>{data.Heading}</h1>  
                <p className={`${styles.banner_top_text}`}>{data.BannerText}</p>   
            </div>        
        </div>
    );
};

export default TopBanner;