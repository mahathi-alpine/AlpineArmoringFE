import { getPageData } from 'hooks/api';
import { useEffect, useMemo } from 'react';
import styles from './Downloads.module.scss';
import Banner from 'components/global/banner/Banner';

function Downloads(props) {
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
        {props?.pageData?.OEMBrochures2024 ? (
          <div className={`${styles.downloads_column}`}>
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                OEM Brochures – 2024
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
          {props?.pageData?.PDFDocuments ? (
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                PDF Documents
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

          {props?.pageData?.ArmoredVehicles ? (
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                Armored Vehicles
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
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'all-download',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default Downloads;
