import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import styles from './About.module.scss';
import Banner from 'components/global/banner/Banner';
import Markdown from 'markdown-to-jsx';
import { CldImage } from 'next-cloudinary';
import Seo from 'components/Seo';
import FillingText from 'components/global/filling-text/FillingText';

function About(props) {
  const seoData = props?.pageData?.seo;
  // console.log(props)

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Seo props={seoData} />

      <div className={`${styles.about}`}>
        {props.pageData?.banner ? (
          <Banner props={props.pageData.banner} center shape="white" />
        ) : null}

        <div className={`${styles.about_text} container_small`}>
          {props.pageData?.text ? (
            <Markdown>{props.pageData.text}</Markdown>
          ) : null}
        </div>

        <div className={`${styles.about_text2} container_small`}>
          {props.pageData?.text2 ? (
            <Markdown>{props.pageData.text2}</Markdown>
          ) : null}
        </div>

        {props.pageData?.quote ? (
          <FillingText data={props.pageData?.quote} dark />
        ) : null}

        <div className={`${styles.about_image} container_small`}>
          {props.pageData?.image1 ? (
            <CldImage
              src={
                props.pageData.image1.data.attributes.formats?.large?.url ||
                props.pageData.image1.data.attributes.url
              }
              alt={
                props.pageData.image1.data.attributes.alternativeText ||
                'Alpine Armoring'
              }
              width={1238}
              height={346}
            ></CldImage>
          ) : null}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  let pageData = await getPageData({
    route: 'about',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default About;