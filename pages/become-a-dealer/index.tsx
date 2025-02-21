import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import Banner from 'components/global/banner/Banner';
import CustomMarkdown from 'components/CustomMarkdown';

function Dealer(props) {
  const banner = props?.pageData?.banner;
  const text = props?.pageData?.text;

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
      {banner ? <Banner props={banner} shape="white" /> : null}

      {text ? (
        <div className={`static container_small`}>
          <CustomMarkdown>{text}</CustomMarkdown>
        </div>
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
