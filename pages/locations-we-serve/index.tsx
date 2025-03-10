import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import routes from 'routes';
import useLocale from 'hooks/useLocale';
import LocationsList from 'components/global/locations/Locations';
import CustomMarkdown from 'components/CustomMarkdown';
import styles from './Locations.module.scss';

function Locations(props) {
  const posts = props?.posts;
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

export default Locations;
