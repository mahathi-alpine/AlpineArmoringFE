import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// This HOC (Higher-Order Component) adds locale-aware refetching
// to any component using getStaticProps
export default function withLocaleRefetch(
  Component,
  fetchDataFn, // Function to fetch new data based on locale
  dataKey = 'pageData' // The prop name that holds the data
) {
  return function WrappedComponent(props) {
    const router = useRouter();
    const [data, setData] = useState(props[dataKey]);

    useEffect(() => {
      if (!router.isReady || router.locale === props.locale) return;

      const refetchData = async () => {
        const newData = await fetchDataFn(router.locale);
        setData(newData);
      };

      refetchData();
    }, [router.isReady, router.locale, props.locale]);

    // Create new props with the updated data
    const updatedProps = {
      ...props,
      [dataKey]: data,
    };

    return <Component {...updatedProps} />;
  };
}
