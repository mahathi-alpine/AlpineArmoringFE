import { useRouter } from 'next/router';
import styles from './LangSwitcher.module.scss';

export const LanguageSwitcher = (className) => {
  const router = useRouter();

  const languages = router.locales.map((locale) => ({
    code: locale,
    label: locale.toUpperCase(),
  }));

  const currentLanguage =
    languages.find((lang) => lang.code === router.locale) || languages[0];

  const switchLanguage = (langCode) => {
    const { pathname, query } = router;

    // Only handle slug transformation if we have a slug in the URL
    if (query.slug) {
      const currentSlug = query.slug as string;
      // Remove any existing language suffix
      const baseSlug = currentSlug.replace(/-[a-z]{2}$/, '');
      // Construct new slug based on selected language
      const newSlug = langCode === 'en' ? baseSlug : `${baseSlug}-${langCode}`;

      router.push(
        {
          pathname,
          query: { ...query, slug: newSlug },
        },
        undefined,
        { locale: langCode }
      );
    } else {
      // If no slug (e.g., homepage), just change the locale
      router.push(pathname, pathname, { locale: langCode });
    }
  };

  return (
    <div className={`${className} ${styles.langSwitcher}`}>
      <button
        className={`${styles.langSwitcher_flag} ${styles[`langSwitcher_flag_${currentLanguage.label}`]}`}
      >
        <span>{currentLanguage.label}</span>
      </button>

      <ul className={styles.langSwitcher_wrap}>
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              onClick={() => switchLanguage(lang.code)}
              className={`${styles.langSwitcher_flag} ${styles[`langSwitcher_flag_${lang.label}`]}`}
            >
              <span className={styles.langSwitcher_name}>{lang.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
