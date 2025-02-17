import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import styles from './CookieConsent.module.scss';
import Script from 'next/script';
import useLocale from 'hooks/useLocale';

// Extend Window interface to include gtag and dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    ['ga-disable-G-HQE6WWZ9E4']?: boolean;
  }
}

type ConsentType = 'undecided' | 'accepted' | 'rejected';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<ConsentType>('undecided');
  const { lang } = useLocale();

  useEffect(() => {
    // Check for existing consent
    const existingConsent = getCookie('cookie-consent');

    if (existingConsent) {
      const parsedConsent = existingConsent as ConsentType;
      setConsent(parsedConsent);

      // If previously accepted, prepare analytics
      // if (parsedConsent === 'accepted') {
      //   initializeAnalytics();
      // }
    } else {
      // Show popup if no previous consent
      setIsVisible(true);
    }
  }, []);

  // const initializeAnalytics = () => {
  //   // Ensure dataLayer and gtag are initialized
  //   window.dataLayer = window.dataLayer || [];
  //   window.gtag =
  //     window.gtag ||
  //     function (...args: any[]) {
  //       window.dataLayer.push(...args);
  //     };

  //   // Reinitialize GA
  //   window.gtag('js', new Date());
  //   window.gtag('config', 'G-HQE6WWZ9E4', {
  //     page_path: window.location.pathname,
  //   });
  // };

  const handleConsent = (decision: ConsentType) => {
    // Store consent with comprehensive options
    setCookie('cookie-consent', decision, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Update state
    setConsent(decision);
    setIsVisible(false);

    // Handle analytics based on consent
    // if (decision === 'accepted') {
    //   initializeAnalytics();
    // } else {
    //   // Disable GA
    //   window['ga-disable-G-HQE6WWZ9E4'] = true;
    // }
  };

  // Determine if consent popup should be shown
  const shouldShowConsent = isVisible && consent === 'undecided';

  return (
    <>
      {/* Conditional Google Analytics Script */}
      {consent === 'accepted' && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-HQE6WWZ9E4"
            strategy="afterInteractive"
          />
          <Script
            id="ga-setup"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(...arguments);}
                gtag('js', new Date());
                gtag('config', 'G-HQE6WWZ9E4', { page_path: window.location.pathname });
              `,
            }}
          />
        </>
      )}

      {/* Consent Popup */}
      {shouldShowConsent && (
        <div className={styles.CookieConsent_container}>
          <div className={styles.CookieConsent_popup}>
            <div className={styles.CookieConsent_header}>
              <h2>{lang.cookieTitle}</h2>
            </div>

            <p className={styles.CookieConsent_description}>
              {lang.cookieText}
            </p>

            <div className={styles.CookieConsent_buttonContainer}>
              <button
                onClick={() => handleConsent('accepted')}
                className={`${styles.CookieConsent_button} ${styles.acceptButton}`}
              >
                {lang.acceptAll}
              </button>

              <button
                onClick={() => handleConsent('rejected')}
                className={`${styles.CookieConsent_button} ${styles.rejectButton}`}
              >
                {lang.rejectAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
