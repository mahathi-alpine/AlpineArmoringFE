import { getPageData } from 'hooks/api';
import styles from './Downloads.module.scss';
import Banner from 'components/global/banner/Banner';

function Downloads(props) {
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
                Vehicles PDFs
              </h2>
              <ul>
                {props.pageData?.OEMBrochures2024?.data.map((item, index) => (
                  <li key={index}>
                    <a href={`${item.attributes.url}`} target="_blank">
                      {item.attributes.alternativeText}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className={`${styles.downloads_column}`}>
          {props?.pageData?.PDFDocuments ? (
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                Vehicles PDFs
              </h2>
              <ul>
                {props.pageData?.PDFDocuments?.data.map((item, index) => (
                  <li key={index}>
                    <a href={`${item.attributes.url}`} target="_blank">
                      {item.attributes.alternativeText}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {props?.pageData?.ArmoredVehicles ? (
            <div className={`${styles.downloads_group}`}>
              <h2 className={`${styles.downloads_group_title}`}>
                Armored Vehicles
              </h2>
              <ul>
                {props.pageData?.ArmoredVehicles?.data.map((item, index) => (
                  <li key={index}>
                    <a href={`${item.attributes.url}`} target="_blank">
                      {item.attributes.alternativeText}
                    </a>
                  </li>
                ))}
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
