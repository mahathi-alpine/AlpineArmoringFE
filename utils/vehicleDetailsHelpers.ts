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
    let data = await getPageData({
      route: config.route.collectionSingle,
      params: `filters[slug][$eq]=${params.slug}`,
      locale,
    });

    if (!data?.data?.length) {
      const baseSlug = params.slug.replace(/-[a-z]{2}$/, '');
      data = await getPageData({
        route: config.route.collectionSingle,
        params: `filters[slug][$eq]=${baseSlug}`,
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
