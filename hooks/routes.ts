import routes from '../routes';

export interface RouteTranslations {
  [key: string]: {
    [locale: string]: string;
  };
}

export const routeTranslations: RouteTranslations = Object.fromEntries(
  Object.entries(routes).map(([key, value]) => [key, value.paths])
);
