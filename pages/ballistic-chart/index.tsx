import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import routes from 'routes';
import Banner from 'components/global/banner/Banner';
import BallisticChart from 'components/global/ballistic-chart/BallisticChart';
import BallisticChartBottom from 'components/global/ballistic-chart/BallisticChartBottom';

function Ballistic(props) {
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
      {props.pageData?.banner ? (
        <Banner props={props.pageData.banner} shape="white" />
      ) : null}

      <BallisticChart />

      <BallisticChartBottom
        BallisticStandards={props?.pageData?.BallisticStandards}
        bulletPoster={props?.pageData?.bulletPoster?.data?.attributes}
        ammunitionChartPDF={
          props?.pageData?.ammunitionChartPDF.data?.attributes
        }
      />
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.ballisticChart;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData.data?.attributes || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, seoData },
  };
}

export default Ballistic;
