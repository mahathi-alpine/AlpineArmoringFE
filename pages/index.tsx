import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import useLocale from 'hooks/useLocale';
import routes from 'routes';

import HpBanner from 'components/homepage/hp-banner/HpBanner';
import FillingText from 'components/global/filling-text/FillingText';
import Categories from 'components/homepage/categories/Categories';
import TabSection from 'components/homepage/tab-section/TabSection';
import News from 'components/global/news/News';
import Partners from 'components/homepage/partners/Partners';
const VideosPopup = dynamic(
  () => import('components/global/videos-popup/VideosPopup')
);

function Home({ homepageData, categories }) {
  const { lang } = useLocale();
  const data = homepageData.data?.attributes;

  const getOrganizationStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      image:
        'https://www.alpineco.com/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Fmedium_About_us_hompage_thumbnail_1_ea1c33f592.JPG&w=640&q=75',
      url: 'https://www.alpineco.com',
      logo: 'https://www.alpineco.com/assets/Alpine-Armoring-Armored-Vehicles.png',
      name: 'Alpine Armoring',
      description:
        'An internationally recognized leader of high-quality, custom-manufactured armored vehicles, headquartered in Virginia, USA',
      email: 'sales@alpineco.com',
      telephone: '+1 703 471 0002',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4170 Lafayette Center Drive #100',
        addressLocality: 'Chantilly',
        addressCountry: 'US',
        addressRegion: 'Virginia',
        postalCode: '20151',
      },
    };

    return JSON.stringify(structuredData);
  };

  // Your existing const declarations...
  const topBanner = {
    title: data?.topBannerTitle,
    description: data?.topBannerDescription,
    video: data?.bannerVideo,
  };
  const quote = data?.quote;
  const categoriesData = categories?.data;
  const hpMiddleText = data?.hpMiddleText;
  const tabSectionData = data?.tabSection;
  const allVehiclesImage = data?.allVehiclesImage?.data?.attributes;
  const ballistingTestings = data?.ballistingTestingsMedia;
  const partners = data?.industryPartners;
  const news =
    data?.news?.data?.map((item) => ({
      ...item,
      category: 'news',
    })) || [];

  const blogs =
    data?.blog_evergreens?.data?.map((item) => ({
      ...item,
      category: 'blog',
    })) || [];

  const posts = blogs.concat(news);

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
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getOrganizationStructuredData() }}
          key="organization-jsonld"
        />
      </Head>

      {topBanner ? <HpBanner props={topBanner} /> : null}

      <div className="background-dark">
        {quote ? <FillingText className={`padding pt-2`} data={quote} /> : null}

        {categoriesData && (
          <Categories
            props={categoriesData}
            allVehiclesImage={allVehiclesImage}
          />
        )}

        {hpMiddleText ? (
          <FillingText className="padding hpBottomText" data={hpMiddleText} />
        ) : null}

        {tabSectionData ? <TabSection props={tabSectionData} /> : null}

        {ballistingTestings && !data?.disableCoolVideos ? (
          <div className={`observe fade-in-up`}>
            <VideosPopup props={ballistingTestings} />
          </div>
        ) : null}

        <div className="shape-after shape-after-white"></div>
      </div>

      {posts.length ? (
        <News
          props={posts}
          button
          limit="3"
          subtitle={lang.hpLatestNews}
          customClass="newsHomepage"
        />
      ) : null}

      {partners ? <Partners props={partners} /> : null}
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.homepage;

  const homepageData = await getPageData({
    route: route.collection,
    locale,
  });

  const categories = await getPageData({
    route: 'categories',
    sort: 'order',
    populate: 'image, inventory_vehicles',
    fields: 'fields[0]=slug&fields[1]=title&fields[2]=order',
    custom:
      'populate[inventory_vehicles][fields]=title&populate=image&sort=order:asc&fields[0]=slug&fields[1]=title&fields[2]=order',
    locale,
  });

  const currentPage = homepageData?.data?.attributes;

  const seoData = {
    ...(currentPage?.seo ?? {}),
    languageUrls: route.getLanguageUrls(currentPage, locale),
  };

  return {
    props: { homepageData, categories, seoData, locale },
  };
}

export default Home;
