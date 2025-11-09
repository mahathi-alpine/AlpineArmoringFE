import Link from 'next/link';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import styles from './News.module.scss';
import React from 'react';
import useLocale from 'hooks/useLocale';
import { useRouter } from 'next/router';
// import XIcon from 'components/icons/X';

const Blog = ({
  props,
  button = false,
  limit = '',
  plain = false,
  title = '',
  subtitle = '',
  featured = false,
  customClass = '',
  type = '',
}) => {
  const { lang } = useLocale();
  const router = useRouter();

  // Helper function to get the correct slug for the current locale
  const getLocalizedSlug = (item: any): string => {
    const currentLocale = router.locale || 'en';
    const data = item.attributes;

    // If the blog is already in the current locale, use its slug
    if (data.locale === currentLocale) {
      return data.slug;
    }

    // Otherwise, look for the localization with the current locale
    if (data.localizations?.data) {
      const localized = data.localizations.data.find(
        (loc: any) => loc.attributes.locale === currentLocale
      );
      if (localized) {
        return localized.attributes.slug;
      }
    }

    // Fallback: use the original slug (might result in 404 if no translation exists)
    return data.slug;
  };

  return (
    <div
      className={`
      ${styles.news}
      ${plain ? styles.news_plain : ''}  
      ${featured ? styles.news_featured : ''}      
      ${customClass ? styles[customClass] : ''}
    `}
    >
      <div className={`${styles.news_inner} container_small`}>
        {subtitle || title ? (
          <div className={`${styles.news_heading}`}>
            {subtitle ? (
              <h3
                className={`${styles.news_heading_secondary} block-reveal observe`}
              >
                {subtitle}
              </h3>
            ) : null}

            {title ? (
              <h2
                className={`${styles.news_heading_primary} observe fade-in-up`}
              >
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}

        <div className={`${styles.news_list}`}>
          {(limit ? props.slice(0, limit) : props).map((item, index) => {
            const localizedSlug = getLocalizedSlug(item);
            const blogDate = item.attributes.date
              ? item.attributes.date
              : item.attributes.publishedAt;
            const date = new Date(blogDate);
            const formattedDate = date.toLocaleString('en-US', {
              // day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            // const isFeaturedAndThirdItem = index === 1 && featured;

            return (
              <React.Fragment key={index}>
                <div
                  className={`
                    ${styles.news_item}
                    observe fade-in-up
                    ${
                      (index === 0 || index === 1) && featured
                        ? styles.news_item_featured
                        : ''
                    }
                  `}
                  key={index}
                >
                  {item.attributes.thumbnail.data?.attributes.url ? (
                    <Link
                      href={`${item.category ? `/${item.category}` : type ? `${lang.blogsURL}` : `${lang.newsURL}`}/${localizedSlug}`}
                      className={`${styles.news_item_image}`}
                    >
                      <Image
                        src={`${
                          item.attributes.thumbnail.data.attributes.formats
                            ?.medium?.url ||
                          item.attributes.thumbnail.data.attributes.url
                        }`}
                        alt={
                          item.attributes.thumbnail.data.attributes
                            .alternativeText || 'Alpine Armoring'
                        }
                        width={700}
                        height={300}
                        sizes="50vw"
                      />
                    </Link>
                  ) : null}

                  <div className={`${styles.news_item_content}`}>
                    <div className={`${styles.news_item_date}`}>
                      <time dateTime={item.attributes.publishedAt}>
                        {formattedDate}
                      </time>
                      {item.attributes.authors?.data?.attributes?.Name && (
                        <>
                          {' • By '}
                          <Link
                            href={`${lang?.authorURL || '/author'}/${item.attributes.authors.data.attributes.slug}`}
                          >
                            {item.attributes.authors.data.attributes.Name}
                          </Link>
                        </>
                      )}
                    </div>

                    <div className={`${styles.news_item_content_main}`}>
                      <div className={`${styles.news_item_content_main_inner}`}>
                        <Link
                          href={`${item.category ? `/${item.category}` : type ? `${lang.blogsURL}` : `${lang.newsURL}`}/${localizedSlug}`}
                        >
                          {button ? (
                            <h3 className={`${styles.news_item_title}`}>
                              {item.attributes.title}
                            </h3>
                          ) : (
                            <h2 className={`${styles.news_item_title}`}>
                              {item.attributes.title}
                            </h2>
                          )}
                        </Link>

                        {item.attributes.excerpt ? (
                          <p className={`${styles.news_item_excerpt}`}>
                            {item.attributes.excerpt}
                          </p>
                        ) : null}
                      </div>

                      <Button
                        href={`${item.category ? `/${item.category}` : type ? `${lang.blogsURL}` : `${lang.newsURL}`}/${localizedSlug}`}
                        className={`${styles.news_item_button} rounded border desktop-only`}
                      >
                        {lang.readMore}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* {isFeaturedAndThirdItem ? (
                  <Link
                    className={`${styles.news_social}`}
                    href="https://x.com/AlpineArmoring"
                    target="_blank"
                  >
                    <XIcon />
                    <div className={`${styles.news_social_content}`}>
                      <h4>Alpine Armoring X</h4>
                      <h3>Follow Us on X</h3>
                    </div>
                  </Link>
                ) : null} */}
              </React.Fragment>
            );
          })}
        </div>

        {button ? (
          <div className={`${styles.news_button}`}>
            <Button
              href={`${type ? `${lang.blogsURL}` : `${lang.newsURL}`}`}
              className={`${styles.news_button_link} rounded primary`}
            >
              {lang.seeAllBlogs}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Blog;
