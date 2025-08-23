import VehicleDetailsPage from 'components/shared/VehicleDetailsPage';
import {
  getVehicleDetailsServerSideProps,
  buildRentalVehicleLanguageUrls,
} from 'utils/vehicleDetailsHelpers';
import { getLocaleStrings } from 'hooks/useLocale';
import routes from 'routes';

function InventoryVehicle(props) {
  return <VehicleDetailsPage {...props} type="rental" />;
}

export async function getServerSideProps({ params, locale }) {
  const lang = getLocaleStrings(locale);

  return getVehicleDetailsServerSideProps(
    { params, locale },
    {
      route: routes.inventory,
      seoTransformations: {
        titlePrefix: lang.rental,
        descriptionReplacement: { from: 'armored', to: 'rental armored' },
      },
      languageUrlBuilder: buildRentalVehicleLanguageUrls,
      canonicalUrlPath:
        routes.rentalVehicles.paths[locale] || routes.rentalVehicles.paths.en,
      thumbnailSource: 'featuredImage',
    }
  );
}

export default InventoryVehicle;
