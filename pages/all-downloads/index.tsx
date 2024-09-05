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
        <h2 className={`c-title`}>Vehicles PDFs</h2>
        <ul>
          {props.pageData?.vehiclePDFs?.data.map((item, index) => (
            <li key={index}>
              <a href={`${item.attributes.url}`} target="_blank">
                {item.attributes.alternativeText}
              </a>
            </li>
          ))}
        </ul>
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
