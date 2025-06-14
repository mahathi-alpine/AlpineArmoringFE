import { getPageData } from 'hooks/api';
import routes from 'routes';

const getFallbackData = (locale = 'en') => ({
  pageData: {
    seo: {
      metaTitle:
        locale === 'en'
          ? 'Armored Vehicles For Sale: Bulletproof Cars, SUVs, Trucks | Alpine Armoring®'
          : 'Vehículos blindados en venta | Alpine Blindaje Vehículos a prueba de balas',
      metaDescription:
        locale === 'en'
          ? 'Armored vehicles for sale by Alpine Armoring. Find bulletproof SUVs, sedans, vans, and trucks with top-level protection that are completed and available for immediate shipping.'
          : 'Vehículos blindados en venta por Alpine Armoring. Encuentre todoterrenos, camiones, furgonetas, autobuses y sedanes blindados con protección de alto nivel. Envío mundial disponible.',
    },
    banner: {
      title:
        locale === 'en'
          ? 'Armored Vehicles for Sale'
          : 'Vehículos Blindados en Venta',
      subtitle:
        locale === 'en'
          ? '(SUVs, Sedans, Vans, and Trucks) that are <b>completed and available for immediate shipping</b>'
          : '(Todoterrenos, Sedanes, Furgonetas y Camiones) que están <b>completados y disponibles para envío inmediato</b>',
      media: {
        data: {
          attributes: {
            mime: 'video/webm',
            url: 'https://d102sycao8uwt8.cloudfront.net/All_vehciles_filter_banner_8_26_9dbb6fe2dd.webm',
          },
        },
      },
      mediaMP4: {
        data: {
          attributes: {
            mime: 'video/mp4',
            url: 'https://d102sycao8uwt8.cloudfront.net/All_Vehicles_Filter_Banner_8_26_10f8b42114.mp4',
          },
        },
      },
    },
    bottomText: null,
    bottomTextDynamic: null,
    faqs: [],
  },
  vehicles: { data: [], meta: { pagination: { total: 0 } } },
  filters: {},
  searchQuery: null,
  locale,
});

export default async function handler(req, res) {
  const { locale = 'en' } = req.query;

  if (!locale || !['en', 'es'].includes(locale)) {
    return res.status(400).json({ error: 'Invalid locale' });
  }

  const route = routes.inventory;

  try {
    let pageData = await getPageData({
      route: route.collection,
      locale,
    });
    pageData = pageData?.data?.attributes || null;

    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: '',
      sort: 'order',
      populate: 'featuredImage',
      fields:
        'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
      pageSize: 100,
      locale,
    });

    const type = await getPageData({
      route: 'categories',
      custom:
        "populate[inventory_vehicles][fields][0]=''&sort=order:asc&fields[0]=title&fields[1]=slug",
      locale,
    }).then((response) => response?.data);

    const filters = type ? { type } : {};

    const responseData = {
      pageData: pageData || getFallbackData(locale).pageData,
      vehicles: vehicles || { data: [], meta: { pagination: { total: 0 } } },
      filters,
      searchQuery: null,
      locale,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('API Error:', error);

    // Return fallback data instead of error
    const fallbackData = getFallbackData(locale);
    res.status(200).json(fallbackData);
  }
}
