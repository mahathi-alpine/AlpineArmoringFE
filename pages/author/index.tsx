import { getPageData } from 'hooks/api';
import withLocaleRefetch from 'components/withLocaleRefetch';
import routes from 'routes';
import Link from 'next/link';
import CustomMarkdown from 'components/CustomMarkdown';
import LinkedinIcon from 'components/icons/Linkedin';
import styles from './author.module.scss';

function Author(props) {
  return (
    <div className={`${styles.author} container_small`}>
      <h1 className="c-title">Authors</h1>

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
