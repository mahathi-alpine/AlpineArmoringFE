import { getPageData } from 'hooks/api';
import routes from 'routes';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import useLocale from 'hooks/useLocale';
import LocationsList from 'components/global/locations/Locations';
import CustomMarkdown from 'components/CustomMarkdown';
import styles from './Locations.module.scss';

function Locations(props) {
  const posts = props?.posts;
  const { lang } = useLocale();

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  return (
    <>
      <div className={`${styles.locations}`}>
        <div className={`${styles.locations_inner} container_small`}>
          <div className={`${styles.locations_heading}`}>
            <h1 className={`${styles.locations_title} block-reveal observe`}>
              {lang.locationsWeServe}
            </h1>
            {props.pageData?.defaultText ? (
              <div className={`${styles.locations_description}`}>
                <CustomMarkdown>{props.pageData?.defaultText}</CustomMarkdown>
              </div>
            ) : null}
          </div>

          {posts ? <LocationsList props={posts} /> : null}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.locationsWeServe;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  const pageSize = 100;
  let allPosts = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await getPageData({
      route: route.collectionSingle,
      populate: 'flag, localizations, seo',
      sort: 'excerpt',
      fields:
        'fields[0]=excerpt&fields[1]=locale&fields[2]=order&fields[3]=region&fields[4]=slug&fields[5]=title&fields[6]=type',
      pageSize: pageSize,
      page: page,
    });
    const posts = response?.data || [];
    allPosts = [...allPosts, ...posts];
    totalPages = response?.meta?.pagination?.pageCount || 1;
    page++;
  }

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, posts: allPosts, seoData, locale },
  };
}

export default withLocaleRefetch(
  Locations,
  {
    pageData: async (locale) => {
      const data = await getPageData({
        route: routes.locationsWeServe.collection,
        populate: 'deep',
        locale,
      });
      return data.data?.attributes || null;
    },
    posts: async (locale) => {
      const pageSize = 100;
      let allPosts = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await getPageData({
          route: routes.locationsWeServe.collectionSingle,
          populate: 'flag, localizations, seo',
          sort: 'excerpt',
          fields:
            'fields[0]=excerpt&fields[1]=locale&fields[2]=order&fields[3]=region&fields[4]=slug&fields[5]=title&fields[6]=type',
          pageSize: pageSize,
          page: page,
          locale,
        });
        const posts = response?.data || [];
        allPosts = [...allPosts, ...posts];
        totalPages = response?.meta?.pagination?.pageCount || 1;
        page++;
      }

      return allPosts;
    },
  },
  {
    routeName: 'locationsWeServe',
  }
);
