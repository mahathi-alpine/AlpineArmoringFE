import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import { useEffect } from 'react';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

function Privacy(props) {
  const banner = props?.pageData?.banner;
  const text = props?.pageData?.text;

  const convertMarkdown = useMarkdownToHtml();

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => observerRef.current.observe(item));

    return () => {
      targets.forEach((item) => observerRef.current.unobserve(item));
    };
  }, []);

  return (
    <>
      {banner ? <Banner props={banner} center shape="white" /> : null}

      {text ? (
        <div
          className={`static container_small`}
          dangerouslySetInnerHTML={{ __html: convertMarkdown(text) }}
        ></div>
      ) : null}
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'privacy-policy',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default Privacy;
