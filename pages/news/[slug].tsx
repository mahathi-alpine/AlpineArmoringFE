import { getPageData } from 'hooks/api';
import styles from './NewsSingle.module.scss';
import Link from 'next/link';
import ArrowIcon from 'components/icons/Arrow';
import Image from 'next/image';
import PlayIcon from 'components/icons/Play2';
import LinkedinIcon from 'components/icons/Linkedin';
import { useState } from 'react';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

function BlogSingle(props) {
  const data =
    props && props.data && props.data.data[0] && props.data.data[0].attributes;
  const categories = data?.categories?.data;
  const blogDate = data?.date ? data?.date : data?.publishedAt;
  const date = new Date(blogDate);
  const formattedDate = date.toLocaleString('en-GB', {
    // day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const content = data?.content;

  const convertMarkdown = useMarkdownToHtml();

  // Lightbox
  const [selectedTitle, setSelectedTitle] = useState('');
  const [contentType, setContentType] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  const handleLightboxOpen = (title, location, contentType, url = null) => {
    setSelectedTitle(title);
    setContentType(contentType);
    if (contentType === 'video') {
      setVideoSrc(url);
    }
    setLightboxPopupOpen(true);
  };

  const lightboxData = {
    title: selectedTitle,
    contentType: contentType,
    videoSrc: videoSrc,
  };

  // if (!data) {
  //   return null;
  // }

  return (
    <div className={`${styles.blogSingle}`}>
      <div className={`${styles.blogSingle_inner} container_small`}>
        <Link href="/news" className={`${styles.blogSingle_back}`}>
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
            width={1280}
            height={700}
            // sizes={
            // index === 0
            //     ? '(min-width: 1280px ) 75vw, 100vw'
            //     : '(min-width: 1280px ) 40vw, 100vw'
            // }
            className={`${styles.blogSingle_thumbnail}`}
          ></Image>
        ) : null}

        <div className={`${styles.blogSingle_info}`}>
          <div className={`${styles.blogSingle_info_wrap}`}>
            {data.authors.data ? (
              <div className={`${styles.blogSingle_info_box}`}>
                <span className={`${styles.blogSingle_info_box_heading}`}>
                  Author
                  {data.authors.data.attributes.linkedinURL ? (
                    <Link
                      href={data.authors.data.attributes.linkedinURL}
                      target="_blank"
                    >
                      <LinkedinIcon />
                    </Link>
                  ) : null}
                </span>
                <Link
                  className={`${styles.blogSingle_info_box_name}`}
                  href={`/author/${data.authors.data.attributes.slug}`}
                >
                  {data.authors.data.attributes.Name}
                </Link>
              </div>
            ) : null}

            <div className={`${styles.blogSingle_info_box}`}>
              <span className={`${styles.blogSingle_info_box_heading}`}>
                Last Updated
              </span>
              <span className={`${styles.blogSingle_info_box_name}`}>
                {formattedDate}
              </span>
            </div>
          </div>

          <div className={`${styles.blogSingle_tags}`}>
            {categories?.map((item, index) => (
              <div className={`${styles.blogSingle_tags_item}`} key={index}>
                {item.attributes.name}
              </div>
            ))}
          </div>
        </div>

        {content ? (
          <div
            className={`${styles.blogSingle_content} static`}
            dangerouslySetInnerHTML={{ __html: convertMarkdown(content) }}
          ></div>
        ) : null}

        {data?.videos.map((item, index) => (
          <div
            className={`${styles.blogSingle_video}`}
            key={index}
            onClick={() =>
              handleLightboxOpen(item.text, '', 'video', item.videoLink)
            }
          >
            <span>{item.text}</span>
            <PlayIcon />
          </div>
        ))}
      </div>
      {isLightboxPopupOpen ? (
        <LightboxCustom
          isLightboxPopupOpen={isLightboxPopupOpen}
          lightboxData={lightboxData}
          setLightboxPopupOpen={setLightboxPopupOpen}
        />
      ) : null}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.query;

  const data = await getPageData({
    route: 'blogs',
    params: `filters[slug][$eq]=${slug}`,
    populate: 'deep',
  });

  const seoData = data?.data?.[0]?.attributes?.seo ?? null;

  if (!data || !data.data || data.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data, seoData },
  };
}

export default BlogSingle;
