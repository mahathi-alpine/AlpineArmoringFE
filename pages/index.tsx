import { getPageData } from 'hooks/api';
import Head from 'next/head';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import useAnimationObserver from 'hooks/useAnimationObserver';

import HpBanner from 'components/homepage/hp-banner/HpBanner';
import FillingText from 'components/global/filling-text/FillingText';
import Categories from 'components/homepage/categories/Categories';
import Event from 'components/global/event/Event';
import TabSection from 'components/homepage/tab-section/TabSection';
import News from 'components/global/news/News';
import Partners from 'components/homepage/partners/Partners';

function Home({ homepageData, categories }) {
  const { lang } = useLocale();
  const data = homepageData.data?.attributes;

  const getOrganizationStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://www.alpineco.com/#organization',
      name: 'Alpine Armoring',
      url: process.env.NEXT_PUBLIC_URL,
      logo: `${process.env.NEXT_PUBLIC_URL}/assets/Alpine-Logo.png`,
      description:
        'An internationally recognized leader of high-quality, custom-manufactured armored vehicles, pioneer of A12 .50 BMG protection technology, headquartered in Virginia, USA',
      foundingDate: '1993',
      naics: '336211',
      isicV4: '2910',
      keywords: [
        'armored vehicles for sale',
        'bulletproof cars',
        'armored SUVs',
        'ballistic protection',
        'A12 armor level',
        '.50 caliber protection',
        'MASTIFF armored truck',
        'Armored Vehicle Manufacturing, Ballistic Protection, Vehicle Armoring, Security Vehicles',
      ],
      slogan: 'No one protects you better',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4170 Lafayette Center Drive #100',
        addressLocality: 'Chantilly',
        addressRegion: 'Virginia',
        postalCode: '20151',
        addressCountry: 'US',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '38.90491917326487',
          longitude: '-77.4702548649953',
        },
      },
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: '38.90491917326487',
          longitude: '-77.4702548649953',
        },
        geoRadius: 'global',
      },
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
        description: 'Global delivery and service network',
      },
      knowsAbout: [
        {
          '@type': 'DefinedTermSet',
          '@id':
            'https://www.alpineco.com/ballistic-chart#alpine-protection-standards',
        },
        {
          '@type': 'TechArticle',
          '@id': 'https://www.alpineco.com/ballistic-chart#nij-standard',
        },
        {
          '@type': 'TechArticle',
          '@id': 'https://www.alpineco.com/ballistic-chart#cen-standard',
        },
      ],
      makesOffer: [
        {
          '@type': 'Service',
          name: 'Vehicle Armoring Service',
          description: 'Custom armoring from A4 to A12 protection levels',
        },
        {
          '@type': 'Product',
          name: 'Armored Vehicles',
          category: 'Bulletproof Cars and SUVs',
        },
      ],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          name: 'VPAM VR7 Certification',
          credentialCategory: 'Ballistic Testing Certification',
        },
        {
          '@type': 'EducationalOccupationalCredential',
          name: 'US Army Aberdeen Proving Ground Certification',
          credentialCategory: 'Military Testing Standards',
        },
      ],
      award: [
        "World's First Civilian .50 BMG Protection (A12 Level)",
        '30 Years of Armoring Excellence',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1 703 471 0002',
        email: 'sales@alpineco.com',
        contactType: 'customer service',
      },
      sameAs: [
        'https://www.instagram.com/alpinearmoring/',
        'https://x.com/AlpineArmoring',
        'https://www.facebook.com/AlpineArmoring/',
        'https://www.linkedin.com/company/alpinearmoring/',
        'https://www.youtube.com/c/AlpineArmoring',
        'https://www.tiktok.com/@alpinearmoring',
        'https://www.threads.com/@alpinearmoring/',
      ],
    };

    return JSON.stringify(structuredData);
  };

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
  const partners = data?.industryPartners;
  const event = data?.event;
  // const ballistingTestings = data?.ballistingTestingsMedia;

  const news =
    data?.news?.data?.map((item) => ({
      ...item,
      category: lang.news.toLowerCase(),
    })) || [];

  const blogs =
    data?.blog_evergreens?.data?.map((item) => ({
      ...item,
      category: lang.blog.toLowerCase(),
    })) || [];

  const posts = news.concat(blogs);

  // Animations
  useAnimationObserver({
    dependencies: [homepageData, categories],
  });

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getOrganizationStructuredData() }}
          key="organization-jsonld"
        />
      </Head>

      {topBanner && <HpBanner props={topBanner} />}

      <div className="background-dark">
        {quote && <FillingText className={`padding pt-2`} data={quote} />}

        {categoriesData && (
          <Categories
            props={categoriesData}
            allVehiclesImage={allVehiclesImage}
          />
        )}

        {event && <Event data={event} />}

        {hpMiddleText && (
          <FillingText className="padding hpBottomText" data={hpMiddleText} />
        )}

        {tabSectionData && <TabSection props={tabSectionData} />}

        {/* {ballistingTestings && !data?.disableCoolVideos ? (
          <div className={`observe fade-in-up`}>
            <VideosPopup props={ballistingTestings} />
          </div>
        ) : null} */}

        <div className="shape-after shape-after-white"></div>
      </div>

      {posts.length && (
        <News
          props={posts}
          button
          limit="4"
          subtitle={lang.hpLatestNews}
          customClass="newsHomepage"
          type="blogs"
        />
      )}

      {partners && <Partners props={partners} />}
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
    // custom:
    //   'populate[inventory_vehicles][fields]=title&populate=image&sort=order:asc&fields[0]=slug&fields[1]=title&fields[2]=order',
    custom:
      'populate=image&sort=order:asc&fields[0]=slug&fields[1]=title&fields[2]=order',
    locale,
  });

  const categoriesArray = categories?.data || categories || [];
  const categoriesWithStatus = await Promise.all(
    (Array.isArray(categoriesArray) ? categoriesArray : []).map(
      async (category) => {
        const vehicleCheck = await getPageData({
          route: 'inventories',
          custom: `filters[categories][slug][$eq]=${category.attributes.slug}&pagination[limit]=1&fields=id`,
          locale,
        });

        return {
          ...category,
          attributes: {
            ...category.attributes,
            hasVehicles: vehicleCheck.data?.length > 0,
          },
        };
      }
    )
  );

  const currentPage = homepageData?.data?.attributes;

  const languageUrls = {
    en: ``,
    es: `/es`,
  };

  const seoData = {
    ...(currentPage?.seo ?? {}),
    languageUrls,
  };

  return {
    props: {
      homepageData,
      categories: { data: categoriesWithStatus },
      seoData,
      locale,
    },
  };
}

export default Home;
