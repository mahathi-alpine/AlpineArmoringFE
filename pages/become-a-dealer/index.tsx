import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import Banner from 'components/global/banner/Banner';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';
import styles from './Dealer.module.scss';

function Dealer(props) {
  const banner = props?.pageData?.banner;
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
      {banner ? <Banner props={banner} center shape="white" /> : null}

      {props?.pageData?.banner?.title ? (
        <h1
          className={`${styles.title}`}
          dangerouslySetInnerHTML={{ __html: props?.pageData?.banner.title }}
        ></h1>
      ) : null}

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
    route: 'become-a-dealer',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes ?? null;

  const seoData = pageData?.seo ?? null;

  return {
    props: { pageData, seoData },
  };
}

export default Dealer;
