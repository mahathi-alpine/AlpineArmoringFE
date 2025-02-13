import { useRouter } from 'next/router';
import en from '../locales/en';
import es from '../locales/es';

const getLocaleStrings = (locale) => {
  switch (locale) {
    case 'es':
      return es;
    default:
      return en;
  }
};

export const useLocale = () => {
  const router = useRouter();
  const { locale } = router;
  const lang = getLocaleStrings(locale);

  return {
    locale,
    lang,
    router,
  };
};

export default useLocale;
