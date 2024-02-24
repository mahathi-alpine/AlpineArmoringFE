import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import styles from './About.module.scss';
import Banner from 'components/global/banner/Banner';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import Seo from 'components/Seo';
import FillingText from 'components/global/filling-text/FillingText';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function About(props) {
  const seoData = props?.pageData?.seo;

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => observerRef.current.observe(item));

    return () => {
      targets.forEach((item) => observerRef.current.unobserve(item));
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
            <Image
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
            ></Image>
          ) : null}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
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
