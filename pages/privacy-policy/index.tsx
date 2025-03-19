import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPageData } from 'hooks/api';
import routes from 'routes';
import CustomMarkdown from 'components/CustomMarkdown';

function Privacy(props) {
  const router = useRouter();
  const [pageData, setPageData] = useState(props.pageData);

  useEffect(() => {
    if (!router.isReady || router.locale === props.locale) return;

    const fetchData = async () => {
      console.log('a');
      const newPageData = await getPageData({
        route: routes.privacyPolicy.collection,
        populate: 'deep',
        locale: router.locale,
      });

      setPageData(newPageData.data?.attributes || null);
    };

    fetchData();
  }, [router.isReady, router.locale, props.locale]);

  const text = pageData?.text;

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
