import { getPageData } from 'hooks/api';
import withLocaleRefetch from 'components/withLocaleRefetch';
import routes from 'routes';
import useLocale from 'hooks/useLocale';
import Link from 'next/link';
import CustomMarkdown from 'components/CustomMarkdown';
import LinkedinIcon from 'components/icons/Linkedin';
import styles from './author.module.scss';
import Head from 'next/head';
import { useRouter } from 'next/router';

function Author(props) {
  const { lang } = useLocale();
  const router = useRouter();

  const getCollectionPageStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.authorURL || '/author'}`,
      url: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.authorURL || '/author'}`,
      name: lang?.authors || 'Authors',
      description:
        lang?.locale === 'es'
          ? 'Encuentre los autores de los blogs y otros contenidos del sitio web de Alpine Armoring.'
          : "Find authors of Alpine Armoring website's blogs and other content.",
      inLanguage: router.locale === 'en' ? 'en-US' : router.locale,
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
          name: lang?.home || 'Home',
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang?.authors || 'Authors',
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang?.authorURL || '/author'}`,
        },
      ],
    };

    return JSON.stringify(structuredData);
  };

  const getItemListStructuredData = () => {
    if (!props.pageData || props.pageData.length === 0) return '{}';

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: props.pageData.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Person',
          '@id': `${process.env.NEXT_PUBLIC_URL}${lang?.authorURL || '/author'}/${item.attributes.slug}`,
          name: item.attributes.Name,
          url: `${process.env.NEXT_PUBLIC_URL}${lang?.authorURL || '/author'}/${item.attributes.slug}`,
          ...(item.attributes.position && {
            jobTitle: item.attributes.position,
          }),
          worksFor: {
            '@type': 'Organization',
            name: 'Alpine Armoring',
          },
          ...(item.attributes.linkedinURL && {
            sameAs: item.attributes.linkedinURL,
          }),
        },
      })),
    };

    return JSON.stringify(structuredData);
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: getCollectionPageStructuredData(),
          }}
          key="collectionPage-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getItemListStructuredData() }}
          key="itemList-jsonld"
        />
      </Head>

      <div className={`${styles.author} container_small`}>
        <div className={`b-breadcrumbs`}>
          <Link href="/">{lang?.home || 'Home'}</Link>
          <span>&gt;</span>
          <span className={`b-breadcrumbs_current`}>
            {lang?.authors || 'Authors'}
          </span>
        </div>

        <h1 className="c-title">{lang.authors}</h1>

        <ul className={`${styles.author_list}`}>
          {props.pageData?.map((item, i) => (
            <li key={i} className={`${styles.author_item}`}>
              {/* <h2>{item.attributes.Name}</h2> */}

              {item.attributes.linkedinURL ? (
                <Link href={item.attributes.linkedinURL} target="_blank">
                  <LinkedinIcon />
                </Link>
              ) : null}

              {item.attributes.description ? (
                <div className={`${styles.author_text} static`}>
                  <CustomMarkdown>{item.attributes.description}</CustomMarkdown>
                </div>
              ) : null}

              <Link
                href={`/author/${item.attributes.slug}`}
                className={`${styles.author_text_more}`}
              >
                Read More &gt;
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.author;

  let pageData = await getPageData({
    route: route.collection,
    locale,
  });
  pageData = pageData?.data || null;

  const seoData = {
    metaTitle:
      locale === 'es'
        ? 'Autores del Alpine Armoring®'
        : 'Authors of Alpine Armoring®',
    metaDescription:
      locale === 'es'
        ? `Find authors of Alpine Armoring website's blogs and other content.`
        : 'Encuentre los autores de los blogs y otros contenidos del sitio web de Alpine Armoring.',
    languageUrls: {
      en: '/author',
      es: '/es/autora',
    },
  };

  return {
    props: { pageData, seoData, locale },
  };
}

export default withLocaleRefetch(
  Author,
  async (locale) => {
    const data = await getPageData({
      route: routes.author.collection,
      locale,
    });
    return data.data || null;
  },
  {
    routeName: 'author',
  }
);
