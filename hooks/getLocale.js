import en from '../locales/en';
import es from '../locales/es';

const getLocale = (locale) => {
  switch (locale) {
    case 'es':
      return es;
    default:
      return en;
  }
};

export default getLocale;
