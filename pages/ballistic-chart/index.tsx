import { useEffect } from 'react';
import { getPageData } from 'lib/api';
// import styles from './Shipping.module.scss';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import Markdown from 'markdown-to-jsx';
// import Link from 'next/link';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Ballistic(props) {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const text = props?.pageData?.text;
  //   return null;
  // console.log(props);

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

      {banner ? <Banner props={banner} center shape="white" /> : null}

      <div className={`static container_small`}>
        {text ? <Markdown>{text}</Markdown> : null}
      </div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'ballistic-chart',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default Ballistic;
