import VehicleDetailsPage from 'components/shared/VehicleDetailsPage';
import {
  getVehicleDetailsServerSideProps,
  buildVehicleLanguageUrls,
} from 'utils/vehicleDetailsHelpers';
import routes from 'routes';

function InventoryVehicle(props) {
  return <VehicleDetailsPage {...props} type="available-now" />;
}

export async function getServerSideProps({
  params,
  locale,
}: {
  params: { slug: string };
  locale: string;
}) {
  return getVehicleDetailsServerSideProps(
    { params, locale },
    {
      route: routes.inventory,
      languageUrlBuilder: buildVehicleLanguageUrls,
    }
  );
}

export default InventoryVehicle;
