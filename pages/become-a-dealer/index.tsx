import { useEffect } from 'react';
import { getPageData } from 'lib/api';
// import styles from './Shipping.module.scss';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import Markdown from 'markdown-to-jsx';
// import Link from 'next/link';

function Dealer(props) {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const text = props?.pageData?.text;
  //   return null;
  console.log(props);

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

      {banner ? <Banner props={banner} center shape="white" /> : null}

      <div className={`static container_small`}>
        {text ? <Markdown>{text}</Markdown> : null}
      </div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'become-a-dealer',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default Dealer;
