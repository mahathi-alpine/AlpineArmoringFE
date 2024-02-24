import { NextPageContext } from 'next';
import useLanguageSwitcher, {
  LanguageDescriptor,
} from 'hooks/useLanguageSwitcher';
import styles from './LangSwitcher.module.scss';
import React from 'react';

export type LanguageSwitcherProps = {
  context?: NextPageContext;
  className?: string;
};

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps = {}) => {
  const { currentLanguage, switchLanguage, languageConfig } =
    useLanguageSwitcher();

  if (!languageConfig) {
    return null;
  }

  const currentLanguageDiv = languageConfig.languages.find(
    (ld: LanguageDescriptor) => ld.name === currentLanguage
  );

  const otherLanguagesDiv = languageConfig.languages.filter(
    (ld: LanguageDescriptor) => ld.name !== currentLanguage
  );

  const languageClass = `langSwitcher_flag_${currentLanguageDiv?.title}`;

  return (
    <div className={`${className} ${styles.langSwitcher} notranslate`}>
      {currentLanguageDiv && (
        <div className={`${styles.langSwitcher_flag} ${styles[languageClass]}`}>
          <span className="">{currentLanguageDiv.name}</span>
        </div>
      )}

      <ul className={`${styles.langSwitcher_wrap}`}>
        {otherLanguagesDiv.map((ld: LanguageDescriptor) => {
          const languageClass = `langSwitcher_flag_${ld.title}`;

          return (
            <li key={`l_s_${ld.name}`}>
              <a
                onClick={switchLanguage(ld.name)}
                className={`${styles.langSwitcher_flag} ${styles[languageClass]}`}
              >
                <span className={`${styles.langSwitcher_name}`}>
                  {ld.title}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
