interface RouteTranslations {
  [key: string]: {
    [locale: string]: string;
  };
}

export const routeTranslations: RouteTranslations = {
  'about-us': {
    en: '/about-us',
    es: '/sobre-nosotros',
  },
  'available-now': {
    en: '/available-now',
    es: '/disponible-ahora',
  },
};
