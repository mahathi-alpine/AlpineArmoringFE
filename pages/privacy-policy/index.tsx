import { getPageData } from 'hooks/api';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

function Privacy(props) {
  const text = props?.pageData?.text;

  const convertMarkdown = useMarkdownToHtml();

  return (
    <>
      {text ? (
        <div className={`static container_small`}>
          <div
            className={`mt2`}
            dangerouslySetInnerHTML={{ __html: convertMarkdown(text) }}
          ></div>
        </div>
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
