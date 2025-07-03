import { getPageData } from 'hooks/api';
import Head from 'next/head';
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
import InstagramGrid from 'components/global/social-feed/InstagramGrid';

const mockSocialPosts = [
  {
    platform: 'instagram',
    type: 'reel',
    postId: 'C3JKnuAPbJZ',
    thumbnail:
      'https://d102sycao8uwt8.cloudfront.net/medium_ballistic_bullet_chart_1_82702aa765.jpg',
    caption: 'Amazing sunset drive through the mountains',
    likes: '12K',
    views: '45K',
    comments: '234',
  },
  {
    platform: 'youtube',
    type: 'youtube_short',
    postId: 'N61agu84CrE',
    thumbnail:
      'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=YouTube+Short',
    caption: 'Quick car review in under 60 seconds',
    likes: '8.5K',
    views: '156K',
    comments: '432',
  },
  {
    platform: 'tiktok',
    type: 'tiktok',
    postId: '7333732078158269742',
    username: 'alpinearmoring',
    fullUrl: 'https://www.tiktok.com/@alpinearmoring/video/7333732078158269742',
    thumbnail:
      'https://via.placeholder.com/400x400/000000/FFFFFF?text=TikTok+Video',
    caption: 'POV: You find the perfect parking spot',
    likes: '25K',
    views: '1.2M',
    comments: '876',
  },
  {
    platform: 'instagram',
    type: 'reel',
    postId: 'DLaehL-RUWB',
    thumbnail:
      'https://d102sycao8uwt8.cloudfront.net/medium_ballistic_bullet_chart_1_82702aa765.jpg',
    caption: 'Amazing sunset drive through the mountains',
    likes: '12K',
    views: '45K',
    comments: '234',
  },
  {
    platform: 'youtube',
    type: 'youtube_video',
    postId: 'VIDEO123',
    thumbnail:
      'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=YouTube+Video',
    caption: 'Full detailed review of the latest electric vehicle',
    likes: '15K',
    views: '234K',
    comments: '1.2K',
  },
  {
    platform: 'instagram',
    type: 'reel',
    postId: 'GHI789',
    thumbnail:
      'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Another+Reel',
    caption: 'Behind the scenes of our latest photoshoot',
    likes: '7.8K',
    views: '89K',
    comments: '456',
  },
  // Add more mock posts for testing pagination
  {
    platform: 'tiktok',
    type: 'tiktok',
    postId: '7987654321',
    thumbnail:
      'https://via.placeholder.com/400x400/000000/FFFFFF?text=TikTok+2',
    caption: 'When the beat drops perfectly with the acceleration',
    likes: '45K',
    views: '2.1M',
    comments: '1.5K',
  },
  {
    platform: 'youtube',
    type: 'youtube_short',
    postId: 'SHORT789',
    thumbnail:
      'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=YT+Short+2',
    caption: 'This modification changed everything',
    likes: '12K',
    views: '178K',
    comments: '678',
  },
];

function Home({ homepageData, categories }) {
  const instagramPosts = [
    { url: 'https://www.instagram.com/p/C3JKnuAPbJZ/' },
    { url: 'https://www.instagram.com/p/DLaehL-RUWB/' },
  ];

  const { lang } = useLocale();
  const data = homepageData.data?.attributes;
  const socialPosts = data.socialPostsData || mockSocialPosts;
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

      <InstagramGrid posts={instagramPosts} />
      <SocialFeed socialPosts={socialPosts} />
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
