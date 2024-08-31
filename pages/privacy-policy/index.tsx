import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

function Privacy(props) {
  const text = props?.pageData?.text;

  const convertMarkdown = useMarkdownToHtml();

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
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
