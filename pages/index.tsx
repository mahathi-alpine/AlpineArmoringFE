import { getPageData } from 'hooks/api';
import Head from 'next/head';
import { useState } from 'react';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import useAnimationObserver from 'hooks/useAnimationObserver';

import HpBanner from 'components/homepage/hp-banner/HpBanner';
import FillingText from 'components/global/filling-text/FillingText';
import Categories from 'components/homepage/categories/Categories';
import TabSection from 'components/homepage/tab-section/TabSection';
import News from 'components/global/news/News';
import Partners from 'components/homepage/partners/Partners';
import SocialFeed from 'components/global/social-feed/SocialFeed';

const videoData = [
  {
    id: '1',
    attributes: {
      title: 'Building Modern Web Apps with Next.js',
      URLExternal: 'dQw4w9WgXcQ', // YouTube video ID
      thumbnailImage:
        'https://d102sycao8uwt8.cloudfront.net/large_ballistic_bullet_chart_1_82702aa765.jpg',
      description:
        'Learn how to build scalable web applications using Next.js framework with modern best practices.',
      duration: '15:42',
      uploadDate: '2024-01-15',
      author: 'TechChannel',
    },
  },
  {
    id: '2',
    attributes: {
      title: 'Custom Video Upload Demo',
      videoFile:
        'https://d102sycao8uwt8.cloudfront.net/Alpine_Armoring_homepage_video_6_16_25_7c8ebcf56e.webm', // Direct file path
      thumbnailImage:
        'https://d102sycao8uwt8.cloudfront.net/large_ballistic_bullet_chart_1_82702aa765.jpg',
      description:
        'This is a demo of a manually uploaded video file with custom thumbnail support.',
      duration: '10:34',
      uploadDate: '2024-01-10',
      author: 'VideoCreator',
    },
  },
  {
    id: '1',
    attributes: {
      title: 'Building Modern Web Apps with Next.js',
      URLExternal: 'dQw4w9WgXcQ', // YouTube video ID
      thumbnailImage:
        'https://d102sycao8uwt8.cloudfront.net/large_ballistic_bullet_chart_1_82702aa765.jpg',
      description:
        'Learn how to build scalable web applications using Next.js framework with modern best practices.',
      duration: '15:42',
      uploadDate: '2024-01-15',
      author: 'TechChannel',
    },
  },
  {
    id: '1',
    attributes: {
      title: 'Building Modern Web Apps with Next.js',
      URLExternal: 'dQw4w9WgXcQ', // YouTube video ID
      thumbnailImage:
        'https://d102sycao8uwt8.cloudfront.net/large_ballistic_bullet_chart_1_82702aa765.jpg',
      description:
        'Learn how to build scalable web applications using Next.js framework with modern best practices.',
      duration: '15:42',
      uploadDate: '2024-01-15',
      author: 'TechChannel',
    },
  },
  {
    id: '1',
    attributes: {
      title: 'Building Modern Web Apps with Next.js',
      URLExternal: 'dQw4w9WgXcQ', // YouTube video ID
      thumbnailImage:
        'https://d102sycao8uwt8.cloudfront.net/large_ballistic_bullet_chart_1_82702aa765.jpg',
      description:
        'Learn how to build scalable web applications using Next.js framework with modern best practices.',
      duration: '15:42',
      uploadDate: '2024-01-15',
      author: 'TechChannel',
    },
  },
  {
    id: '1',
    attributes: {
      title: 'Building Modern Web Apps with Next.js',
      URLExternal: 'dQw4w9WgXcQ', // YouTube video ID
      thumbnailImage:
        'https://d102sycao8uwt8.cloudfront.net/large_ballistic_bullet_chart_1_82702aa765.jpg',
      description:
        'Learn how to build scalable web applications using Next.js framework with modern best practices.',
      duration: '15:42',
      uploadDate: '2024-01-15',
      author: 'TechChannel',
    },
  },
  // Add more videos...
];

function Home({ homepageData, categories }) {
  const { lang } = useLocale();
  const data = homepageData.data?.attributes;

  const getOrganizationStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Alpine Armoring',
      url: process.env.NEXT_PUBLIC_URL,
      logo: `${process.env.NEXT_PUBLIC_URL}/assets/Alpine-Armoring-Armored-Vehicles.png`,
      description:
        'An internationally recognized leader of high-quality, custom-manufactured armored vehicles, headquartered in Virginia, USA',
      foundingDate: '1993',
      industry: 'Armored Vehicle Manufacturing',
      numberOfEmployees: '50-200',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4170 Lafayette Center Drive #100',
        addressLocality: 'Chantilly',
        addressCountry: 'US',
        addressRegion: 'Virginia',
        postalCode: '20151',
      },
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
      areaServed: 'Worldwide',
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: '38.90491917326487',
          longitude: '-77.4702548649953',
        },
        geoRadius: 'global',
      },
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

  const posts = blogs.concat(news);

  // Animations
  useAnimationObserver({
    dependencies: [homepageData, categories],
  });

  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    console.log('Selected video:', video);
    console.log(selectedVideo);
  };

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

        {/* {ballistingTestings && !data?.disableCoolVideos ? (
          <div className={`observe fade-in-up`}>
            <VideosPopup props={ballistingTestings} />
          </div>
        ) : null} */}

        <div className="shape-after shape-after-white"></div>
      </div>

      {posts.length ? (
        <News
          props={posts}
          button
          limit="3"
          subtitle={lang.hpLatestNews}
          customClass="newsHomepage"
          type="blogs"
        />
      ) : null}

      {partners ? <Partners props={partners} /> : null}

      <SocialFeed videos={videoData} onVideoSelect={handleVideoSelect} />
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
