import Link from 'next/link';
import Image from 'next/image';
import styles from './RelatedBlogs.module.scss';
import useLocale from 'hooks/useLocale';
import { useRouter } from 'next/router';

interface BlogAttributes {
  title: string;
  slug: string;
  locale: string;
  thumbnail: {
    data?: {
      attributes: {
        url: string;
        formats?: {
          medium?: {
            url: string;
          };
        };
        alternativeText?: string;
      };
    };
  };
  localizations?: {
    data?: Array<{
      attributes: {
        slug: string;
        locale: string;
      };
    }>;
  };
}

interface RelatedBlog {
  id: number;
  attributes: BlogAttributes;
}

interface RelatedBlogsProps {
  blogs: RelatedBlog[];
}

const RelatedBlogs: React.FC<RelatedBlogsProps> = ({ blogs }) => {
  const { lang } = useLocale();
  const router = useRouter();

  // Helper function to get the correct URL for the current locale
  const getLocalizedBlogUrl = (blog: RelatedBlog): string => {
    const currentLocale = router.locale || 'en';

    // If the blog is already in the current locale, use its slug with the locale-aware path
    if (blog.attributes.locale === currentLocale) {
      return `${lang?.blogsURL || '/blog'}/${blog.attributes.slug}`;
    }

    // Otherwise, look for the localization with the current locale
    if (blog.attributes.localizations?.data) {
      const localized = blog.attributes.localizations.data.find(
        (loc) => loc.attributes.locale === currentLocale
      );
      if (localized) {
        // Found localized version, use locale-aware path
        return `${lang?.blogsURL || '/blog'}/${localized.attributes.slug}`;
      }
    }

    // Fallback: no translation exists, use English URL (not Spanish URL with English slug)
    return `/blog/${blog.attributes.slug}`;
  };

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.relatedBlogs}`}>
      <div className={`${styles.relatedBlogs_inner} container_small`}>
        <h2 className={`${styles.relatedBlogs_title}`}>
          {lang.youMightAlsoLike}
        </h2>

        <div className={`${styles.relatedBlogs_list}`}>
          {blogs.map((blog, index) => {
            const blogUrl = getLocalizedBlogUrl(blog);

            return (
              <article
                key={blog.id || index}
                className={`${styles.relatedBlogs_item}`}
              >
                {blog.attributes?.thumbnail?.data?.attributes?.url && (
                  <Link
                    href={blogUrl}
                    className={`${styles.relatedBlogs_item_image}`}
                  >
                    <Image
                      src={
                        blog.attributes.thumbnail.data.attributes.formats
                          ?.medium?.url ||
                        blog.attributes.thumbnail.data.attributes.url
                      }
                      alt={
                        blog.attributes.thumbnail.data.attributes
                          .alternativeText || 'Alpine Armoring'
                      }
                      width={700}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                )}

                <div className={`${styles.relatedBlogs_item_content}`}>
                  <Link href={blogUrl}>
                    <h3 className={`${styles.relatedBlogs_item_title}`}>
                      {blog.attributes.title}
                    </h3>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RelatedBlogs;
