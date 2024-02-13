import { getPageData } from 'lib/api';
import styles from './BlogSingle.module.scss';
import Link from 'next/link';
import ArrowIcon from 'components/icons/Arrow';
import Image from 'next/image';
import Markdown from 'markdown-to-jsx';

function BlogSingle(props) {
  const data = props.data?.data[0]?.attributes;
  //   console.log(data);
  const categories = data?.categories?.data;
  const date = new Date(data?.publishedAt);
  const formattedDate = date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const content = data?.content;

  return (
    <div className={`${styles.blogSingle}`}>
      <div className={`container_small`}>
        <Link href="/blog" className={`${styles.blogSingle_back}`}>
          <ArrowIcon />
          All News
        </Link>

        <h1 className={`${styles.blogSingle_title}`}>{data?.title}</h1>

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
            width={1500}
            height={800}
            // sizes={
            // index === 0
            //     ? '(min-width: 1280px ) 75vw, 100vw'
            //     : '(min-width: 1280px ) 40vw, 100vw'
            // }
            className={`${styles.blogSingle_thumbnail}`}
          ></Image>
        ) : null}

        <div className={`${styles.blogSingle_info}`}>
          <div className={`${styles.blogSingle_date}`}>{formattedDate}</div>

          <div className={`${styles.blogSingle_tags}`}>
            {categories?.map((item, index) => (
              <div className={`${styles.blogSingle_tags_item}`} key={index}>
                {item.attributes.name}
              </div>
            ))}
          </div>
        </div>

        {content ? (
          <div className={`${styles.blogSingle_content} static`}>
            <Markdown>{content}</Markdown>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const slugsResponse = await getPageData({
    route: 'blogs',
    //   populate: 'featuredImage',
  });

  const slugs = slugsResponse.data.map((item) => item.attributes.slug);

  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const data = await getPageData({
    route: 'blogs',
    params: `filters[slug][$eq]=${slug}`,
    populate: 'deep',
  });

  return {
    props: { data },
    revalidate: 60,
  };
}

export default BlogSingle;
