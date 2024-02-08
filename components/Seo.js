import { React } from 'react';
import Head from 'next/head';
const Seo = ({ props }) => {
  // console.log(props)
  // return null;

  let baseImgUrl =
    'https://alpine-armoring-fe.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdqnw5ukdj%2Fimage%2Fupload%2Fv1707233364%2F409152199_871157431682364_6337488385506975161_n_b7a29efb1c.jpg&w=640&q=75';
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
      {/* <title>{`${props?.metaTitle} | Alpine Armoring`}</title> */}
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
      {props?.canonicalURL && (
        <link rel="canonical" href={props.canonicalURL} />
      )}
    </Head>
  );
};

export default Seo;
