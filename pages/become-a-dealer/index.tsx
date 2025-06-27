import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';
import { getPageData } from 'hooks/api';
import routes from 'routes';
import Banner from 'components/global/banner/Banner';
import CustomMarkdown from 'components/CustomMarkdown';

function Dealer(props) {
  const router = useRouter();
  const { lang } = useLocale();
  const banner = props?.pageData?.banner;
  const text = props?.pageData?.text;

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  return (
    <>
      {banner ? <Banner props={banner} shape="white" /> : null}

      {text ? (
        <div className={`static container_small`}>
          <CustomMarkdown>{text}</CustomMarkdown>
          <p>
            {lang.ifInterestedPlease}&nbsp;
            <span
              onClick={() => {
                router.push(`${lang.contactURL}?source=become-a-dealer`);
              }}
              className="URLRouter"
            >
              {lang.contact}
            </span>{' '}
            {lang.us}.
          </p>
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.becomeDealer;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData.data?.attributes ?? null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, seoData, locale },
  };
}

export default withLocaleRefetch(
  Dealer,
  async (locale) => {
    const data = await getPageData({
      route: routes.becomeDealer.collection,
      populate: 'deep',
      locale,
    });
    return data.data?.attributes || null;
  },
  {
    routeName: 'becomeDealer',
  }
);
