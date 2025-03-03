import { getPageData } from 'hooks/api';
import { useEffect, useMemo } from 'react';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import styles from './Downloads.module.scss';
import Banner from 'components/global/banner/Banner';

function Downloads(props) {
  const { lang } = useLocale();

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  // Sorting function
  const sortItems = useMemo(() => {
    return (items) =>
      items.sort((a, b) => {
        const textA = a.attributes.alternativeText?.toLowerCase();
        const textB = b.attributes.alternativeText?.toLowerCase();
        return textA?.localeCompare(textB);
      });
  }, []);

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // console.error('Error downloading file:', error);
    }
  };

  return (
    <>
      {props.pageData?.banner ? (
        <Banner props={props.pageData.banner} shape="white" />
      ) : null}

      <div className={`${styles.downloads} container_small`}>
        {props?.pageData?.OEMBrochures2024?.data?.length ? (
          <div className={`${styles.downloads_column}`}>
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                {lang.OEMBrochures} – 2024
              </h2>
              <ul>
                {sortItems(props.pageData.OEMBrochures2024.data).map(
                  (item, index) => (
                    <li key={index}>
                      <button
                        onClick={() =>
                          handleDownload(
                            item.attributes.url,
                            item.attributes.name
                          )
                        }
                      >
                        {item.attributes.alternativeText}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        ) : null}

        <div className={`${styles.downloads_column}`}>
          {props?.pageData?.PDFDocuments?.data?.length ? (
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                {lang.PDFDocuments}
              </h2>
              <ul>
                {sortItems(props.pageData.PDFDocuments.data).map(
                  (item, index) => (
                    <li key={index}>
                      <button
                        onClick={() =>
                          handleDownload(
                            item.attributes.url,
                            item.attributes.name
                          )
                        }
                      >
                        {item.attributes.alternativeText}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          ) : null}

          {props?.pageData?.ArmoredVehicles?.data?.length ? (
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                {lang.armoredVehicles}
              </h2>
              <ul>
                {sortItems(props.pageData.ArmoredVehicles.data).map(
                  (item, index) => (
                    <li key={index}>
                      <button
                        onClick={() =>
                          handleDownload(
                            item.attributes.url,
                            item.attributes.name
                          )
                        }
                      >
                        {item.attributes.alternativeText}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          ) : null}

          {props?.pageData?.stockVideos?.data?.length ? (
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                {lang.stockVideos}
              </h2>
              <ul>
                {props.pageData.stockVideos.data.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() =>
                        handleDownload(
                          item.attributes.url,
                          item.attributes.name
                        )
                      }
                    >
                      {item.attributes.alternativeText}
                    </button>
                  </li>
                  // <li key={index}>
                  //   <a href={`${item.attributes.url}`} target="_blank">{item.attributes.alternativeText}</a>
                  // </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.allDownloads;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData.data?.attributes || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, seoData, locale },
  };
}

export default Downloads;
