import { getPageData } from 'hooks/api';
import styles from './LocationsSingle.module.scss';
// import Link from 'next/link';
// import ArrowIcon from 'components/icons/Arrow';
import Image from 'next/image';
import routes from 'routes';
import CustomMarkdown from 'components/CustomMarkdown';
import dynamic from 'next/dynamic';
const LandingInquiryForm = dynamic(
  () => import('components/global/form/LandingInquiryForm')
);

function ArticleSingle(props) {
  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;

  const formatSlug = (str) => {
    const withoutDashes = str.replace(/-/g, ' ');
    return withoutDashes.charAt(0).toUpperCase() + withoutDashes.slice(1);
  };

  let content = data?.content;

  if (content && data?.slug) {
    const formattedSlug = formatSlug(data.slug);

    const phrasesToReplace = [
      'Unmatched Security with Alpine Armoring',
      'Superior Protection with Alpine Armoring',
      'Ultimate Security with Alpine Armoring',
      'Secure Your Journey with Alpine Armoring',
      'Stay Safe with Alpine Armoring',
      'Secure Your Ride with Alpine Armoring',
      'Invest in Safety with Alpine Armoring',
      'Ensure Your Safety with Alpine Armoring',
      'Enhance Your Security with Alpine Armoring',
      'Enhance Your Safety with Alpine Armoring',
      'Elevate Your Security with Alpine Armoring',
    ];

    phrasesToReplace.forEach((phrase) => {
      content = content.replace(
        new RegExp(phrase, 'g'),
        `${phrase} in ${formattedSlug}`
      );
    });
  }

  const formData = {
    title: data?.title,
    featuredImage: data?.featuredImage,
  };

  return (
    <div className={`${styles.articleSingle}`}>
      <div className={`${styles.articleSingle_inner} container_small`}>
        {/* <Link
          href="/locations-we-serve"
          className={`${styles.articleSingle_back}`}
        >
          <ArrowIcon />
          All Articles
        </Link> */}

        <h1 className={`${styles.articleSingle_title}`}>{data?.title}</h1>

        {data?.thumbnail.data?.attributes.url ? (
          <Image
            src={
              data.thumbnail.data.attributes.formats?.large?.url ||
              data.thumbnail.data.attributes.url
            }
            alt={
              data.thumbnail.data.attributes.alternativeText ||
              'Alpine Armoring'
            }
            width={1280}
            height={700}
            className={`${styles.articleSingle_thumbnail}`}
          ></Image>
        ) : null}

        {content ? (
          <div className={`${styles.articleSingle_content} static`}>
            <CustomMarkdown>{content}</CustomMarkdown>
          </div>
        ) : null}

        {formData ? (
          <LandingInquiryForm {...formData} className={`formCTA`} />
        ) : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const { locale } = context;
  const route = routes.locationsWeServe;

  const data = await getPageData({
    route: route.collectionSingle,
    params: `filters[slug][$eqi]=${slug}`,
    populate: 'deep',
    locale,
  });

  const seoData = data?.data?.[0]?.attributes?.seo ?? null;

  if (seoData) {
    // Remove "for sale" from metaTitle and metaDescription
    if (seoData.metaTitle) {
      seoData.metaTitle = seoData.metaTitle.replace(/for sale/gi, '').trim();
      seoData.metaTitle = seoData.metaTitle.replace(/\s+/g, ' ');
      seoData.metaTitle = `${seoData.metaTitle} | Alpine Armoring® USA`;
    }
    if (seoData.metaDescription) {
      seoData.metaDescription = seoData.metaDescription
        .replace(/for sale/gi, '')
        .trim();
      seoData.metaDescription = seoData.metaDescription.replace(/\s+/g, ' ');
    }

    seoData.thumbnail =
      data?.data?.[0]?.attributes?.thumbnail?.data.attributes ?? null;
    seoData.languageUrls = route.getLanguageUrls(
      data?.data?.[0]?.attributes,
      locale
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data, seoData, locale },
  };
}

export default ArticleSingle;
