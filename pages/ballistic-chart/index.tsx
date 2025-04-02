import { getPageData } from 'hooks/api';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import routes from 'routes';
import Banner from 'components/global/banner/Banner';
import BallisticChart from 'components/global/ballistic-chart/BallisticChart';
import BallisticChartBottom from 'components/global/ballistic-chart/BallisticChartBottom';

function Ballistic(props) {
  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

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
    props: { pageData, seoData, locale },
  };
}

export default withLocaleRefetch(
  Ballistic,
  async (locale) => {
    const data = await getPageData({
      route: routes.ballisticChart.collection,
      populate: 'deep',
      locale,
    });
    return data.data?.attributes || null;
  },
  {
    routeName: 'ballisticChart',
  }
);
