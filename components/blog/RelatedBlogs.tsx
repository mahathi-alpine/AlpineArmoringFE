import Link from 'next/link';
import Image from 'next/image';
import styles from './RelatedBlogs.module.scss';
import useLocale from 'hooks/useLocale';

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
          {blogs.map((blog, index) => (
            <div
              key={blog.id || index}
              className={`${styles.relatedBlogs_item}`}
            >
              {blog.attributes?.thumbnail?.data?.attributes?.url && (
                <Link
                  href={`${lang?.blogsURL || '/blog'}/${blog.attributes.slug}`}
                  className={`${styles.relatedBlogs_item_image}`}
                >
                  <Image
                    src={
                      blog.attributes.thumbnail.data.attributes.formats?.medium
                        ?.url || blog.attributes.thumbnail.data.attributes.url
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
                <Link
                  href={`${lang?.blogsURL || '/blog'}/${blog.attributes.slug}`}
                >
                  <h3 className={`${styles.relatedBlogs_item_title}`}>
                    {blog.attributes.title}
                  </h3>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedBlogs;
