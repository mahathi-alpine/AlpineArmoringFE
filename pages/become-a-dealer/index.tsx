import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import Markdown from 'markdown-to-jsx';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Dealer(props) {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const text = props?.pageData?.text;

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
      <Seo props={seoData} />

      {banner ? <Banner props={banner} center shape="white" /> : null}

      <div className={`static container_small`}>
        {text ? <Markdown>{text}</Markdown> : null}
      </div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'become-a-dealer',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default Dealer;
