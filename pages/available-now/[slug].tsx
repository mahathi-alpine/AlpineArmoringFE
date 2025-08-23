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
      canonicalUrlPath: '/available-now',
    }
  );
}

// export async function getStaticPaths({ locales }) {
//   try {
//     const slugsResponse = await getPageData({
//       route: 'inventories',
//       fields: 'fields[0]=slug',
//       populate: '/',
//     });

//     if (!Array.isArray(slugsResponse.data)) {
//       throw new Error('Invalid data format');
//     }

//     const paths = slugsResponse.data.reduce((acc, item) => {
//       if (item?.attributes && item.attributes.slug) {
//         // Remove any existing language suffix to get the base slug
//         const baseSlug = item.attributes.slug.replace(/-[a-z]{2}$/, '');

//         locales.forEach((locale) => {
//           // For default locale (en), use base slug
//           // For other locales, add the language suffix
//           const localizedSlug =
//             locale === 'en' ? baseSlug : `${baseSlug}-${locale}`;

//           acc.push({
//             params: { slug: localizedSlug },
//             locale,
//           });
//         });
//       }
//       return acc;
//     }, []);

//     return {
//       paths,
//       fallback: 'blocking',
//     };
//   } catch (error) {
//     return {
//       paths: [],
//       fallback: 'blocking',
//     };
//   }
// }

// export async function getStaticProps({ params, locale }) {
//   const baseSlug = params.slug.replace(/-[a-z]{2}$/, '');

//   const localizedSlug = locale === 'en' ? baseSlug : `${baseSlug}-${locale}`;

//   const data = await getPageData({
//     route: 'inventories',
//     params: `filters[slug][$eq]=${localizedSlug}`,
//     locale,
//   });

//   const seoData = data?.data?.[0]?.attributes?.seo ?? null;

//   if (seoData) {
//     seoData.thumbnail =
//       data?.data?.[0]?.attributes?.featuredImage?.data.attributes ?? null;
//   }

//   if (!data || !data.data || data.data.length === 0) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       data,
//       seoData,
//       locale,
//     },
//     revalidate: 120,
//   };
// }

export default InventoryVehicle;
