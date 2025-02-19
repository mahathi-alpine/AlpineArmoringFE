interface RouteTranslations {
  [key: string]: {
    [locale: string]: string;
  };
}

export const routeTranslations: RouteTranslations = {
  'about-us': {
    en: '/about-us',
    es: '/hacerca-de-nosotros',
  },
  'available-now': {
    en: '/available-now',
    es: '/disponible-ahora',
  },
};
