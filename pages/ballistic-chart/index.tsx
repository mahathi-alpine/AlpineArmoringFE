import BallisticChart from 'components/global/ballistic-chart/BallisticChart';
import BallisticChartBottom from 'components/global/ballistic-chart/BallisticChartBottom';

function Ballistic() {
  return (
    <div className={`bg-white`}>
      <BallisticChart />
      <BallisticChartBottom />
    </div>
  );
}

export default Ballistic;
