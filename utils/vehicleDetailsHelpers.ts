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
  };
  languageUrlBuilder: (
    currentPage: any,
    currentLocale: string
  ) => { [key: string]: string };
  canonicalUrlPath: string;
}

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

    // If no data found, try fetching without language suffix
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

    const currentPage = data?.data?.[0]?.attributes;

    const seoData = {
      ...(currentPage?.seo ?? {}),
      thumbnail:
        currentPage?.featuredImage?.data?.attributes ??
        currentPage?.thumbnail?.data?.attributes ??
        null,
      languageUrls: config.languageUrlBuilder(currentPage, locale),
      canonicalURL: `${config.canonicalUrlPath}/${currentPage.slug}`,
    };

    // Apply SEO transformations if provided
    if (config.seoTransformations && seoData.metaDescription) {
      if (config.seoTransformations.titlePrefix) {
        seoData.metaTitle = `${config.seoTransformations.titlePrefix} ${seoData.metaTitle}`;
      }

      if (config.seoTransformations.descriptionReplacement) {
        seoData.metaDescription = seoData.metaDescription.replace(
          new RegExp(
            `\\b(${config.seoTransformations.descriptionReplacement.from})\\b`
          ),
          config.seoTransformations.descriptionReplacement.to
        );
      }
    }

    return {
      props: {
        data,
        seoData,
        locale,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

// Rental vehicles language URL builder
export const buildRentalVehicleLanguageUrls = (
  currentPage: any,
  currentLocale: string
): { [key: string]: string } => {
  const customLanguageUrls: { [key: string]: string } = {};

  // Add current locale URL
  const currentLocalePath =
    routes.rentalVehicles.paths[currentLocale] ||
    routes.rentalVehicles.paths.en;
  customLanguageUrls[currentLocale] =
    currentLocale === 'en'
      ? `${currentLocalePath}/${currentPage.slug}`
      : `/${currentLocale}${currentLocalePath}/${currentPage.slug}`;

  // Add other locale URLs if localizations exist
  if (currentPage.localizations?.data) {
    currentPage.localizations.data.forEach((localization: any) => {
      const localeCode = localization.attributes.locale;
      const localePath =
        routes.rentalVehicles.paths[localeCode] ||
        routes.rentalVehicles.paths.en;
      customLanguageUrls[localeCode] =
        localeCode === 'en'
          ? `${localePath}/${localization.attributes.slug}`
          : `/${localeCode}${localePath}/${localization.attributes.slug}`;
    });
  }

  // Also add English if not already present
  if (!customLanguageUrls['en']) {
    customLanguageUrls['en'] =
      `${routes.rentalVehicles.paths.en}/${currentPage.slug}`;
  }

  return customLanguageUrls;
};

// Available-now vehicles language URL builder
export const buildVehicleLanguageUrls = (
  currentPage: any,
  currentLocale: string
): { [key: string]: string } => {
  if (!currentPage?.slug) {
    return {};
  }

  const languageUrls: { [key: string]: string } = {};

  // Set the URL for the current locale
  const basePaths = {
    en: '/available-now',
    es: '/disponible-ahora',
  };

  // Add current locale URL
  languageUrls[currentLocale] =
    currentLocale === 'en'
      ? `${basePaths[currentLocale]}/${currentPage.slug}`
      : `/es${basePaths[currentLocale]}/${currentPage.slug}`;

  // Add URLs for localized versions
  if (currentPage.localizations?.data) {
    currentPage.localizations.data.forEach((localization: any) => {
      const localeCode = localization.attributes.locale;
      const localizedSlug = localization.attributes.slug;

      languageUrls[localeCode] =
        localeCode === 'en'
          ? `${basePaths[localeCode]}/${localizedSlug}`
          : `/${localeCode}${basePaths[localeCode]}/${localizedSlug}`;
    });
  }

  return languageUrls;
};
