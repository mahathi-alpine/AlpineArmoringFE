import { NextPageContext } from "next";
import useLanguageSwitcher, {
  LanguageDescriptor,
} from "hooks/useLanguageSwitcher";
import styles from './LangSwitcher.module.scss';
import Image from 'next/image';
import React from "react";

export type LanguageSwitcherProps = {
  context?: NextPageContext;
  className?: string;
};

export const LanguageSwitcher = ({ context, className }: LanguageSwitcherProps = {}) => {
  const { currentLanguage, switchLanguage, languageConfig } =
    useLanguageSwitcher({ context });

  if (!languageConfig) {
    return null;
  }
  
  const currentLanguageDiv = languageConfig.languages.find(
    (ld: LanguageDescriptor) => ld.name === currentLanguage
  );

  const otherLanguagesDiv = languageConfig.languages.filter(
    (ld: LanguageDescriptor) => ld.name !== currentLanguage
  );

  return (
    <div className={`${className} ${styles.langSwitcher} notranslate`}>

      {currentLanguageDiv && (
        <div className={`${styles.langSwitcher_current}`}>
          <Image
            src={`${currentLanguageDiv?.flag}`}
            alt="Alpine Armoring"
            width={30}
            height={16}
            className={`${styles.langSwitcher_flag}`}
          />
          <span className="">{currentLanguageDiv.name}</span>
        </div>
      )}

      <ul className={`${styles.langSwitcher_wrap}`}>
        {otherLanguagesDiv.map((ld: LanguageDescriptor) => (
          <li key={`l_s_${ld.name}`}>
            <a onClick={switchLanguage(ld.name)} className={`${styles.langSwitcher_item}`}>
              <Image
                src={`${ld.flag}`}
                alt="Alpine Armoring"
                width={30}
                height={16}
                className={`${styles.langSwitcher_flag}`}
              />
              <span className={`${styles.langSwitcher_name}`}>
                {ld.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;