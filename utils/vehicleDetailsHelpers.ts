import { getPageData } from 'hooks/api';
import routes from 'routes';

export interface VehicleDetailsServerSideProps {
  params: { slug: string };
  locale: string;
}

export interface VehicleDetailsConfig {
  route: any;
  seoTransformations?: {
    titlePrefix?: string;
    descriptionReplacement?: { from: string; to: string };
    descriptionReplacements?: Array<{ from: string; to: string }>;
  };
  languageUrlBuilder: (
    currentPage: any,
    currentLocale: string
  ) => Record<string, string>;
  canonicalUrlPath?: string;
}

const buildLanguageUrl = (
  locale: string,
  basePath: string,
  slug: string
): string => {
  return locale === 'en'
    ? `${basePath}/${slug}`
    : `/${locale}${basePath}/${slug}`;
};

const createLanguageUrlBuilder =
  (pathMappings: Record<string, string>) =>
  (currentPage: any, currentLocale: string): Record<string, string> => {
    if (!currentPage?.slug) return {};

    const languageUrls: Record<string, string> = {};
    const currentPath = pathMappings[currentLocale] || pathMappings.en;

    languageUrls[currentLocale] = buildLanguageUrl(
      currentLocale,
      currentPath,
      currentPage.slug
    );

    currentPage.localizations?.data?.forEach((localization: any) => {
      const locale = localization.attributes.locale;
      const localizedPath = pathMappings[locale] || pathMappings.en;
      languageUrls[locale] = buildLanguageUrl(
        locale,
        localizedPath,
        localization.attributes.slug
      );
    });

    if (!languageUrls.en && currentLocale !== 'en') {
      languageUrls.en = buildLanguageUrl(
        'en',
        pathMappings.en,
        currentPage.slug
      );
    }

    return languageUrls;
  };

export const getVehicleDetailsServerSideProps = async (
  { params, locale }: VehicleDetailsServerSideProps,
  config: VehicleDetailsConfig
) => {
  try {
    // Custom populate parameters for vehicle details
    const customPopulate = [
      'populate[featuredImage][populate]=*',
      'populate[gallery][populate]=*',
      'populate[video][populate]=*',
      'populate[videoMP4][populate]=*',
      'populate[categories][fields][0]=title',
      'populate[categories][fields][1]=slug',
      'populate[localizations][fields][0]=slug',
      'populate[localizations][fields][1]=locale',
      'populate[localizations][fields][2]=hide',
      'populate[localizations][fields][3]=title',
      'populate[seo][populate]=*',
      'populate[faqs][populate]=*',
      'populate[OEMWindowSticker][populate]=*',
      'populate[OEMArmoringSpecs][populate]=*',
      'populate[mediaPassword][populate]=*',
      'populate[blogDynamic][populate]=*',
      'fields[0]=VIN',
      'fields[1]=armor_level',
      'fields[2]=color_ext',
      'fields[3]=color_int',
      'fields[4]=createdAt',
      'fields[5]=description',
      'fields[6]=driveTrain',
      'fields[7]=engine',
      'fields[8]=exportField',
      'fields[9]=flag',
      'fields[10]=height',
      'fields[11]=hide',
      'fields[12]=label',
      'fields[13]=length',
      'fields[14]=locale',
      'fields[15]=miles',
      'fields[16]=order',
      'fields[17]=orderCategory',
      'fields[18]=ownPage',
      'fields[19]=power',
      'fields[20]=publishedAt',
      'fields[21]=shortDescription',
      'fields[22]=slug',
      'fields[23]=title',
      'fields[24]=trans',
      'fields[25]=trim',
      'fields[26]=updatedAt',
      'fields[27]=vehicleID',
      'fields[28]=videoURL',
      'fields[29]=weight',
      'fields[30]=wheelbase',
      'fields[31]=wheels',
      'fields[32]=width',
      'fields[33]=year',
    ].join('&');

    let data = await getPageData({
      route: config.route.collectionSingle,
      custom: `filters[slug][$eq]=${params.slug}&${customPopulate}`,
      locale,
    });

    if (!data?.data?.length) {
      const baseSlug = params.slug.replace(/-[a-z]{2}$/, '');
      data = await getPageData({
        route: config.route.collectionSingle,
        custom: `filters[slug][$eq]=${baseSlug}&${customPopulate}`,
        locale,
      });
    }

    if (!data?.data?.length) {
      return { notFound: true };
    }

    const currentPage = data.data[0].attributes;

    // Build fallback SEO data when not provided in Strapi
    const fallbackMetaTitle = currentPage?.title
      ? `${currentPage.title} | Alpine Armoring`
      : 'Alpine Armoring';

    const fallbackMetaDescription = currentPage?.title
      ? `${currentPage.title} available for purchase from Alpine Armoring${currentPage.armor_level ? `. Alpine Level ${currentPage.armor_level} ballistic protection` : ''}. Contact us for pricing and availability.`
      : 'Armored vehicle available for purchase from Alpine Armoring. Contact us for pricing and availability.';

    const seoData = {
      ...(currentPage?.seo ?? {}),
      metaTitle: currentPage?.seo?.metaTitle || fallbackMetaTitle,
      metaDescription:
        currentPage?.seo?.metaDescription || fallbackMetaDescription,
      thumbnail: currentPage?.featuredImage?.data?.attributes ?? null,
      languageUrls: config.languageUrlBuilder(currentPage, locale),
      ...(config.canonicalUrlPath && {
        canonicalURL: `${config.canonicalUrlPath}/${currentPage.slug}`,
      }),
      // Add noindex, follow for sold vehicles
      ...(currentPage?.flag === 'sold' && {
        metaRobots: 'noindex, follow',
      }),
    };

    if (config.seoTransformations && seoData.metaDescription) {
      if (config.seoTransformations.titlePrefix) {
        seoData.metaTitle = `${config.seoTransformations.titlePrefix} ${seoData.metaTitle}`;
      }

      // Handle single replacement (backward compatibility)
      if (config.seoTransformations.descriptionReplacement) {
        const { from, to } = config.seoTransformations.descriptionReplacement;
        seoData.metaDescription = seoData.metaDescription.replace(
          new RegExp(`\\b(${from})\\b`, 'g'),
          to
        );
      }

      // Handle multiple replacements
      if (config.seoTransformations.descriptionReplacements) {
        config.seoTransformations.descriptionReplacements.forEach(
          ({ from, to }) => {
            seoData.metaDescription = seoData.metaDescription.replace(
              new RegExp(`\\b(${from})\\b`, 'g'),
              to
            );
          }
        );
      }
    }

    return {
      props: { data, seoData, locale },
    };
  } catch {
    return { notFound: true };
  }
};

export const buildRentalVehicleLanguageUrls = createLanguageUrlBuilder({
  en: routes.rentalVehicles?.paths?.en || '/rental-vehicles',
  es: routes.rentalVehicles?.paths?.es || '/vehiculos-de-alquiler',
});

export const buildVehicleLanguageUrls = createLanguageUrlBuilder({
  en: '/available-now',
  es: '/disponible-ahora',
});
