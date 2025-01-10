import { useRouter } from 'next/router';
import styles from './LangSwitcher.module.scss';

export const LanguageSwitcher = (className) => {
  const router = useRouter();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === router.locale) || languages[0];

  const switchLanguage = (langCode) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: langCode });
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
