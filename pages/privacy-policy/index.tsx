import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

function Privacy(props) {
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
