import HpBanner from '../components/homepage/HpBanner';
import Categories from '../components/homepage/Categories';
import { getPageData } from '../lib/api';
import { useEffect, useRef } from 'react';
import VideoScale, { animateVideo } from '/components/global/VideoScale';
import TextTransform, { textTransformAnimate } from '/components/global/TextTransform';
import IntroText from '/components/homepage/IntroText';

function Home( props ) {
  // console.log(props)
  const topBanner = props.homepageData?.data?.attributes.topBanner;
  const categories = props.categories?.data;

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Fade-ins
          if(entry.target.classList.contains('animate')){
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
          }

          // Video Scale
          if(entry.target.classList.contains('videoScaleContainer')){
            window.addEventListener('scroll', () => animateVideo(entry.target), { passive: true });
          }

          // TextTransform
          if(entry.target.classList.contains('textTransform')){
            window.addEventListener('scroll', () => textTransformAnimate(entry.target), { passive: true });
          }
        } else { 
          // Unset Video Scale
          if(entry.target.classList.contains('videoScaleContainer')){     
            window.removeEventListener('scroll', () => animateVideo(entry.target));
          }
          if(entry.target.classList.contains('textTransform')){
            window.removeEventListener('scroll', () => textTransformAnimate(entry.target));
          }
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.4, 
    }
   );
   
   targets.forEach(item => observer.observe(item));
  
   // Clean up the observer when the component unmounts
   return () => {
    targets.forEach(item => observer.unobserve(item));
     observer.disconnect();
   };
  }, []);

  return (
    <div>

      {topBanner ? <HpBanner props={topBanner}/> : null}

      <IntroText />

      <VideoScale props="masserati.mp4" />

      {/* <TextTransform text1="Alpine Armoring" text2="Triple Certification Process"/> */}
      
      {categories ? 
        <div className="background-dark">
          <Categories props={categories}/> 
        </div>
      : null}

    </div>
  );
}

export async function getServerSideProps(context) {
  const homepageData = await getPageData('homepage');
  const categories = await getPageData('categories');

  return {
    props: { homepageData, categories }
  };
}

export default Home;