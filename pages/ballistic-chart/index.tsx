import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import BallisticChart from 'components/global/ballistic-chart/BallisticChart';
import BallisticChartBottom from 'components/global/ballistic-chart/BallisticChartBottom';

function Ballistic(props) {
  return (
    <div className={`bg-white`}>
      {props.pageData?.banner ? (
        <Banner props={props.pageData.banner} shape="white" />
      ) : null}

      <BallisticChart />
      <BallisticChartBottom />
    </div>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'ballistic-chart',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default Ballistic;
