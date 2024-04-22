import { React } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Seo = ({ props }) => {
  const router = useRouter();
  // console.log(router)
  // return null;

  let baseImgUrl = 'https://www.alpineco.com/media/img/about-us/main.png';
  const metaImgHash = `${props?.metaImage?.data?.attributes.hash}`;
  const metaImgUrl = `${baseImgUrl}${metaImgHash}.jpg`;
  let twitter;

  props?.metaSocial?.map((social) => {
    if (social.socialNetwork === 'Twitter') {
      const twitterImgHash = social?.image?.data?.attributes.hash;
      const twitterImgUrl = `${baseImgUrl}${twitterImgHash}.jpg`;
      twitter = {
        title: social.title,
        image: twitterImgUrl,
        description: social.description,
      };
    }
  });
  return (
    <Head>
      <title>{props?.metaTitle || 'Alpine Armoring'}</title>
      <meta
        name="description"
        content={props?.metaDescription || 'Alpine Armoring'}
      />
      <meta
        property="og:title"
        content={props?.metaTitle || 'Alpine Armoring'}
        key="title"
      />
      <meta property="og:description" content={props?.metaDescription} />
      <meta property="og:image" content={metaImgUrl} />
      <meta name="keywords" content={props?.keywords} />
      <meta name="twitter:title" content={twitter?.title} />
      <meta name="twitter:description" content={twitter?.description} />
      <meta name="twitter:image" content={twitter?.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <link
        rel="canonical"
        href={props?.canonicalURL || `https://www.alpineco.com${router.asPath}`}
      />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default Seo;
