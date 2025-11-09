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
      '@type': 'LocalBusiness',
      '@id': `${process.env.NEXT_PUBLIC_URL}/#organization`,
      name: 'Alpine Armoring',
      url: process.env.NEXT_PUBLIC_URL,
      logo: {
        '@type': 'ImageObject',
        '@id': `${process.env.NEXT_PUBLIC_URL}/#logo`,
        url: `${process.env.NEXT_PUBLIC_URL}/assets/Alpine-Armoring-Logo.jpg`,
        caption: 'Alpine Armoring Logo',
      },
      image: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_URL}/assets/Alpine-Armoring-Logo.jpg`,
      },
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
        'Armored Vehicle Manufacturing',
        'Ballistic Protection',
        'Vehicle Armoring',
        'Security Vehicles',
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
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '17:00',
      },
      telephone: '+1-703-471-0002',
      email: 'sales@alpineco.com',
      priceRange: '$$$',
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: '38.90491917326487',
          longitude: '-77.4702548649953',
        },
        geoRadius: '20000000',
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
        telephone: '+1-703-471-0002',
        email: 'sales@alpineco.com',
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: ['English'],
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
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            '@id': 'https://www.alpineco.com/armored-vehicles-for-sale#product',
            name: 'Armored Vehicles In Stock',
            description:
              'Completed bulletproof SUVs, sedans, vans, and trucks available for immediate shipping',
            category: [
              'Armored SUVs',
              'Armored Sedans',
              'Armored Pickup Trucks',
              'Armored Law Enforcement',
              'Armored Specialty Vehicles',
            ],
          },
          availability: 'https://schema.org/InStock',
          price: '0',
          priceCurrency: 'USD',
          url: 'https://www.alpineco.com/armored-vehicles-for-sale',
          seller: {
            '@type': 'Organization',
            '@id': 'https://www.alpineco.com/#organization',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.alpineco.com/vehicles-we-armor#service',
            name: 'Custom Vehicle Armoring Service',
            description:
              'Custom armoring service for wide range of vehicle makes and models, from SUVs to luxury cars, with A4 to A12 protection levels',
            category: 'Vehicle Armoring',
          },
          availability: 'https://schema.org/Available',
          areaServed: {
            '@type': 'Place',
            name: 'Worldwide',
          },
          url: 'https://www.alpineco.com/vehicles-we-armor',
          seller: {
            '@type': 'Organization',
            '@id': 'https://www.alpineco.com/#organization',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            '@id':
              'https://www.alpineco.com/available-now/type/armored-pre-owned#product',
            name: 'Armored Pre-Owned Vehicles',
            description: 'Previously armored vehicles available for purchase',
          },
          availability: 'https://schema.org/LimitedAvailability',
          url: 'https://www.alpineco.com/available-now/type/armored-pre-owned',
          seller: {
            '@type': 'Organization',
            '@id': 'https://www.alpineco.com/#organization',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id':
              'https://www.alpineco.com/available-now/type/armored-rental#service',
            name: 'Armored Vehicle Rental',
            description: 'Rental service for armored vehicles',
          },
          availability: 'https://schema.org/Available',
          url: 'https://www.alpineco.com/available-now/type/armored-rental',
          seller: {
            '@type': 'Organization',
            '@id': 'https://www.alpineco.com/#organization',
          },
        },
      ],
    };

    return JSON.stringify(structuredData);
  };

  const getItemListStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Alpine Armoring Product Categories',
      description: 'Complete range of armored vehicles and armoring services',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Product',
            '@id': `${process.env.NEXT_PUBLIC_URL}/available-now/type/armored-suvs#product`,
            name: 'Armored SUVs',
            description:
              'Bulletproof SUVs for Sale with advanced protection and technology, perfect for personal, business, or government security needs.',
            url: 'https://www.alpineco.com/available-now/type/armored-suvs',
            image: `https://d102sycao8uwt8.cloudfront.net/armored_suvs_b7657d92de.jpg`,
            brand: {
              '@type': 'Brand',
              name: 'Alpine Armoring',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'PriceSpecification',
                description: 'Contact for pricing',
                price: '0',
              },
              availability: 'https://schema.org/InStock',
              url: 'https://www.alpineco.com/available-now/type/armored-suvs',
              seller: {
                '@type': 'Organization',
                '@id': 'https://www.alpineco.com/#organization',
              },
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Product',
            '@id':
              'https://www.alpineco.com/available-now/type/armored-sedans#product',
            name: 'Armored Sedans',
            description:
              'Luxury armored sedans providing discreet protection and security',
            url: 'https://www.alpineco.com/available-now/type/armored-sedans',
            image: `https://d102sycao8uwt8.cloudfront.net/armored_sedans_df355f4cbe.jpg`,
            brand: {
              '@type': 'Brand',
              name: 'Alpine Armoring',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'PriceSpecification',
                description: 'Contact for pricing',
                price: '0',
              },
              availability: 'https://schema.org/InStock',
              url: 'https://www.alpineco.com/available-now/type/armored-sedans',
              seller: {
                '@type': 'Organization',
                '@id': 'https://www.alpineco.com/#organization',
              },
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Product',
            '@id':
              'https://www.alpineco.com/available-now/type/armored-pickup-trucks#product',
            name: 'Armored Pickup Trucks',
            description:
              'Heavy-duty armored pickup trucks for tactical and civilian use',
            url: 'https://www.alpineco.com/available-now/type/armored-pickup-trucks',
            image: `https://d102sycao8uwt8.cloudfront.net/armored_pickup_trucks_78270fd729.jpg`,
            brand: {
              '@type': 'Brand',
              name: 'Alpine Armoring',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'PriceSpecification',
                description: 'Contact for pricing',
                price: '0',
              },
              availability: 'https://schema.org/InStock',
              url: 'https://www.alpineco.com/available-now/type/armored-pickup-trucks',
              seller: {
                '@type': 'Organization',
                '@id': 'https://www.alpineco.com/#organization',
              },
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Product',
            '@id':
              'https://www.alpineco.com/available-now/type/armored-law-#product',
            name: 'Armored Law Enforcement Vehicles',
            description:
              'Specialized armored vehicles for law enforcement and SWAT operations',
            url: 'https://www.alpineco.com/available-now/type/armored-law-enforcement',
            image: `https://d102sycao8uwt8.cloudfront.net/armored_SWAT_6263a15e32.jpg`,
            brand: {
              '@type': 'Brand',
              name: 'Alpine Armoring',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'PriceSpecification',
                description: 'Contact for pricing',
                price: '0',
              },
              availability: 'https://schema.org/InStock',
              url: 'https://www.alpineco.com/available-now/type/armored-law-enforcement',
              seller: {
                '@type': 'Organization',
                '@id': 'https://www.alpineco.com/#organization',
              },
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 5,
          item: {
            '@type': 'Product',
            '@id':
              'https://www.alpineco.com/available-now/type/armored-specialty-vehicles#product',
            name: 'Armored Specialty Vehicles',
            description:
              'Custom armored specialty vehicles for unique security requirements',
            url: 'https://www.alpineco.com/available-now/type/armored-specialty-vehicles',
            image: `https://d102sycao8uwt8.cloudfront.net/armored_specialty_vehicles_7ccb22db0e.jpg`,
            brand: {
              '@type': 'Brand',
              name: 'Alpine Armoring',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'PriceSpecification',
                description: 'Contact for pricing',
                price: '0',
              },
              availability: 'https://schema.org/InStock',
              url: 'https://www.alpineco.com/available-now/type/armored-specialty-vehicles',
              seller: {
                '@type': 'Organization',
                '@id': 'https://www.alpineco.com/#organization',
              },
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 6,
          item: {
            '@type': 'Product',
            '@id':
              'https://www.alpineco.com/available-now/type/armored-pre-owned#product',
            name: 'Armored Pre-Owned Vehicles',
            description: `Alpine Armoring's certified pre-owned armored vehicles offer 30-50% savings with A4-A12 protection, rigorous 150-point inspection, and immediate availability.`,
            url: 'https://www.alpineco.com/available-now/type/armored-pre-owned',
            image: `https://d102sycao8uwt8.cloudfront.net/armored_preowned_ae26ef8dee.jpg`,
            brand: {
              '@type': 'Brand',
              name: 'Alpine Armoring',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'PriceSpecification',
                description: 'Contact for pricing',
                price: '0',
              },
              availability: 'https://schema.org/LimitedAvailability',
              url: 'https://www.alpineco.com/available-now/type/armored-pre-owned',
              seller: {
                '@type': 'Organization',
                '@id': 'https://www.alpineco.com/#organization',
              },
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 7,
          item: {
            '@type': 'Service',
            '@id':
              'https://www.alpineco.com/available-now/type/armored-rental#service',
            name: 'Armored Vehicle Rental',
            description: `Explore Alpine Armoring's armored car rentals, offering short-term security solutions with top-tier protection for personal, corporate, or government needs.`,
            url: 'https://www.alpineco.com/available-now/type/armored-rental',
            provider: {
              '@type': 'Organization',
              name: 'Alpine Armoring',
              '@id': 'https://www.alpineco.com/#organization',
            },
            areaServed: {
              '@type': 'Place',
              name: 'Worldwide',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'PriceSpecification',
                description: 'Contact for pricing',
                price: '0',
              },
              availability: 'https://schema.org/InStock',
              url: 'https://www.alpineco.com/available-now/type/armored-rental',
              seller: {
                '@type': 'Organization',
                '@id': 'https://www.alpineco.com/#organization',
              },
            },
          },
        },
      ],
    };

    return JSON.stringify(structuredData);
  };

  const getWebSiteStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://www.alpineco.com/#website',
      url: process.env.NEXT_PUBLIC_URL,
      name: 'Alpine Armoring',
      description:
        'Leading manufacturer of armored vehicles and bulletproof cars',
      publisher: {
        '@id': 'https://www.alpineco.com/#organization',
      },
    };

    return JSON.stringify(structuredData);
  };

  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_URL,
        },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getItemListStructuredData() }}
          key="itemList-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getWebSiteStructuredData() }}
          key="webSite-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
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
