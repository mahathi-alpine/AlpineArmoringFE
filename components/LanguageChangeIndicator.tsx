import React from 'react';
import { useLanguage } from 'hooks/LanguageContext';
import styles from './LoadingIndicator.module.scss';

const LanguageChangeIndicator = () => {
  const { isChangingLanguage, pendingRequests } = useLanguage();
  const showLoader = isChangingLanguage || pendingRequests;

  if (!showLoader) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
        <p>Changing language...</p>
      </div>
    </div>
  );
};

export default LanguageChangeIndicator;
