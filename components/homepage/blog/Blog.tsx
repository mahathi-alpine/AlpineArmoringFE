import Link from 'next/link';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import styles from './Blog.module.scss';

const Blog = (props) => {
  // console.log(props)

  return (
    <div className={`${styles.blog}`}>
      <div className={`${styles.blog_inner} container_small`}>
        <div className={`${styles.blog_heading}`}>
          <h3 className={`${styles.blog_heading_secondary}`}>News</h3>
          <h2 className={`${styles.blog_heading_primary}`}>Armoring world</h2>
        </div>

        <div className={`${styles.blog_list}`}>
          {props.props.slice(0, 3).map((item, index) => {
            const date = new Date(item.attributes.publishedAt);
            const formattedDate = date.toLocaleString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                className={`${styles.blog_item} ${
                  index === 0 ? styles.blog_item_featured : ''
                }`}
                key={index}
              >
                {item.attributes.thumbnail.data?.attributes.url ? (
                  <Link
                    href={`/blog/${item.attributes.slug}`}
                    className={`${styles.blog_item_image}`}
                  >
                    <picture>
                      <source
                        media="(min-width: 768px)"
                        srcSet={
                          item.attributes.thumbnail.data.attributes.formats
                            ?.large?.url
                        }
                      />
                      <Image
                        src={
                          item.attributes.thumbnail.data.attributes.formats
                            ?.small.url
                        }
                        alt={
                          item.attributes.thumbnail.data.attributes
                            .alternativeText
                        }
                        fill
                      />
                    </picture>
                  </Link>
                ) : null}

                <div className={`${styles.blog_item_content}`}>
                  <div className={`${styles.blog_item_date}`}>
                    <time dateTime={item.attributes.publishedAt}>
                      {formattedDate}
                    </time>
                  </div>

                  <div className={`${styles.blog_item_content_main}`}>
                    <div className={`${styles.blog_item_content_main_inner}`}>
                      {item.attributes.categories.data.length > 0 ? (
                        <div className={`${styles.blog_item_tags}`}>
                          {item.attributes.categories.data.map(
                            (item, index) => (
                              <div
                                className={`${styles.blog_item_tags_item}`}
                                key={index}
                              >
                                {item.attributes.name}
                              </div>
                            )
                          )}
                        </div>
                      ) : null}

                      <Link href={`/blog/${item.attributes.slug}`}>
                        <h3 className={`${styles.blog_item_title}`}>
                          {item.attributes.title}
                        </h3>
                      </Link>

                      {index === 0 && item.attributes.excerpt ? (
                        <p className={`${styles.blog_item_excerpt}`}>
                          {item.attributes.excerpt}
                        </p>
                      ) : null}
                    </div>

                    <Button
                      href={`/blog/${item.attributes.slug}`}
                      className={`${styles.blog_item_button} border small desktop-only`}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`${styles.blog_button}`}>
          <Button
            href={`/blog`}
            // className={`${styles.blog_button}`}
          >
            See All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
