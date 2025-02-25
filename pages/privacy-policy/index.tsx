import { getPageData } from 'hooks/api';
import routes from 'routes';
import CustomMarkdown from 'components/CustomMarkdown';

function Privacy(props) {
  const text = props?.pageData?.text;

  return (
    <>
      {text ? (
        <div className={`static container_small`}>
          <div className={`mt2`}>
            <CustomMarkdown>{text}</CustomMarkdown>
          </div>
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.privacyPolicy;

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

export default Privacy;
