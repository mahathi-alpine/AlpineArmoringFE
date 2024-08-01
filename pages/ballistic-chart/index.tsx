import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Image from 'next/image';
import BallisticChart from 'components/global/ballistic-chart/BallisticChart';

function Ballistic(props) {
  const banner = props?.pageData?.banner;

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
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

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {banner ? <Banner props={banner} center shape="white" /> : null}

      <BallisticChart />

      {props.pageData?.chart.data ? (
        <div>
          <Image
            src={
              props.pageData.chart.data.attributes.url ||
              props.pageData.chart.data.attributes.formats?.medium
            }
            alt={
              props.pageData.chart.data.attributes.alternativeText ||
              'Ballistic Chart'
            }
            layout="responsive"
            width={2200} // specify the natural width of your image
            height={1238} // specify the natural height of your image
            style={{ position: 'relative' }}
          ></Image>
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'ballistic-chart',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default Ballistic;
