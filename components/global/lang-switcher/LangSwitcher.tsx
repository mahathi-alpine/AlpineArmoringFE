import { NextPageContext } from 'next';
import useLanguageSwitcher, {
  LanguageDescriptor,
} from 'hooks/useLanguageSwitcher';
import styles from './LangSwitcher.module.scss';
import React, { useCallback, useMemo } from 'react';

export type LanguageSwitcherProps = {
  context?: NextPageContext;
  className?: string;
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
}) => {
  const { currentLanguage, switchLanguage, languageConfig } =
    useLanguageSwitcher();

  const handleLanguageSwitch = useCallback(
    (lang: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      switchLanguage(lang);
    },
    [switchLanguage]
  );

  const { currentLanguageDiv, otherLanguagesDiv, languageClass } =
    useMemo(() => {
      const current = languageConfig.languages.find(
        (ld: LanguageDescriptor) => ld.name === currentLanguage
      );
      const others = languageConfig.languages.filter(
        (ld: LanguageDescriptor) => ld.name !== currentLanguage
      );
      const langClass = `langSwitcher_flag_${current?.title || 'default'}`;

      return {
        currentLanguageDiv: current,
        otherLanguagesDiv: others,
        languageClass: langClass,
      };
    }, [languageConfig, currentLanguage]);

  return (
    <div className={`${className} ${styles.langSwitcher} notranslate`}>
      <div className={`${styles.langSwitcher_flag} ${styles[languageClass]}`}>
        <span>{currentLanguageDiv?.title || 'EN'}</span>
      </div>

      <ul className={styles.langSwitcher_wrap}>
        {otherLanguagesDiv.map((ld: LanguageDescriptor) => {
          const languageClass = `langSwitcher_flag_${ld.title}`;

          return (
            <li key={`l_s_${ld.name}`}>
              <a
                href="#"
                onClick={handleLanguageSwitch(ld.name)}
                className={`${styles.langSwitcher_flag} ${styles[languageClass]}`}
              >
                <span className={styles.langSwitcher_name}>{ld.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
