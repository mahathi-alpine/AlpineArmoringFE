import styles from './StickyHorizontalSlider.module.scss';
import Image from 'next/image';
import { useEffect } from 'react';

const StickyHorizontalSlider = ({ props }) => { 

  useEffect(() => {
    const windowWidth = window.innerWidth;

    if(windowWidth > 767){
      const container = document.querySelector(".sticky-container") as HTMLElement;
      const elementWrapper = container.querySelector(".sticky-container-inner") as HTMLElement;      
      const horLength = elementWrapper.scrollWidth;
      const distFromTop = container.offsetTop;
      const scrollDistance = distFromTop + horLength - windowWidth;
    
      container.style.height = horLength - windowWidth/3 + "px";
    
      const onScroll = () => {
        const scrollTop = window.scrollY;
        if (scrollTop >= distFromTop && scrollTop <= scrollDistance) {
          elementWrapper.style.transform = "translateX(-"+(scrollTop - distFromTop)+"px)";
        }
      }
  
      const obr = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) { 
          window.addEventListener('scroll', onScroll);
        } else{
          window.removeEventListener('scroll', onScroll);
        }
      });
      obr.observe(container);     
    }

  }, []);

  return (
    <section className={`${styles.stickyHorizontalSlider} sticky-container`}>
      <div className={`${styles.stickyHorizontalSlider_sticky}`}>

        <div className={`${styles.stickyHorizontalSlider_heading} container`}>
          <h2 className={`block-reveal observe`}><span>Triple Certification Process</span></h2>            
        </div>      

        <div className={`${styles.stickyHorizontalSlider_inner} sticky-container-inner`}>

          <div className={`${styles.stickyHorizontalSlider_item} ${styles.stickyHorizontalSlider_item_empty} desktop-only`}></div>

          {props.map((item, index) => (
            <div className={`${styles.stickyHorizontalSlider_item}`} key={item.id}>
                <Image
                    src={`http://localhost:1337${item.image.data.attributes.url}`}
                    alt="Description of the image"
                    width={475}
                    height={320}
                    className={`${styles.stickyHorizontalSlider_item_image}`}
                />
                <div className={`${styles.stickyHorizontalSlider_item_content}`}>
                  <div className={`${styles.stickyHorizontalSlider_item_number}`}>0{index + 1}</div>
                  <div className={`${styles.stickyHorizontalSlider_item_text}`}>
                    <h5 className={`${styles.stickyHorizontalSlider_item_title}`}>{ item.title }</h5>
                    <p className={`${styles.stickyHorizontalSlider_item_description}`}>{ item.description }</p>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StickyHorizontalSlider;
